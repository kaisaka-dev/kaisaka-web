
import { ExcelMerger } from '$lib/server/reports/merger/report-merger.js';
import { ReportGeneratorAccessToSocialProtection } from '$lib/server/reports/services/reportAccessToSocialProtection.js';
import { ReportGeneratorInTheProgram } from '$lib/server/reports/services/reportIntheProgram.js';
import { ReportGeneratorLivelihoodInformation } from '$lib/server/reports/services/reportLivelihoodInformatonInfo.js';
import type { RequestEvent } from '@sveltejs/kit';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TemplateParams {
  isTemplate?: boolean;

}

const parseTemplateParms = (url: URL): TemplateParams => {
  const templateParam = url.searchParams.get('template');

	const query: TemplateParams = {};
  query.isTemplate = false;

	if (templateParam !== null) {
		query.isTemplate = templateParam == 'true'
	}

	return query
}



export async function POST(event: RequestEvent) {
  // const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);
  const templateDir = path.resolve(__dirname, '../../../../lib/server/reports/templates/');
  
  
  const workbookArray: ExcelJS.Workbook[] = []
  const params = parseTemplateParms(event.url)
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
  if (params.isTemplate){
    

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

  type IndexedWorkbook = { index: number; workbook: ExcelJS.Workbook };
  const start_year = 2025
  const end_year = 2025
// parallel tasks
  const tasks: Promise<IndexedWorkbook>[] = [
    // InTheProgram (Report generator)
    ReportGeneratorInTheProgram.generateWorkbookReport(start_year, end_year).then(workbook => ({ index: 0, workbook })),

    // HealthObjectivesInfo
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[1]));
      return { index: 1, workbook: wb };
    })(),

    // EducationObjectives
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[2]));
      return { index: 2, workbook: wb };
    })(),

    // EducationInfo (fetched)
    (async () => {
      const res = await event.fetch('/api/reports/education_info', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to fetch education_info workbook');
      const arrayBuffer = await res.arrayBuffer();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(arrayBuffer);
      return { index: 3, workbook: wb };
    })(),

    // SocialObjectives
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[4]));
      return { index: 4, workbook: wb };
    })(),
    
    // Access to social protection (Report generator)
    ReportGeneratorAccessToSocialProtection.generateWorkbookReport(start_year, end_year).then(workbook => ({ index: 5, workbook })),

    // Livelihood Objectives
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[6]));
      return { index: 6, workbook: wb };
    })(),

    // Livelihood info (Report generator)
    ReportGeneratorLivelihoodInformation.generateWorkbookReport(start_year, end_year).then(workbook => ({ index: 7, workbook })),

    // Other
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[8]));
      return { index: 8, workbook: wb };
    })(),

    // Consolidation
    (async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(path.join(templateDir, fileName[9]));
      return { index: 9, workbook: wb };
    })(),
  ];

  // Run in parallel
  const results = await Promise.all(tasks);

  // Sort by index
  results.sort((a, b) => a.index - b.index);

  // Extract workbook array
  const workbookArray2 = results.map(r => r.workbook);

  // Merge
  const buffer = await ExcelMerger.mergeWorkbooks(workbookArray2);

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sales_report.xlsx"`,
  }});
}