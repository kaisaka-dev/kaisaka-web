import { DisabilitiesModel } from "$lib/models/disabilitiesModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.name) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await DisabilitiesModel.instance.insertDisability(body.name)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
}