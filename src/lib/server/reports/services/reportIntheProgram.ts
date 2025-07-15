import path from 'path'
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs'
import { annualProgramModel } from '$lib/models/annualProgramModel.js';
import { AttendanceLogModel } from '$lib/models/attendanceLogModel.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '../template/TEMPLATE_A1-InTheProgram.xlsx');

export class ReportInTheProgram{
  static async generate(currentYear: number) {
    const tplPath = path.resolve(process.cwd(), 'templates', 'accomplishment-report.xlsx')
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(tplPath)

    const sheet = workbook.getWorksheet('Report')  // adjust to your sheet name

    if (!sheet) 
      throw {data: undefined, error: Error('No sheet made')}

    // --- Example: fill total target vs actual CWDS from your annual_program table ---
    const program = await annualProgramModel.instance.findPreviousWorkYear(currentYear)

    if (!program)
      throw {data: undefined, error: Error('No programs existed with this start Year.')}


    // suppose your template has a cell F8 = target_new_cwds, G8 = actual_cwds
    sheet.getCell('F8').value = program.target_new_cwds;


    // --- Example: fill attendance logs into the grid under “IN THE PROGRAM” ---
    // fetch all logs and group by intervention plan / age / gender, etc.
    const logs = await AttendanceLogModel.instance.find
    

    // e.g. write the count of those with IIP but no TGP into H20
    sheet.getCell('H20').value = summary['IIP|NO'] ?? 0

    // … fill out the rest of your cells in a similar way …

    await workbook.xlsx.writeFile(outputPath)
    console.log(`✨ Report written to ${outputPath}`)    
  }
}