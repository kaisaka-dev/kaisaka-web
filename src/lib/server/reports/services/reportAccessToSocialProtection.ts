
import { ChildrenModel } from '$lib/models/childrenModel.js';

import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import type { QueryConfigurationBuilder, tableRow } from '$lib/types/manager.js';
import { type Worksheet } from 'exceljs';

import { annualProgramModel } from '$lib/models/annualProgramModel.js';
import { getBirthdayRangeForAge } from './reportIntheProgram.js';
import { ReportGenerator } from './reportTemplate.js';

const MembershipCardParticipation = [
  { age_min: 0  , card: 'has_pwd',          type: 'acquistion'},
  { age_min: 0  , card: 'has_pwd',          type: 'renewal'},
  { age_min: 0  , card: 'has_philhealth',   type: ''},
  { age_min: 15 , card: 'has_vote',         type: ''},
  { age_min: 0  , card: 'has_national_id',  type: ''},
  // { min: 0  , card: 'has_other',        type: ''}
]

const DisabilityParticipationDataLayer = [
  { age_min: 0 },
  { age_min: 6 }
]

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
interface AccessToSocialProtectionHeaderParams {
  age_min: number,
  card: string,
  type: string,
  cardIndex: number,
  ageIndex: number,
  disability: typeof disabilities[number],
  disabilityIndex: number,
  sex: string,
  sexIndex: number
};

/**
 * Represents the result of a single cell query.
 */
interface cellResults {
  age: number,
  card: string,
  type: string,
  sex: string,
  disability: string,
  indices: number[],
  count: number,
  error: string
};

//const logger = getLogSidecar();

const MembershipCardParticipationSelectClause   = `*, disability_category!inner(name), members!inner(sex, birthday)`

const DisabilityParticipationSelectClause       = `*, disability_category!inner(name), members!inner(sex, birthday), social_protection_status!inner(*)` 

export class ReportGeneratorAccessToSocialProtection extends ReportGenerator {

  /**
   * Entry point for generating the full Excel report.
   *
   * @param {number} startYear - Current reporting year.
   * @returns {Promise<Buffer>} - Buffer containing the Excel file.
   */
  static async generateReport(startYear: Date, endYear: Date) {
    //.info('Started report for In the Program');
    const {data, error} = await this.generateWorkbook('TEMPLATE_C2-SocInfo.xlsx');

    if (error)
      throw error
    await this.generateData(startYear, endYear, data.sheet);

    return await data.workbook.xlsx.writeBuffer();
  }

  /**
   * Entry point for generating the full Excel report.
   *
   * @param {number} startYear - Current reporting year.
   * @returns {Promise<Buffer>} - Buffer containing the Excel file.
   */
  static async generateWorkbookReport(startYear: Date, endYear: Date) {
    //logger.info('Started report for In the Program');
    const {data, error} = await this.generateWorkbook('TEMPLATE_C2-SocInfo.xlsx');

    if (error)
      throw error
    await this.generateData(startYear, endYear, data.sheet);

    return await data.workbook;
  }

  /**
   * Populates the Excel worksheet with all layers of report data.
   *
   * @param {number} currentYear - Reporting year.
   * @param {Worksheet} worksheet - ExcelJS worksheet instance.
   */
  static async generateData(startYear: Date, endYear: Date, worksheet: Worksheet) {
    const newCWDCurrentYearArray = await annualProgramModel.instance.findByStartAndEndYear(startYear.getFullYear(), endYear.getFullYear())
    
    if (!newCWDCurrentYearArray)
      throw Error(`No Annual Program detected from ${startYear} to ${endYear}`)

    const oldCWDPreviousYearArray = await annualProgramModel.instance.findPreviousWorkYear(newCWDCurrentYearArray[0].id)
    

    if (!oldCWDPreviousYearArray)
      throw Error(`No previous Annual Program detected from Annual Program ${startYear}-${endYear}`)

    const newCWDCurrentYear = newCWDCurrentYearArray[0]
    const oldCWDPreviousYear = oldCWDPreviousYearArray[0]

    await Promise.all([
      this.MembershipCardParticipationDataLayer(startYear, endYear, worksheet, newCWDCurrentYear, oldCWDPreviousYear),
      this.DisabilityParticipationDataLayer(startYear, endYear, worksheet)
    ])
  }

