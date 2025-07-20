import { InterventionModel } from "$lib/models/interventionModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { parseJoinParams } from "$lib/types/joining.js";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  const joinParams = parseJoinParams(url);
  
  if (!id || !joinParams.select || !type) {
    throw error(400, 'Missing id, type, or select query param');
  }

  let intervention;

  try {
    switch (type) {
      case 'serviceCategory':
        intervention = await InterventionModel.instance.getMultipleJoin(joinParams.select, { eq: {child_id: id} });
        break;
      default:
        throw error(400, 'Invalid type parameter');
    }

    if (!intervention) {
      throw error(404, 'Intervention not found');
    }

    return json(intervention);
  } catch (err) {
    console.error('Error fetching intervention:', err);
    throw error(500, 'Internal Server Error');
  }
};


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
  );

  if (!inserted) {
    throw error(500, 'Failed to create intervention');
  }

  return json({ message: 'Intervention created successfully', data: inserted });
}

export const PUT: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.id) {
    throw error(400, 'Missing required field: id.')
  }

  let hasUpdates = false

  if (body.remarks !== undefined) {
    const updated = await InterventionModel.instance.updateRemarks(body.id, body.remarks)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if (body.status !== undefined) {
    if (!['Improved', 'Neutral', 'Regressed'].includes(body.status)) {
      throw error(400, 'Invalid status. Must be: Improved, Neutral, or Regressed')
    }
    const updated = await InterventionModel.instance.updateStatus(body.id, body.status)
    if (!updated) {
      throw error(500, 'Failed to update status')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}