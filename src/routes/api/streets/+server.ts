import { StreetsModel } from "$lib/models/streetsModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.street) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await StreetsModel.instance.insertStreet(body.barangay_id, body.street)

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

  if (body.street !== undefined) {
    const updated = await StreetsModel.instance.updateStreet(body.id, body.street)
    if (!updated) {
      throw error(500, 'Failed to update street')
    }
    hasUpdates = true
  }

  if (body.barangay_id !== undefined) {
    const updated = await StreetsModel.instance.updateBarangay(body.id, body.barangay_id)
    if (!updated) {
      throw error(500, 'Failed to update barangay_id')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

