import { HealthReportService } from '$lib/server/reports/services/reportObjectives.js';
import { error } from '@sveltejs/kit';

export async function POST() {
  try {
    // Generate the health report by merging templates
    const buffer = await HealthReportService.generate();
    
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