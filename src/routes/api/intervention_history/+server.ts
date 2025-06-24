import { InterventionHistoryModel } from "$lib/models/interventionHistoryModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.intervention) {
    throw error(400, 'Missing required field: intervention object')
  }

  const inserted = await InterventionHistoryModel.instance.recordIntervention(body.intervention);

  if (!inserted) {
    throw error(500, 'Failed to record intervention history');
  }

  return json({ message: 'Intervention history recorded successfully', data: inserted });
}
