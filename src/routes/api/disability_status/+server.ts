import { DisabilityStatusModel } from "$lib/models/disabilityStatusModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.child_id || !body.disability_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await DisabilityStatusModel.instance.insertDisabilityStatus(body.child_id, body.disability_id, body.disability_nature)

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

  if (body.disability_nature !== undefined) {
    const updated = await DisabilityStatusModel.instance.updateDisabilityNature(body.id, body.disability_nature)
    if (!updated) {
      throw error(500, 'Failed to update disability_nature')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}