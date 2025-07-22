import { getLogSidecar } from "$lib/server/logging/log-sidecar.js";
import { ReportGeneratorEducationInfo } from "$lib/server/reports/services/reportEducationInfo.js";
import { error } from "@sveltejs/kit";

const logger = getLogSidecar();

export async function POST(){
  try {
    const buffer = await ReportGeneratorEducationInfo.generateReport()

    return new Response(buffer, { headers: {'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}})

  } catch (err) {
    logger.error(String(err))
    throw error(500, 'Failed to generate health report');
  }
}