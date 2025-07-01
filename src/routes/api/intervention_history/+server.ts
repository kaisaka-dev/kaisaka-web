import { InterventionHistoryModel } from "$lib/models/interventionHistoryModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.intervention_id || !body.improvement || !body.status) {
    throw error(400, 'Missing required field: intervention object')
  }

  const inserted = await InterventionHistoryModel.instance.recordInterventionHistory(body.intervention_id, body.improvment, body.status, body.remarks, body.date_checked);

  if (!inserted) {
    throw error(500, 'Failed to record intervention history');
  }

  return json({ message: 'Intervention history recorded successfully', data: inserted });
}

export const PUT: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.id || !body.intervention) {
    throw error(400, 'Missing required fields: id, intervention object.')
  }

  let hasUpdates = false

  // The intervention history model has an updateRecord method that takes an intervention object
  const updated = await InterventionHistoryModel.instance.updateHistoryRecord(body.id, body.intervention)
  if (!updated) {
    throw error(500, 'Failed to update intervention history record')
  }
  hasUpdates = true

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}
