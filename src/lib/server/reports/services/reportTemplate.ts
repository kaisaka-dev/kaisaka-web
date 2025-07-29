import ExcelJS from "exceljs"
import path from "path"
import { fileURLToPath } from "url";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export abstract class ReportGenerator {
  protected static async generateWorkbook(reportTemplateName: string) {
    const pathTemplate = path.resolve(process.cwd(), 'static/templates/', reportTemplateName);
    
    // Check if file exists and provide helpful error message
    if (!fs.existsSync(pathTemplate)) {
      throw new Error(`Template file not found: ${reportTemplateName} at ${pathTemplate}`);
    }
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(pathTemplate)

    const sheet = workbook.getWorksheet(1)  // adjust to your sheet name

    return (!sheet) 
          ? { data: undefined,                           error: Error('No sheet made') } 
          : { data: {workbook: workbook, sheet: sheet }, error: undefined              }
  }

  protected static getEarliestDate(
    year: number,
    month?: number | null,
    day?: number | null
  ): Date {
    const m = month != null ? month - 1 : 0; // JS Date: month is 0-indexed
    const d = day != null ? day : 1;
    return new Date(year, m, d);
  }

  protected static getLatestDate(
      year: number,
      month?: number | null,
      day?: number | null
    ): Date {
      if (month != null) {
        if (day != null) {
          return new Date(year, month - 1, day);
        } else {
          // Get last day of the month using next month's 0th day
          return new Date(year, month, 0);
        }
      } else {
        // If no month, return December 31
        return new Date(year, 11, 31);
      }
    }
}