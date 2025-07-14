import { ExcelGenerator } from '$lib/server/reports/types/report-generation.js';
import { AccomplishmentReport } from '$lib/server/reports/services/target_no_cwds.js';

export async function POST() {
  const buffer = await ExcelGenerator.generateExcelfromReportArray([AccomplishmentReport, AccomplishmentReport, AccomplishmentReport]);

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="sales_report.xlsx"`,
    },
  });
}