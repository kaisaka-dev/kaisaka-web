import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import { ExcelMerger } from '$lib/server/reports/merger/report-merger.js';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST() {
  // const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);
  const templateDir = path.resolve(__dirname, '../../../../lib/server/reports/template/');
  const fileName: string[] = [
    'TEMPLATE_A1-InTheProgram.xlsx',
    'TEMPLATE_A2-Health.xlsx',
    'TEMPLATE_B1-EduObject.xlsx',
    'TEMPLATE_B2-EduInfo.xlsx',  
    'TEMPLATE_C1-SocObject.xlsx',   
    'TEMPLATE_C2-SocInfo.xlsx',
    'TEMPLATE_D1-LivObject.xlsx',
    'TEMPLATE_D2-LivInfo.xlsx',
    'TEMPLATE_E-Other.xlsx',
    'TEMPLATE_F-Conc.xlsx',
  ];
  const workbookArray: ExcelJS.Workbook[] = []
  for (const fileLocation of fileName) {
    const workbook = new ExcelJS.Workbook();  
    const readWorkbook = await workbook.xlsx.readFile(path.join(templateDir, fileLocation));
    workbookArray.push(readWorkbook)
  }
  
  const buffer = await ExcelMerger.mergeWorkbooks(workbookArray);
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sales_report.xlsx"`,
    },
  });
}