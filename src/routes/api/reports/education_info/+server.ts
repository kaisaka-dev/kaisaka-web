import { getLogSidecar } from "$lib/server/logging/log-sidecar.js";
import { ReportGeneratorEducationInfo } from "$lib/server/reports/services/reportEducationInfo.js";
import { error } from "@sveltejs/kit";

const logger = getLogSidecar();

export async function POST({ locals }){
  try {
    const { session, user } = await locals.safeGetSession();
      if (!session) {
        return new Response('Unauthorized', { status: 401 });
      }

    const buffer = await ReportGeneratorEducationInfo.generateReport()

    return new Response(buffer, { headers: {'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}})

  } catch (err) {
    logger.error(String(err))
    throw error(500, 'Failed to generate health report');
  }
}