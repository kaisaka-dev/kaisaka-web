import { ActivityModel } from "$lib/models/activityModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.name || !body.type || !body.target_activity_id || !body.date_and_time_conducted) {
    throw error(400, 'Missing required fields: name, type, target_activity_id, date_and_time_conducted.')
  }

  const inserted = await ActivityModel.instance.insertActivity(
    body.name, 
    body.type, 
    body.target_activity_id,
    body.date_and_time_conducted,
    body.completion_staus,
    body.indicators,
    body.outcome,
    body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
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

  if (body.name !== undefined) {
    const updated = await ActivityModel.instance.updateName(body.id, body.name)
    if (!updated) {
      throw error(500, 'Failed to update name')
    }
    hasUpdates = true
  }

  if (body.completion_staus !== undefined) {
    const updated = await ActivityModel.instance.updateCompletionStatus(body.id, body.completion_staus)
    if (!updated) {
      throw error(500, 'Failed to update completion_staus')
    }
    hasUpdates = true
  }

  if (body.outcome !== undefined) {
    const updated = await ActivityModel.instance.updateOutcome(body.id, body.outcome)
    if (!updated) {
      throw error(500, 'Failed to update outcome')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}