import { CaregiversModel } from "$lib/models/caregiversModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const caregivers = await CaregiversModel.instance.findMany();
    
    if (!caregivers) {
      throw error(500, 'Failed to fetch caregivers');
    }
    
    return json(caregivers);
  } catch {
    throw error(500, 'Failed to fetch caregivers');
  }
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.member_id || !body.contact_number) {
    throw error(400, 'Missing required fields: member_id, income_id and contact_number.')
  }

  const inserted = await CaregiversModel.instance.insertCaregiver(
    body.member_id, 
    body.income_id !== -1 ? body.income_id: null, 
    body.contact_number, 
    body.facebook_link !== undefined ? body.facebook_link: null, 
    body.email !== undefined ? body.email: null, 
    body.occupation !== undefined ? body.occupation: null,
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted caregiver data', data: inserted})
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
    const updated = await CaregiversModel.instance.updateContactNumber(body.id, body.contact_number)
    if (!updated) {
      throw error(500, 'Failed to update contact_number')
    }
    hasUpdates = true
  }

  if (body.facebook_link !== undefined) {
    const updated = await CaregiversModel.instance.updateFacebookLink(body.id, body.facebook_link)
    if (!updated) {
      throw error(500, 'Failed to update facebook_link')
    }
    hasUpdates = true
  }

  if (body.email !== undefined) {
    const updated = await CaregiversModel.instance.updateEmail(body.id, body.email)
    if (!updated) {
      throw error(500, 'Failed to update email')
    }
    hasUpdates = true
  }

  if (body.occupation !== undefined) {
    const updated = await CaregiversModel.instance.updateOccupation(body.id, body.occupation)
    if (!updated) {
      throw error(500, 'Failed to update occupation')
    }
    hasUpdates = true
  }

  if (body.income_id !== undefined) {
    const updated = await CaregiversModel.instance.updateIncomeId(body.id, body.income_id)
    if (!updated) {
      throw error(500, 'Failed to update income_id')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}