import { annualProgramModel } from "$lib/models/annualProgramModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.start_year || !body.end_year || !body.target_new_cwds) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await annualProgramModel.instance.insertServiceCategory(body.start_year, body.start_month, body.start_date, body.end_year, body.end_month, body.end_date, body.target_new_cwds, body.general_reflection, body.lessons_learned);

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted}) 
  
}