import { AddressesModel } from "$lib/models/addressesModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * GET /api/addresses
 * 
 * Available endpoints:
 * - GET /api/addresses - Get all addresses
 * - GET /api/addresses?id=uuid - Get specific address by ID
 * - GET /api/addresses?address=street - Get addresses by address string
 */
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const address = url.searchParams.get('address');
  
  try {
    let data;
    
    if (id) {
      data = await AddressesModel.instance.findById(id);
      if (!data) {
        throw error(404, 'Address not found');
      }
    } else if (address) {
      data = await AddressesModel.instance.findByAddress(address);
    } else {
      data = await AddressesModel.instance.getAll();
    }
    
    return json({ data });
  } catch (err) {
    throw error(500, 'Failed to retrieve addresses');
  }
};

export const POST: RequestHandler = async({request}) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.address) {
    throw error(400, 'Missing required field: address')
  }

  const inserted = await AddressesModel.instance.insertAddress(body.address)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Address Inserted', data: inserted})
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

  if (body.address !== undefined) {
    const updated = await AddressesModel.instance.updateAddress(body.id, body.address)
    if (!updated) {
      throw error(500, 'Failed to update address')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}