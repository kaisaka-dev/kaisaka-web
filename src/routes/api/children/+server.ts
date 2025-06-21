import { ChildrenModel } from "$lib/models/childrenModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!('has_barangay_cert' in body) || !('has_birth_cert' in body) || !('has_medical_cert' in body) || !('is_active' in body) || !('has_philhealth' in body) || !body.member_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await ChildrenModel.instance.insertChild(
    body.has_barangay_cert, body.has_birth_cert, body.has_medical_cert, body.is_active, body.member_id, body.philhealth_id,  body.pwd_id, body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})

}

