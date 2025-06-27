import { caregiversModel } from "$lib/models/caregiversModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.member_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await caregiversModel.instance.insertCaregiver(body.member_id, body.contact_number, body.facebook_link, body.email, body.occupation, body.remarks)

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

  if (body.contact_number !== undefined) {
    const updated = await caregiversModel.instance.updateContactNumber(body.id, body.contact_number)
    if (!updated) {
      throw error(500, 'Failed to update contact_number')
    }
    hasUpdates = true
  }

  if (body.facebook_link !== undefined) {
    const updated = await caregiversModel.instance.updateFacebookLink(body.id, body.facebook_link)
    if (!updated) {
      throw error(500, 'Failed to update facebook_link')
    }
    hasUpdates = true
  }

  if (body.email !== undefined) {
    const updated = await caregiversModel.instance.updateEmail(body.id, body.email)
    if (!updated) {
      throw error(500, 'Failed to update email')
    }
    hasUpdates = true
  }

  if (body.occupation !== undefined) {
    const updated = await caregiversModel.instance.updateOccupation(body.id, body.occupation)
    if (!updated) {
      throw error(500, 'Failed to update occupation')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await caregiversModel.instance.updateRemarks(body.id, body.remarks)
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