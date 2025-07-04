import { EmploymentStatusModel } from "$lib/models/employmentStatusModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!('able_to_work' in body) || !body.member_id ){
    throw error(400, 'Missing required fields.')
  }

  const inserted = await EmploymentStatusModel.instance.insertEmploymentStatus(body.able_to_work, body.employment_type, body.member_id)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Employment Status Inserted', data: inserted})
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

  if (body.able_to_work !== undefined || body.employment_type !== undefined) {
    const updated = await EmploymentStatusModel.instance.updateEmploymentStatus(
      body.id, 
      body.able_to_work, 
      body.employment_type
    )
    if (!updated) {
      throw error(500, 'Failed to update employment status')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}