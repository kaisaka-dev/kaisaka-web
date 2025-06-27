import { socialProtectionStatusModel } from "$lib/models/socialProtectionStatusModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.child_id) {
    throw error(400, 'Missing required field: child_id')
  }

  const statusData = {
    child_id: body.child_id,
    year_accessed: body.year_accessed !== undefined ? body.year_accessed : null
  };

  const inserted = await socialProtectionStatusModel.instance.insertStatus(statusData);

  if (!inserted) {
    throw error(500, 'Failed to create social protection status');
  }

  return json({ message: 'Social protection status created successfully', data: inserted });
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
  const updates: any = {}

  if (body.year_accessed !== undefined) {
    updates.year_accessed = body.year_accessed
    hasUpdates = true
  }

  if (body.child_id !== undefined) {
    updates.child_id = body.child_id
    hasUpdates = true
  }

  if (Object.keys(updates).length > 0) {
    const updated = await socialProtectionStatusModel.instance.updateStatus(body.id, updates)
    if (!updated) {
      throw error(500, 'Failed to update social protection status')
    }
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}