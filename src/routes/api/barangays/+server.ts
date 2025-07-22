
/**
 * BARANGAYS API - How to Use
 * 
 * GET - Retrieve barangay by ID
 * • Required: id parameter
 * • GET /api/barangays?id=123
 * 
 * POST - Create new barangay
 * • Required: name
 * • Optional: city_id, num (barangay number)
 * • Example: { "name": "Barangay Sample", "city_id": 456, "num": "001" }
 * • Example (no city): { "name": "Barangay Sample" }
 * 
 * PUT - Update barangay
 * • Required: id
 * • Optional: name, city_id, num
 * • Example: { "id": 123, "name": "Updated Barangay Name", "city_id": 789 }
 */

import { BarangayModel } from "$lib/models/barangaysModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// READ - Get barangay by ID
export const GET: RequestHandler = async ({ url }) => {
  const id = Number(url.searchParams.get('id'));
    
  if (!id) {
    throw error(400, 'Missing required parameter: id');
  }

  const brgy = await BarangayModel.instance.findById(id);

  if (!brgy) {
    throw error(404, 'Barangay not found');
  }

  return json(brgy);
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.name) {
    throw error(400, 'Missing required field: name')
  }

  const inserted = await BarangayModel.instance.insertBarangay(body.name, body.city_id, body.num)

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