
import { BarangayModel } from "$lib/models/barangaysModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const barangays = await BarangayModel.instance.findMany();
    
    if (!barangays) {
      throw error(500, 'Failed to fetch barangays');
    }
    
    return json(barangays);
  } catch {
    throw error(500, 'Failed to fetch barangays');
  }
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.name || !body.city) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await BarangayModel.instance.insertBarangay(body.name, body.city, body.num)

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

  const updates: any = {}
  let hasUpdates = false

  if (body.name !== undefined) {
    const updated = await BarangayModel.instance.updateName(body.id, body.name)
    if (!updated) {
      throw error(500, 'Failed to update name')
    }
    hasUpdates = true
  }

  if (body.city_id !== undefined) {
    const updated = await BarangayModel.instance.updateCityId(body.id, body.city_id)
    if (!updated) {
      throw error(500, 'Failed to update city_id')
    }
    hasUpdates = true
  }

  if (body.num !== undefined) {
    const updated = await BarangayModel.instance.updateNum(body.id, body.num)
    if (!updated) {
      throw error(500, 'Failed to update num')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}