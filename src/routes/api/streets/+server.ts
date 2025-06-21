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

