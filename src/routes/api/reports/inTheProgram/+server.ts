import { ReportGeneratorInTheProgram } from '$lib/server/reports/services/reportIntheProgram.js';
import { error } from '@sveltejs/kit';
import { type report_body } from '../target_cwds/+server.js';
import { getEarliestDate, getLatestDate } from '$lib/types/dates.js';


export const POST: RequestHandler = async ({request, url, locals, fetch}) => {

  try {
    let body: report_body  

    try {
      body = await request.json();
    } catch {
      throw error(400, 'Invalid body error')
    }

    if (!body.startYYYY || !body.endYYYY || !body.new_target_CWDS || !body.old_target_CWDS )
      throw error(400, 'Missing report body')
    
    const start_year = getEarliestDate(body.startYYYY)
    const end_year = getLatestDate(body.endYYYY)

    const buffer = await ReportGeneratorInTheProgram.generateReport(start_year, end_year, body);
    
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="health_report.xlsx"`,
      },
    });
    
  } catch (err) {
    console.error('Health report generation error:', err);
    throw error(500, 'Failed to generate health report');
  }
}