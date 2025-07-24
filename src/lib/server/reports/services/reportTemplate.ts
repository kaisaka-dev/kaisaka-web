import ExcelJS from "exceljs"
import path from "path"
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export abstract class ReportGenerator {
  protected static async generateWorkbook(reportTemplateName: string) {
    const pathTemplate = path.resolve(__dirname, '../../../../lib/server/reports/templates/', reportTemplateName) 
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(pathTemplate)

    const sheet = workbook.getWorksheet(1)  // adjust to your sheet name

    return (!sheet) 
          ? {data: undefined, error: Error('No sheet made')} 
          : {data: {workbook: workbook, sheet: sheet }, error: undefined}
  }
}