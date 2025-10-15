// server export handler (Vercel-safe)
import { ExcelMerger } from '$lib/server/reports/merger/report-merger.js';
import { ReportGeneratorAccessToSocialProtection } from '$lib/server/reports/services/reportAccessToSocialProtection.js';
import { ReportGeneratorInTheProgram } from '$lib/server/reports/services/reportIntheProgram.js';
import { ReportGeneratorLivelihoodInformation } from '$lib/server/reports/services/reportLivelihoodInformatonInfo.js';
import { ReportGeneratorConsolidation } from '$lib/server/reports/services/reportConsolidationReport.js';
import type { RequestHandler } from '@sveltejs/kit';
import ExcelJS from 'exceljs';
import type { Session, User } from '@supabase/supabase-js';
import { getEarliestDate, getLatestDate } from '$lib/types/dates.js';
import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';

const logger = getLogSidecar();

interface TemplateParams {
	isTemplate?: boolean;
}

const parseTemplateParms = (url: URL): TemplateParams => {
	const templateParam = url.searchParams.get('template');
	return { isTemplate: templateParam === 'true' };
};

// ✅ Naming fixed for linting rules
export interface ReportBody {
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

interface SessionUser {
	session: Session | null;
	user: User;
}

export const POST: RequestHandler = async ({ request, url, locals, fetch }) => {
	let body: ReportBody;

	// Auth
	const { session }: SessionUser = await locals.safeGetSession();
	const { data } = await locals.supabase.auth.getUser();
	logger.info('session valid: ' + !!session);
	if (!session || !data || !data.user) {
		return new Response('Unauthorized', { status: 401 });
	}
	const user = data.user;

	try {
		body = await request.json();
	} catch {
		logger.warn('Invalid body for report');
		return new Response('Invalid body report', { status: 400 });
	}

	if (!body?.startYYYY || !body?.endYYYY || !body?.new_target_CWDS || !body?.old_target_CWDS) {
		return new Response('Missing report body', { status: 400 });
	}

	// Template filenames (served from /templates/* inside `static/`)
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

	const params = parseTemplateParms(url);

	// Helper to load a template workbook from static templates folder
	async function loadTemplateWorkbook(fileLocation: string): Promise<ExcelJS.Workbook> {
		const templateUrl = new URL(`/templates/${fileLocation}`, url).toString();
		const resp = await fetch(templateUrl);
		if (!resp.ok) {
			throw new Error(`Template file not found at ${templateUrl} (HTTP ${resp.status})`);
		}
		const arrayBuffer = await resp.arrayBuffer();
		const wb = new ExcelJS.Workbook();
		await wb.xlsx.load(arrayBuffer);
		return wb;
	}

	// Return merged templates if ?template=true
	if (params.isTemplate) {
		const workbookArray: ExcelJS.Workbook[] = [];
		for (const fileLocation of fileName) {
			const wb = await loadTemplateWorkbook(fileLocation);
			workbookArray.push(wb);
		}
		const buffer = await ExcelMerger.mergeWorkbooks(workbookArray);
		return new Response(new Uint8Array(buffer), {
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="sales_report_templates.xlsx"`,
			},
		});
	}

	const start_year = getEarliestDate(body.startYYYY);
	const end_year = getLatestDate(body.endYYYY);

	type IndexedWorkbook = { index: number; workbook: ExcelJS.Workbook };

	const tasks: Promise<IndexedWorkbook>[] = [
		// 0 - InTheProgram
		ReportGeneratorInTheProgram.generateWorkbookReport(start_year, end_year, body).then(
			(workbook) => ({ index: 0, workbook }),
		),

		// 1 - HealthObjectives
		(async () => ({ index: 1, workbook: await loadTemplateWorkbook(fileName[1]) }))(),

		// 2 - EducationObjectives
		(async () => ({ index: 2, workbook: await loadTemplateWorkbook(fileName[2]) }))(),

		// 3 - EducationInfo
		(async (): Promise<IndexedWorkbook> => {
			try {
				// Optional: create $lib/server/reports/services/reportEducationInfo.js
				const mod = await import(
					'$lib/server/reports/services/reportEducationInfo.js'
				);
				if (typeof mod.ReportGeneratorEducationInfo?.generateReport === 'function') {
					const res = await mod.ReportGeneratorEducationInfo.generateReport()
          const arrayBuffer = res
          const wb = new ExcelJS.Workbook();
          await wb.xlsx.load(arrayBuffer);
          return { index: 3, workbook: wb }; // ✅ workbook is Workbook
				}
				throw new Error('No generator found');
			} catch {
				// fallback to HTTP fetch
				const absolute = new URL('/api/reports/education_info', url).toString();
				const res = await fetch(absolute, {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ startYYYY: body.startYYYY, endYYYY: body.endYYYY }),
				});
				if (!res.ok) throw new Error('Failed to fetch education_info workbook');
				const arrayBuffer = await res.arrayBuffer();
				const wb = new ExcelJS.Workbook();
				await wb.xlsx.load(arrayBuffer);
				return { index: 3, workbook: wb };
			}
		})(),

		// 4 - SocialObjectives
		(async () => ({ index: 4, workbook: await loadTemplateWorkbook(fileName[4]) }))(),

		// 5 - Access to social protection
		ReportGeneratorAccessToSocialProtection.generateWorkbookReport(start_year, end_year).then(
			(workbook) => ({ index: 5, workbook }),
		),

		// 6 - Livelihood Objectives
		(async () => ({ index: 6, workbook: await loadTemplateWorkbook(fileName[6]) }))(),

		// 7 - Livelihood info
		ReportGeneratorLivelihoodInformation.generateWorkbookReport(start_year, end_year).then(
			(workbook) => ({ index: 7, workbook }),
		),

		// 8 - Other
		(async () => ({ index: 8, workbook: await loadTemplateWorkbook(fileName[8]) }))(),

		// 9 - Consolidation
		ReportGeneratorConsolidation.generateWorkbookReport(
			start_year,
			end_year,
			body,
			user?.user_metadata?.username,
		).then((workbook) => ({ index: 9, workbook })),
	];

	// Run and merge
	const results = await Promise.all(tasks);
	results.sort((a, b) => a.index - b.index);
	const workbookArray2 = results.map((r) => r.workbook);

	const mergedBuffer = await ExcelMerger.mergeWorkbooks(workbookArray2);

	// Upload to Supabase Storage if large
	const SIZE_THRESHOLD = 5 * 1024 * 1024; // 5 MB
	if (mergedBuffer.byteLength > SIZE_THRESHOLD) {
		const filePath = `exports/report-${user.id ?? 'anon'}-${Date.now()}.xlsx`;

		const { error: uploadError } = await locals.supabase.storage
			.from('exports')
			.upload(filePath, mergedBuffer, {
				contentType:
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				upsert: false,
			});

		if (uploadError) {
			logger.error('Supabase upload failed', { uploadError });
			return new Response('Failed to upload report', { status: 500 });
		}

		const { data: signed, error: signedErr } = await locals.supabase.storage
			.from('exports')
			.createSignedUrl(filePath, 3600);

		if (signedErr || !signed?.signedUrl) {
			logger.error('Failed to create signed url', { signedErr });
			return new Response('Failed to create download URL', { status: 500 });
		}

		return new Response(JSON.stringify({ url: signed.signedUrl }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Otherwise stream the file directly
	return new Response(new Uint8Array(mergedBuffer), {
		headers: {
			'Content-Type':
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="sales_report.xlsx"`,
		},
	});
};
