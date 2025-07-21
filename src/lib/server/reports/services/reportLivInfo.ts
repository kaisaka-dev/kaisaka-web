
import { ChildrenModel } from '$lib/models/childrenModel.js';

import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import type { QueryConfigurationBuilder } from '$lib/types/manager.js';
import { type Worksheet } from 'exceljs';

import { ReportGenerator } from './reportTemplate.js';
import { getBirthdayRangeForAge } from './reportIntheProgram.js';
import { CaregiversModel } from '$lib/models/caregiversModel.js';

const groupMembership = [
  { label: 'Joining a new group this year'  },
  { label: 'Participating in existing group' }
]

const laborMarketAccess = [
  { label: 'Already had access in the previous year'},
  { label: 'Gained access this year'                },
  { label: 'Total' },
  { label: 'Not Able to Work'}
]

const wageTypes = [
  { label: 'Wage-employed'        , offset: 0},
  { label: 'Self-employed'        , offset: 4},
  { label: 'Sheltered workshop '  , offset: 6},
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

const sexes = ['Male', 'Female'];

/**
 * Represents the parameters for a single report cell.
 */
interface ParticipationOfCaregiversHeaders {
  laborMarketAccess: string,
  laborMarketAccessIndex: string,
  disability: typeof disabilities[number],
  disabilityIndex: number,
  sex: string,
  sexIndex: number
};

interface AccessToLaborMarket {
  groupMembership: string,
  groupMembershipIndex: number,
  disability: typeof disabilities[number],
  disabilityIndex: number,
}

/**
 * Represents the result of a single cell query.
 */
interface cellResults {
  count: number,
  error: string
};

const logger = getLogSidecar();

const ParticipationOfCaregiversSelectClause = `
  id,
  member:members (
    first_name,
    last_name,
    sex,
    birthday
  ),
  relationship_cc (
    child:children (
      id,
      member:members (
        first_name,
        last_name,
        sex,
        birthday
      ),
      disability_category (
        name
      )
    )
  )
  `

const AccessToLabourMarketSelectClause = `
  id,
  member:members (
    first_name,
    last_name,
    sex,
    birthday
  ),
  relationship_cc (
    child:children (
      id,
      member:members (
        first_name,
        last_name,
        sex,
        birthday
      ),
      disability_category (
        name
      )
    )
  )
  employment_status(*)
` 

export class LiveInfoReportGenerator extends ReportGenerator {

  /**
   * Entry point for generating the full Excel report.
   *
   * @param {number} startYear - Current reporting year.
   * @returns {Promise<Buffer>} - Buffer containing the Excel file.
   */
  static async generateReport(startYear: number, endYear: number) {
    logger.info('Started report for In the Program');
    const {data, error} = await this.generateWorkbook('TEMPLATE_D2-LivInfo.xlsx');

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
      await this.ParticipationOfCaregivers(startYear, endYear, worksheet),
      await this.AccessToLabourMarket(startYear, endYear, worksheet)
    ])
  }

  static async ParticipationOfCaregivers(startYear:number, endYear:number, worksheet: Worksheet){
    await Promise.all(
      groupMembership.flatMap(async (groupMembership, groupMembershipId) => {
        disabilities.flatMap(async (disability, disabilityId) => {
          const rowAddress = 5 + groupMembershipId * 2 + disabilityId;
          
          const incomeGeneratingActivities = async () => {
              const cellAddress = 5
              const result = {
                count: 2
              }
              
              await Promise.all([
                await this.assignCellValue(worksheet, rowAddress, cellAddress, result.count > 0 ? result.count : ``),
                await this.assignCellValue(worksheet, rowAddress, cellAddress + 1, result.count > 0 ? result.count : ``)
              ])
            }
          const communityGroups = async () => {
            const cellAddress = 10
            const result = {
              count: 2
            }
            
            await Promise.all([
              await this.assignCellValue(worksheet, rowAddress, cellAddress, result.count > 0 ? result.count : ``),
              await this.assignCellValue(worksheet, rowAddress, cellAddress + 1, result.count > 0 ? result.count : ``)
            ])
          }
          
          await Promise.all([
            await incomeGeneratingActivities(),
            await communityGroups()
          ])
        })
      })
    )
  }

  static async AccessToLabourMarket(startYear:number, endYear:number, worksheet: Worksheet){
    await Promise.all(
      laborMarketAccess.flatMap(async (laborMarket, laborMarketId) => {
        disabilities.flatMap(async (disability, disabilityId) => {
          wageTypes.flatMap(async (wageType)=>{
            sexes.flatMap(async (sex, sexIndex)=>{
              const rowAddress = 14 + laborMarketId * 2 + disabilityId;
              const cellAddress = 7 + ((wageType.offset == 0) ? wageType.offset + sexIndex * 2 : wageType.offset + sexIndex);
              const result = {
                count: 1
              }

              await this.assignCellValue(worksheet, rowAddress, cellAddress, result.count > 0 ? result.count : ``)
            })
          })
        })
      })

    )
  }

  /**
   * Writes the result count to a specific worksheet cell.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model to query.
   * @param {string} modelSelectClause - SQL join select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query filters.
   * @param {number} columnOffset - Report section offset.
   * @param {LivInfoParams} reportParams - Cell query parameters.
   * @param {Worksheet} worksheet - ExcelJS worksheet.
   */
  static writeResultToWorksheet = async (
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder,
    columnOffset: number,
    reportParams: LivInfoParams,
    rowAddress: number,
    cellAddress: number,
    worksheet: Worksheet
  ) => {
    const result = await this.queryCountDatabase(modelSelectClause, modelFilter, reportParams)
    await this.assignCellValue(worksheet, rowAddress, cellAddress, result.count > 0 ? result.count : ``)
  }


  /**
   * Queries the database and returns count results for a given parameter group.
   *
   * @param {ChildrenModel | InterventionModel} modelInstance - Model instance to query.
   * @param {string} modelSelectClause - SQL-like select clause.
   * @param {QueryConfigurationBuilder} modelFilter - Query conditions.
   * @param {LivInfoParams} headerParams - Reporting parameters.
   * @returns {Promise<cellResults>} - Count and metadata for the report cell.
   */
  static async queryCountDatabase (
    modelSelectClause: string, 
    modelFilter: QueryConfigurationBuilder, 
    headerParams: LivInfoParams
  ): Promise<cellResults> {
    const { age_min, disability, sex, ageIndex, disabilityIndex, sexIndex } = headerParams;

    const cell_result = {
      count: 0,
      error: ""
    } as cellResults;

    
    try {
      const result = await CaregiversModel.instance.findWithJoinAndCount(modelSelectClause, modelFilter);
      logger.info(`${JSON.stringify(result.data)} ${JSON.stringify(modelFilter)}`)
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
    await Promise.all(sexes.map(async (sex, sexIndex) => {
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
