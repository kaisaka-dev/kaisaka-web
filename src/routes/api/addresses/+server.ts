import { AddressesModel } from "$lib/models/addressesModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.address || !body.barangay_id || !body.street_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await AddressesModel.instance.insertAddress(body.address, body.barangay_id, body.street_id)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
}