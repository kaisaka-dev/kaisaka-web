import { getLogSidecar } from "$lib/server/logging/log-sidecar.js";
import type { Worksheet } from "exceljs";
import type { report_body } from "../../../../routes/api/reports/target_cwds/+server.js";
import { ReportGenerator } from "./reportTemplate.js";

//const logger = getLogSidecar()

export class ReportGeneratorConsolidation extends ReportGenerator {

  static async generateWorkbookReport(startYear: Date, endYear: Date, body: report_body, username: string) {
      //logger.info('Started report for In the Program');
      const {data, error} = await this.generateWorkbook('TEMPLATE_F-Conc.xlsx');
      
      if (error)
        throw error
      await this.generateData(startYear, endYear, data.sheet, body, username);
  
      return await data.workbook;
    }
  
    /**
     * Populates the Excel worksheet with all layers of report data.
     *
     * @param {number} currentYear - Reporting year.
     * @param {Worksheet} worksheet - ExcelJS worksheet instance.
     */
    static async generateData(startYear: Date, endYear: Date, worksheet: Worksheet, body: report_body, username: string, mergeOffset: number = 0) {
      await this.writeDataLayer(worksheet, body, username, mergeOffset)
    }

    static async writeDataLayer(worksheet: Worksheet, body: report_body, username: string, mergeOffset: number = 0) {
      body.general_reflection ??= ""
      body.lessons_learned ??= ""

      worksheet.getRow(6).getCell(2).value = body.general_reflection
      worksheet.getRow(12).getCell(2).value = body.lessons_learned
      worksheet.getRow(18).getCell(4).value = username
      worksheet.getRow(19).getCell(4).value = (new Date()).toISOString()

      await Promise.all([
        worksheet.getRow(6).commit(),
        worksheet.getRow(12).commit(),
        worksheet.getRow(18).commit(),
        worksheet.getRow(19).commit()
        ]
      )
    }
}