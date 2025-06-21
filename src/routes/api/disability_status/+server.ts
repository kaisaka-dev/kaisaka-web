import { DisabilityStatusModel } from "$lib/models/disabilityStatusModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.child_id || !body.disability_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await DisabilityStatusModel.instance.insertDisabilityStatus(body.child_id, body.disability_id, body.disability_nature)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
}