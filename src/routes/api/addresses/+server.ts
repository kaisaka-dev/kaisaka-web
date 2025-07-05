import { AddressesModel } from "$lib/models/addressesModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const addresses = await AddressesModel.instance.findMany();
    
    if (!addresses) {
      throw error(500, 'Failed to fetch addresses');
    }
    
    return json(addresses);
  } catch {
    throw error(500, 'Failed to fetch addresses');
  }
};

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.address || !body.barangay_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await AddressesModel.instance.insertAddress(body.address, body.barangay_id)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Address Inserted', data: inserted})
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

  if (body.address !== undefined) {
    const updated = await AddressesModel.instance.updateAddress(body.id, body.address)
    if (!updated) {
      throw error(500, 'Failed to update address')
    }
    hasUpdates = true
  }

  if (body.barangay_id !== undefined) {
    const updated = await AddressesModel.instance.updateBarangayId(body.id, body.barangay_id)
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