
import { ExcelMerger } from '$lib/server/reports/merger/report-merger.js';
import { ReportGeneratorAccessToSocialProtection } from '$lib/server/reports/services/reportAccessToSocialProtection.js';
import { ReportGeneratorInTheProgram } from '$lib/server/reports/services/reportIntheProgram.js';
import { ReportGeneratorLivelihoodInformation } from '$lib/server/reports/services/reportLivelihoodInformatonInfo.js';
import { ReportGeneratorConsolidation } from '$lib/server/reports/services/reportConsolidationReport.js'
import type {  RequestHandler } from '@sveltejs/kit';
import { error } from 'console';
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Session, User } from '@supabase/supabase-js';
import { getEarliestDate, getLatestDate } from '$lib/types/dates.js';
import fs from 'fs'
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

export interface required_report_body {
  startYYYY: number ,
  endYYYY: number ,
  new_target_CWDS: number ,
  old_target_CWDS: number,
}

export interface report_body {
	startYYYY: number | null;
	startMM?: number | null;
	startDD?: number | null;
	endYYYY: number | null;
	endMM?: number | null;
	endDD?: number | null;
	total_target_CWDS?: number | null;
	new_target_CWDS?: number | null;
	old_target_CWDS?: number | null;
	total_actual_CWDS?: number | null;
	new_actual_CWDS?: number | null;
	old_actual_CWDS?: number | null;
	general_reflection?: string;
	lessons_learned?: string;
}

interface Session_User {
  session: Session | null,
  user: User
}

export const POST: RequestHandler = async ({request, url, locals, fetch}) => {
  
  let body: report_body  

  const { session }: Session_User = await locals.safeGetSession();
  const { data } = await locals.supabase.auth.getUser()

  if (!session || !data ) {
    return new Response('Unauthorized', { status: 401 });
  }
  const user = data.user
  

  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid body error')
  }

  if (!body.startYYYY || !body.endYYYY || !body.new_target_CWDS || !body.old_target_CWDS )
    throw error(400, 'Missing report body')
  



  // const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);
  // const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);

// Updated to use static/templates path
const templateDir = path.resolve(process.cwd(), 'static/templates/');

const workbookArray: ExcelJS.Workbook[] = []
const params = parseTemplateParms(url)
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

if (params.isTemplate) {
    for (const fileLocation of fileName) {
        const workbook = new ExcelJS.Workbook();  
        const templatePath = path.join(templateDir, fileLocation);
        
        // Add error checking
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found: ${fileLocation} at ${templatePath}`);
        }
        
        const readWorkbook = await workbook.xlsx.readFile(templatePath);
        workbookArray.push(readWorkbook);
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
  const start_year = getEarliestDate(body.startYYYY)
  const end_year = getLatestDate(body.endYYYY)
  
// parallel tasks
  const tasks: Promise<IndexedWorkbook>[] = [
    // InTheProgram (Report generator)
    ReportGeneratorInTheProgram.generateWorkbookReport(start_year, end_year, body).then(workbook => ({ index: 0, workbook })),

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
      const res = await fetch('/api/reports/education_info', { method: 'POST' });
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
    ReportGeneratorConsolidation.generateWorkbookReport(start_year, end_year, body, user?.user_metadata?.username).then(workbook => ({index: 9, workbook})),
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