  static async MembershipCardParticipationDataLayer(startYear: Date, endYear:Date, worksheet: Worksheet,  newCWDCurrentYear: tableRow<'annual_program'>, oldCWDPreviousYear: tableRow<'annual_program'>){
    Promise.all(MembershipCardParticipation.map(async(card, cardIndex)=>{
      Promise.all(disabilities.map(async(disability, disabilityIndex)=>{
        const writer = async (sex: string, sexIndex: number) => {
          const reportParams = {
            ...card,
            cardIndex, 
            disability, disabilityIndex, sex: sex, sexIndex: sexIndex, ageIndex: 0
          } as AccessToSocialProtectionHeaderParams

          await this.ReportQueryWriter(reportParams, worksheet, newCWDCurrentYear, oldCWDPreviousYear)
        }

        await this.genderProgramMapping(writer)
      }))
    }))
  }

  static async DisabilityParticipationDataLayer(startYear:Date, endYear:Date, worksheet: Worksheet){
    Promise.all(DisabilityParticipationDataLayer.flatMap(async(age_min, ageIndex)=>{
      Promise.all(disabilities.flatMap(async(disability, disabilityIndex)=>{
        const writer = async (sex: string, sexIndex: number) => {
          const reportParams = {...age_min, ageIndex, disability, disabilityIndex, sex: sex, sexIndex: sexIndex, cardIndex: 0 } as AccessToSocialProtectionHeaderParams

          const writeResult = async (
            modelSelectClause: string, 
            modelFilter: QueryConfigurationBuilder, 
            columnOffset: number
          ) => {
            const result = await this.queryCountDatabase(modelSelectClause, modelFilter, reportParams)
            const row = 19 + reportParams.cardIndex * 2 + reportParams.disabilityIndex + reportParams.ageIndex * 2
            const col = 7 + columnOffset * 4 + reportParams.sexIndex * 2
            await this.assignCellValue(worksheet, row, col, result.count > 0 ? result.count : ``)
          }
          
          const birthdayRange = getBirthdayRangeForAge(reportParams.age_min, null);
    
          const participationFamilyConfig: QueryConfigurationBuilder = {
            eq: {
              'members.sex': reportParams.sex,
              'social_protection_status.participates_family_life': true,
            },
            ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
            ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
            ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
          };  

          const participationCommunityConfig: QueryConfigurationBuilder = {
            eq: {
              'members.sex': reportParams.sex,
              'social_protection_status.participates_community_club': true,
            },
            ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
            ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
            ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
          };  

          await Promise.all([
            writeResult(DisabilityParticipationSelectClause, participationFamilyConfig, 0),
            writeResult(DisabilityParticipationSelectClause, participationCommunityConfig, 1)
          ])
        }

        await this.genderProgramMapping(writer)
      }))
    }))
  }

