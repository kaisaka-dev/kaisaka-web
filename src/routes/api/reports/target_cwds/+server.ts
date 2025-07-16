
import { ExcelMerger } from '$lib/server/reports/merger/report-merger.js';
import type { RequestEvent } from '@sveltejs/kit';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(event: RequestEvent) {
  // const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);
  const templateDir = path.resolve(__dirname, '../../../../lib/server/reports/templates/');
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
    if (fileLocation === 'TEMPLATE_B2-EduInfo.xlsx') {
      const educInfoRes = await event.fetch('/api/reports/education_info', {
        method: 'POST'
      });

      if (!educInfoRes.ok) throw new Error('Failed to fetch education_info workbook');

      const arrayBuffer = await educInfoRes.arrayBuffer();

      const educWorkbook = new ExcelJS.Workbook();
      await educWorkbook.xlsx.load(arrayBuffer);

      workbookArray.push(educWorkbook);
    } else {
      const workbook = new ExcelJS.Workbook();  
      const readWorkbook = await workbook.xlsx.readFile(path.join(templateDir, fileLocation));
      workbookArray.push(readWorkbook)
    }
  }

  const buffer = await ExcelMerger.mergeWorkbooks(workbookArray);
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sales_report.xlsx"`,
    },
  });
}