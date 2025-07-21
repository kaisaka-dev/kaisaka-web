import { annualProgramModel } from '$lib/models/annualProgramModel.js';
import { ChildrenModel } from '$lib/models/childrenModel.js';
import { InterventionModel } from '$lib/models/interventionModel.js';
import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import type { QueryConfigurationBuilder } from '$lib/types/manager.js';
import { type Worksheet } from 'exceljs';
import { reportConversion } from '../types/report-conversion.js';
import { ReportGenerator } from './reportTemplate.js';

/** 
 * Returns an ISO date range representing birthdays for a given age range.
 *
 * @param {number} minAge - The minimum age (inclusive).
 * @param {number | null} [maxAge] - The maximum age (inclusive). If null or undefined, upper bound is not applied.
 * @returns {{ gte?: string, lte: string }} - The calculated birthday range in ISO date format.
 */
export function getBirthdayRangeForAge(minAge: number, maxAge?: number | null) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // For minimum age: person must be born on or before this date to be at least minAge
  const maxBirthDate = new Date(currentYear - minAge, currentMonth, currentDay);
  
  // For maximum age: person must be born on or after this date to be at most maxAge
  const minBirthDate = maxAge !== null && maxAge !== undefined 
    ? new Date(currentYear - maxAge - 1, currentMonth, currentDay + 1)
    : null;

  return {
    gte: minBirthDate ? minBirthDate.toISOString().slice(0, 10) : undefined,
    lte: maxBirthDate.toISOString().slice(0, 10)
  };
}

const ageGroups = [
      { min: 0,  max: 5,    label: '0-5 years'   },
      { min: 6,  max: 11,   label: '6-11 years'  },
      { min: 12, max: 17,   label: '12-17 years' },
      { min: 18, max: 25,   label: '18-25 years' },
      { min: 26, max: null, label: '26+ years'   }
    ];

const disabilities = [
  { 
    ilike: '',
    label: 'All' 
  },
  { 
    ilike: 'Down Syndrome',
    label: 'Down Syndrome' 
  }
];

const genders = ['Male', 'Female'];

/**
 * Represents the parameters for a single report cell.
 */
interface InTheProgramHeaderParams {
  ageGroup: typeof ageGroups[number];
  ageIndex: number;
  disability: typeof disabilities[number];
  disabilityIndex: number;
  sex: string;
  sexIndex: number;
}

/**
 * Represents the result of a single cell query.
 */
interface cellResults {
  age_group: string,
  disability: string,
  sex: string,
  indices: number[],
  count: number,
  error: string
};

const logger = getLogSidecar();

const childrenSelectClause            = `*, disability_category!inner(name), members!inner(first_name, last_name, sex, birthday)`

const interventionSelectClause        = `*, disability_category!inner(name), members!inner(first_name, last_name, sex, birthday), intervention!inner(intervention)` // `*, children!inner(id, members!inner(first_name, last_name, sex, birthday), disability_category!inner(name))`;

const improvedSelectClause            = `*, disability_category!inner(name), members!inner(first_name, last_name, sex, birthday), intervention!inner(intervention, intervention_history!inner(improvement, status))`;

const transitionSelectClause          = '*, disability_category!inner(name), members!inner(first_name, last_name, sex, birthday)'

const cellAddressInProgramReportTemplate = (columnOffset: number, sexIndex: number) => columnOffset != 2 
  ? 5 + sexIndex + columnOffset * 2                           // Weird offset because of the 3rd column having merged cells in the template
  : 5 + sexIndex * 2 + columnOffset * 2 

export class InTheProgramReportGenerator extends ReportGenerator {

  /**
   * Entry point for generating the full Excel report.
   *
   * @param {number} startYear - Current reporting year.
   * @returns {Promise<Buffer>} - Buffer containing the Excel file.
   */
  static async generateReport(startYear: number, endYear: number) {
    logger.info('Started report for In the Program');
    const {data, error} = await this.generateWorkbook('TEMPLATE_A1-InTheProgram.xlsx');
    
    if (error)
      throw error
    await this.generateData(startYear, endYear, data.sheet);

    return await data.workbook.xlsx.writeBuffer();
  }

  /**
   * Populates the Excel worksheet with all layers of report data.
   *
   * @param {number} currentYear - Reporting year.
   * @param {Worksheet} worksheet - ExcelJS worksheet instance.
   */
  static async generateData(startYear: number, endYear: number, worksheet: Worksheet) {
    await Promise.all([
      await this.writeCWDLayer(startYear, endYear, worksheet),
      await this.writeDataLayer(worksheet)
    ])
    await this.getReportSummary(worksheet)
    await this.getReportDifference(worksheet)
  }

