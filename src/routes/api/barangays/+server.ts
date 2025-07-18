
/**
 * GET /api/barangays
 * 
 * Available endpoints:
 * - GET /api/barangays - Get all barangays
 * - GET /api/barangays?id=123 - Get specific barangay by ID
 * - GET /api/barangays?id=123&members=true - Get barangay with its members
 * - GET /api/barangays?city_id=456 - Get barangays by city
 * - GET /api/barangays?name=BrgyName - Get barangays by name
 * 
 * POST - Create new barangay
 * • Required: name
 * • Optional: city_id, num (barangay number)
 * 
 * PUT - Update barangay
 * • Required: id
 * • Optional: name, city_id, num
 */

import { BarangayModel } from "$lib/models/barangaysModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const city_id = url.searchParams.get('city_id');
  const name = url.searchParams.get('name');
  const members = url.searchParams.get('members') === 'true';
    
  try {
    let data;
    
    if (id) {
      const barangayId = parseInt(id);
      
      if (members) {
        data = await BarangayModel.instance.getMembersInBarangay(barangayId);
      } else {
        data = await BarangayModel.instance.findById(barangayId);
        if (!data) {
          throw error(404, 'Barangay not found');
        }
      }
    } else if (city_id) {
      data = await BarangayModel.instance.findByCityId(parseInt(city_id));
    } else if (name) {
      data = await BarangayModel.instance.findByName(name);
    } else {
      data = await BarangayModel.instance.getAll();
    }

    return json({ data });
  } catch (err) {
    throw error(500, 'Failed to retrieve barangays');
  }
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