  /**
   * Writes the result count to a specific worksheet cell.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model to query.
   * @param {string} modelSelectClause - SQL join select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query filters.
   * @param {number} columnOffset - Report section offset.
   * @param {AccessToSocialProtectionHeaderParams} reportParams - Cell query parameters.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static writeResultToWorksheet = async (
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder,
    columnOffset: number,
    reportParams: AccessToSocialProtectionHeaderParams,
    worksheet: Worksheet,
  ) => {
    const result = await this.queryCountDatabase(modelSelectClause, modelFilter, reportParams)
    const rowAddress = 5 + reportParams.cardIndex * 2 + reportParams.disabilityIndex + reportParams.ageIndex * 2
    const cellAddress = 7 + columnOffset * 4 + reportParams.sexIndex * 2

    await this.assignCellValue(worksheet, rowAddress, cellAddress, result.count > 0 ? result.count : ``)
  }

  /**
   * Executes all queries for a given age/disability/sex combination.
   *
   * @param {AccessToSocialProtectionHeaderParams} reportParams - Parameters for the report cell.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static async ReportQueryWriter (reportParams: AccessToSocialProtectionHeaderParams, worksheet: Worksheet, newCWDCurrentYear: tableRow<'annual_program'>, oldCWDPreviousYear: tableRow<'annual_program'>) {
    const writeResult = (
      modelSelectClause: string, 
      modelFilter: QueryConfigurationBuilder, 
      columnOffset: number
    ) => this.writeResultToWorksheet(modelSelectClause, modelFilter, columnOffset, reportParams, worksheet)

    //logger.info(`Cell (${reportParams.cardIndex}, ${reportParams.disabilityIndex}, ${reportParams.sexIndex}) - ${reportParams.age_min}, ${reportParams.card}, ${reportParams.disability} ${reportParams.sex}`)

    const birthdayRange = getBirthdayRangeForAge(reportParams.age_min, null);
    
    let uniqueCard = {
      
    } as QueryConfigurationBuilder

    switch (reportParams.card) {
      case 'has_pwd':
        uniqueCard = {
          isNot: {
            'is_pwd': null
          } // (reportParams.type) ? :
        }
        break;
      case 'has_philhealth':
        uniqueCard = {
          eq: {
            'has_philhealth': true
          } // (reportParams.type) ? :
        }
        break;
      case 'has_vote':
        uniqueCard = {
          eq: {
            'has_vote': true
          } // (reportParams.type) ? :
        }
        break;
      case 'has_national_id':
        uniqueCard = {
          eq: {
            'has_national_id': true
          } // (reportParams.type) ? :
        }
        break;
      case 'has_other':
        break
    }

    const newStartDate = this.getEarliestDate(newCWDCurrentYear.start_year, newCWDCurrentYear.end_month, newCWDCurrentYear.end_date).toISOString()
    const newEndDate = this.getLatestDate(newCWDCurrentYear.end_year, newCWDCurrentYear.end_month, newCWDCurrentYear.end_date).toISOString()
    const oldEndDate = this.getLatestDate(oldCWDPreviousYear.end_year, oldCWDPreviousYear.end_month, oldCWDPreviousYear.end_date).toISOString()


    const alreadyAccessedLastYearConfig: QueryConfigurationBuilder = {
      eq: {
        'members.sex': reportParams.sex,
        ...(uniqueCard && uniqueCard.eq)
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
      ...(uniqueCard && uniqueCard.isNot),
      ...{lte: {'members.admission_date': oldEndDate}}
    }

    const newlyAccessedThisYearConfig: QueryConfigurationBuilder = {
      eq: {
        'members.sex': reportParams.sex,
        ...(uniqueCard && uniqueCard.eq)
      },
      ...(reportParams.disability.ilike && {ilike: { 'disability_category.name': reportParams.disability.ilike}}),
      ...(birthdayRange.gte ?  { gte: { 'members.birthday': birthdayRange.gte } } : {}),
      ...(birthdayRange.lte && { lte: { 'members.birthday': birthdayRange.lte } }),
      ...(uniqueCard && uniqueCard.isNot),
      ...{lte: {'members.admission_date': newEndDate}},
      ...{gte: {'members.admission_date': newStartDate}}
    };  


    await Promise.all([
      writeResult(MembershipCardParticipationSelectClause, alreadyAccessedLastYearConfig,   0),
      writeResult(MembershipCardParticipationSelectClause, newlyAccessedThisYearConfig,     1),
    ])
  }

  /**
   * Queries the database and returns count results for a given parameter group.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model instance to query.
   * @param {string} modelSelectClause - SQL-like select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query conditions.
   * @param {AccessToSocialProtectionHeaderParams} headerParams - Reporting parameters.
   * @returns {Promise<cellResults>} - Count and metadata for the report cell.
   */
  static async queryCountDatabase (
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder, 
    headerParams: AccessToSocialProtectionHeaderParams
  ): Promise<cellResults> {
    const { age_min, disability, sex, ageIndex, disabilityIndex, sexIndex } = headerParams;

    const cell_result = {
      age: age_min,
      disability: disability.label,
      sex: sex,
      indices: [ageIndex, disabilityIndex, sexIndex],
      count: 0,
      error: ""
    } as cellResults;

    
    try {
      const result = await ChildrenModel.instance.findWithJoinWithCount(modelSelectClause, modelFilter);
      //logger.info(`${JSON.stringify(result.data)} ${JSON.stringify(modelFilter)}`)
      cell_result.count = (result.count) ?? 0;
    } catch (error) {
      cell_result.error = JSON.stringify(error)
    } 
    return cell_result
  }

  /**
   * Executes a writer function for each gender and program column combination.
   *
   * @param {(sexIndex: number, programColumnOffset: number) => void} writer - Function to run per combination.
   */
  static async genderProgramMapping(writer: (sex: string, sexIndex: number)=>void){
    await Promise.all(genders.map(async (sex, sexIndex) => {
      await writer(sex, sexIndex)
    }))
  }

  /**
   * Assigns a formula to a specific worksheet cell.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   * @param {number} rowAddress - Row number in worksheet.
   * @param {number} colAddress - Column number in worksheet.
   * @param {string} formula - Excel formula to apply.
   */
  static async assignCellValue(worksheet: Worksheet, rowAddress: number, colAddress: number, value: string | number) {
    const row = worksheet.getRow(rowAddress)
    const cell = row.getCell(colAddress)
    cell.value = value
    await row.commit()
  }
}