  static async writeCWDLayer(startYear: number, endYear: number, worksheet: Worksheet) {
    const row = worksheet.getRow(9)
    const newCWDCurrentYear = await annualProgramModel.instance.findByStartAndEndYear(startYear, endYear)
    if (!newCWDCurrentYear)
      throw Error(`No Annual Program detected from ${startYear} to ${endYear}`)

    const oldCWDPreviousYear = await annualProgramModel.instance.findPreviousWorkYear(newCWDCurrentYear[0].id)

    if (!oldCWDPreviousYear)
      throw Error(`No previous Annual Program detected from Annual Program ${startYear}-${endYear}`)
    
    const oldCWDPreviousYearCell = row.getCell(8)
    const newCWDCurrentYearCell = row.getCell(11)
    const totalCWDCell = row.getCell(6);
    oldCWDPreviousYearCell.value = oldCWDPreviousYear[0].target_new_cwds 
    newCWDCurrentYearCell.value = newCWDCurrentYear[0].target_new_cwds
    totalCWDCell.value = {formula: 'K9 + H9'}
    await row.commit();
  }

  /**
   * Writes the result count to a specific worksheet cell.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model to query.
   * @param {string} modelSelectClause - SQL join select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query filters.
   * @param {number} columnOffset - Report section offset.
   * @param {InTheProgramHeaderParams} reportParams - Cell query parameters.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static writeResultToWorksheet = async (
    modelInstance: ChildrenModel | InterventionModel , 
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder,
    columnOffset: number,
    reportParams: InTheProgramHeaderParams,
    worksheet: Worksheet
  ) => {
    const result = await this.queryCountDatabase(modelInstance, modelSelectClause, modelFilter, reportParams)
    const row = worksheet.getRow(21 + reportParams.ageIndex * 2 + reportParams.disabilityIndex)
    const cellAddress = cellAddressInProgramReportTemplate(columnOffset, reportParams.sexIndex)
    const cell = row.getCell(cellAddress)
    
    cell.value = result.count > 0 ? result.count : ''
    await row.commit()
  }

  /**
   * Executes all queries for a given age/disability/sex combination.
   *
   * @param {InTheProgramHeaderParams} reportParams - Parameters for the report cell.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static async ReportQueryWriter (reportParams: InTheProgramHeaderParams, worksheet: Worksheet) {
    const writeResult = (
      modelInstance: ChildrenModel | InterventionModel, 
      modelSelectClause: string, 
      modelFilter: QueryConfigurationBuilder, 
      columnOffset: number
    ) => this.writeResultToWorksheet(modelInstance, modelSelectClause, modelFilter, columnOffset, reportParams, worksheet)

    logger.info(`Cell (${reportParams.ageIndex}, ${reportParams.disabilityIndex}, ${reportParams.sexIndex}) - ${reportParams.ageGroup.label}, ${reportParams.disability.label}, ${reportParams.sex}`)

    const birthdayRange = getBirthdayRangeForAge(reportParams.ageGroup.min, reportParams.ageGroup.max);
    
    const childrenConfig: QueryConfigurationBuilder = {
      eq: {
        'members.sex': reportParams.sex,
        'is_active': true
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
    }

    const interventionConfig: QueryConfigurationBuilder = {
      eq: {
        'members.sex': reportParams.sex,
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
    };  

    const improvedConfig: QueryConfigurationBuilder = {
      eq: {
        'intervention.intervention_history.status': 'Improved',
        'members.sex': reportParams.sex
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
    }

    const transitionConfig: QueryConfigurationBuilder = {
      eq: {
        'members.sex': reportParams.sex,
        'is_active': false,
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
    }

    await Promise.all([
      writeResult(ChildrenModel.instance, childrenSelectClause,             childrenConfig,     0),
      writeResult(ChildrenModel.instance, interventionSelectClause,         interventionConfig, 1),
      writeResult(ChildrenModel.instance, improvedSelectClause,             improvedConfig,     2),   
      writeResult(ChildrenModel.instance, transitionSelectClause,           transitionConfig,   4) // again, weird offset by the template.
    ])
  }

  /**
   * Queries the database and returns count results for a given parameter group.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model instance to query.
   * @param {string} modelSelectClause - SQL-like select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query conditions.
   * @param {InTheProgramHeaderParams} headerParams - Reporting parameters.
   * @returns {Promise<cellResults>} - Count and metadata for the report cell.
   */
  static async queryCountDatabase (
    modelInstance: ChildrenModel | InterventionModel , 
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder, 
    headerParams: InTheProgramHeaderParams
  ): Promise<cellResults> {
    const { ageGroup, disability, sex, ageIndex, disabilityIndex, sexIndex } = headerParams;

    const cell_result = {
      age_group: ageGroup.label,
      disability: disability.label,
      sex: sex,
      indices: [ageIndex, disabilityIndex, sexIndex],
      count: 0,
      error: ""
    };

    
    try {
      const result = await modelInstance.findWithJoinAndCount(modelSelectClause, modelFilter);
      logger.info(`${JSON.stringify(result.data)} ${JSON.stringify(modelFilter)}`)
      cell_result.count = (result.count) ?? 0;
    } catch (error) {
      cell_result.error = JSON.stringify(error)
    } 
    return cell_result
  }

