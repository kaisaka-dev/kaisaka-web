import { MajorTargetActivityModel } from "$lib/models/majorTargetActivityModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request, locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.name || !body.type || !body.service_objective_id || !body.target_no_of_participants) {
    throw error(400, 'Missing required fields: name, type, service_objective_id, target_no_of_participants')
  }

  const inserted = await MajorTargetActivityModel.instance.insertMajorTargetActivity(
    body.name,
    body.type,
    body.service_objective_id,
    body.target_no_of_participants,
    body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
}

export const PUT: RequestHandler = async({request, locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
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

  if (body.name !== undefined) {
    const updated = await MajorTargetActivityModel.instance.updateName(body.id, body.name)
    if (!updated) {
      throw error(500, 'Failed to update name')
    }
    hasUpdates = true
  }

  if (body.target_no_of_participants !== undefined) {
    const updated = await MajorTargetActivityModel.instance.updateTargetParticipants(body.id, body.target_no_of_participants)
    if (!updated) {
      throw error(500, 'Failed to update target_no_of_participants')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await MajorTargetActivityModel.instance.updateRemarks(body.id, body.remarks)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}