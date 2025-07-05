import { socialProtectionStatusModel } from "$lib/models/socialProtectionStatusModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const items = await socialProtectionStatusModel.instance.findMany();
    
    if (!items) {
      throw error(500, 'Failed to fetch social protection statuses');
    }
    
    return json(items);
  } catch {
    throw error(500, 'Failed to fetch social protection statuses');
  }
};

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
    comm_year_accessed: body.comm_year_accessed !== undefined ? body.comm_year_accessed : null,
    fam_year_accessed: body.fam_year_accessed !== undefined ? body.fam_year_accessed : null,
    participates_community_club: body.participates_community_club,
    participates_family_life: body.participates_family_life
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

  if (body.comm_year_accessed !== undefined) {
    updates.comm_year_accessed = body.comm_year_accessed
    hasUpdates = true
  }

  if (body.fam_year_accessed !== undefined) {
    updates.fam_year_accessed = body.fam_year_accessed
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