  /**
   * Iterates all genders for a given report param and writes their data.
   *
   * @param {InTheProgramHeaderParams} reportParam - Report parameters to clone.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static SexReportLayer = async (reportParam: InTheProgramHeaderParams, worksheet: Worksheet) => {
    await Promise.all(genders.map(async (sex, sexIndex) => {
      const paramClone = { ...reportParam, sex, sexIndex };
      await this.ReportQueryWriter(paramClone, worksheet);
    }));
  }
  
    /**
   * Iterates all disabilities for a given report param and writes their data.
   *
   * @param {InTheProgramHeaderParams} reportParam - Report parameters to clone.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static DisabilityReportLayer = async (reportParam: InTheProgramHeaderParams, worksheet: Worksheet) => {
    await Promise.all(disabilities.map(async (disability, disabilityIndex) => {
      const paramClone = { ...reportParam, disability, disabilityIndex };
      await this.SexReportLayer(paramClone, worksheet);
    }));
  }
  
  /**
   * Iterates all age groups and writes the full data layer to worksheet.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static writeDataLayer = async (worksheet: Worksheet) => {
    await Promise.all(ageGroups.map(async (ageGroup, ageIndex) => {
      const paramClone = { ageGroup, ageIndex } as InTheProgramHeaderParams;
      await this.DisabilityReportLayer(paramClone, worksheet);
    }));
  }

  /**
   * Generates summarized totals for each gender and program column.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static async getReportSummary(worksheet: Worksheet){
    const summaryOffsets = [0, 4]
    await Promise.all(
      summaryOffsets.flatMap(async (summaryOffset)=>{
        await this.genderProgramMapping(async (sexIndex: number, programColumnOffset: number) => this.writeTwoSums(worksheet, programColumnOffset, sexIndex, summaryOffset))
      }
    ))
  }

  /**
   * Executes the necessary mappings to get the difference for all disabilities and Down Syndrome.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static async getReportDifference(worksheet: Worksheet){
    await this.genderProgramMapping(async (sexIndex: number, programColumnOffset: number) => this.writeDifference(worksheet, programColumnOffset, sexIndex));
  }

  /**
   * Executes a writer function for each gender and program column combination.
   *
   * @param {(sexIndex: number, programColumnOffset: number) => void} writer - Function to run per combination.
   */
  static async genderProgramMapping(writer: (sexIndex: number, programColumnOffset: number)=>void){
    const programOffsetMapping = async (sexIndex: number) => {
      const programColumnOffsets = [0, 1, 2, 4]
      await Promise.all( programColumnOffsets.flatMap(async (programColumnOffset)=>{
          await writer(sexIndex, programColumnOffset)
      }))
    }
    
    await Promise.all(genders.map(async (sex, sexIndex) => {
      await programOffsetMapping(sexIndex)
    }))
  }

  /**
   * Writes the total sums for each age group per program column.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   * @param {number} programColumnOffset - Column offset in template.
   * @param {number} sexIndex - Index of gender.
   * @param {number} summaryOffset - Offset for syndrome group.
   */
  static async writeTwoSums(worksheet: Worksheet, programColumnOffset: number, sexIndex: number, summaryOffset: number) {
    const colNumber = cellAddressInProgramReportTemplate(programColumnOffset, sexIndex)
    const colLetter = reportConversion.columnNumberToLetter(colNumber)
    const hasDownSyndrome = summaryOffset > 0 ? 1: 0
    const formula = `SUM(${colLetter}${21 + hasDownSyndrome},${colLetter}${23 + hasDownSyndrome},${colLetter}${25 + hasDownSyndrome},${colLetter}${27 + hasDownSyndrome},${colLetter}${29 + hasDownSyndrome})`
    this.assignCellFormula(worksheet, 31 + summaryOffset, colNumber, formula)
  }

  /**
   * Writes the difference of All disabilities and Down Syndrome.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   * @param {number} programColumnOffset - Offset of column group.
   * @param {number} sexIndex - Index of gender.
   */
  static async writeDifference(worksheet: Worksheet, programColumnOffset: number, sexIndex: number) {
    const colNumber = cellAddressInProgramReportTemplate(programColumnOffset, sexIndex)
    const colLetter = reportConversion.columnNumberToLetter(colNumber)
    const formula = `${colLetter}31 - ${colLetter}35`
    this.assignCellFormula(worksheet, 33, colNumber, formula);
  }
  
  /**
   * Assigns a formula to a specific worksheet cell.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   * @param {number} rowAddress - Row number in worksheet.
   * @param {number} colAddress - Column number in worksheet.
   * @param {string} formula - Excel formula to apply.
   */
  static async assignCellFormula(worksheet: Worksheet, rowAddress: number, colAddress: number, formula: string) {
    const row = worksheet.getRow(rowAddress)
    const cell = row.getCell(colAddress)
    cell.value = { formula: formula }
    await row.commit()
  } 
}
