import { InterventionModel } from "$lib/models/interventionModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.child_id || !body.intervention || !body.service_category_id || !body.status || !body.type) {
    throw error(400, 'Missing required fields: child_id, intervention, service_category_id, status, type')
  }

  if (!['Improved', 'Neutral', 'Regressed'].includes(body.status)) {
    throw error(400, 'Invalid status. Must be: Improved, Neutral, or Regressed')
  }

  if (!['education', 'social'].includes(body.type)) {
    throw error(400, 'Invalid type. Must be: education or social')
  }

  const inserted = await InterventionModel.instance.insertIntervention(
    body.child_id,
    body.intervention,
    body.remarks !== undefined ? body.remarks : null,
    body.service_category_id,
    body.status,
    body.type
  );

  if (!inserted) {
    throw error(500, 'Failed to create intervention');
  }

  return json({ message: 'Intervention created successfully', data: inserted });
}