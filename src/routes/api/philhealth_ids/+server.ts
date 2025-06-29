import { philhealthIdsModel } from "$lib/models/philhealthIdsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.philhealth_id || !body.exp_date) {
    throw error(400, 'Missing required fields: philhealth_id, exp_date')
  }

  const inserted = await philhealthIdsModel.instance.insertPhilhealthId(
    body.philhealth_id,
    body.exp_date
  );

  if (!inserted) {
    throw error(500, 'Failed to create PhilHealth ID');
  }

  return json({ message: 'PhilHealth ID created successfully', data: inserted });
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

  if (body.philhealth_id !== undefined) {
    const updated = await philhealthIdsModel.instance.updatePhilhealthId(body.id, body.philhealth_id)
    if (!updated) {
      throw error(500, 'Failed to update philhealth_id')
    }
    hasUpdates = true
  }

  if (body.exp_date !== undefined) {
    const updated = await philhealthIdsModel.instance.updateExpDate(body.id, body.exp_date)
    if (!updated) {
      throw error(500, 'Failed to update exp_date')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}