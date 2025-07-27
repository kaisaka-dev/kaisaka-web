import { ReportGeneratorChildList } from "$lib/server/reports/services/reportChildList.js";
import { error } from "@sveltejs/kit";

export async function GET() {
  try {
    // Generate the health report by merging templates
    const buffer = await ReportGeneratorChildList.generateReport();
    
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="childList.xlsx"`,
      },
    });
    
  } catch (err) {
    console.error('Health report generation error:', err);
    throw error(500, 'Failed to generate health report');
  }
}