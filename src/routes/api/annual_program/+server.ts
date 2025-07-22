import { annualProgramModel } from "$lib/models/annualProgramModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const result = await annualProgramModel.instance.getAll();
  
  if (!result) {
    throw error(500, 'Failed to fetch annual programs');
  }
  
  return json({ data: result });
};

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

  const inserted = await annualProgramModel.instance.insertAnnualProgram(body);

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted}) 
  
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

  // Check for date-related updates
  const dateUpdates: any = {}
  if (body.start_year !== undefined) {
    dateUpdates.start_year = body.start_year
    hasUpdates = true
  }
  if (body.start_month !== undefined) {
    dateUpdates.start_month = body.start_month
    hasUpdates = true
  }
  if (body.start_date !== undefined) {
    dateUpdates.start_date = body.start_date
    hasUpdates = true
  }
  if (body.end_year !== undefined) {
    dateUpdates.end_year = body.end_year
    hasUpdates = true
  }
  if (body.end_month !== undefined) {
    dateUpdates.end_month = body.end_month
    hasUpdates = true
  }
  if (body.end_date !== undefined) {
    dateUpdates.end_date = body.end_date
    hasUpdates = true
  }

  if (Object.keys(dateUpdates).length > 0) {
    const updated = await annualProgramModel.instance.updateProgramDates(body.id, dateUpdates)
    if (!updated) {
      throw error(500, 'Failed to update program dates')
    }
  }

  // Check for content-related updates
  const contentUpdates: any = {}
  if (body.target_new_cwds !== undefined) {
    contentUpdates.target_new_cwds = body.target_new_cwds
    hasUpdates = true
  }
  if (body.target_old_cwds !== undefined) {
    contentUpdates.target_old_cwds = body.target_old_cwds
    hasUpdates = true
  }
  if (body.actual_new_cwds !== undefined) {
    contentUpdates.actual_new_cwds = body.actual_new_cwds
    hasUpdates = true
  }
  if (body.actual_old_cwds !== undefined) {
    contentUpdates.actual_old_cwds = body.actual_old_cwds
    hasUpdates = true
  }
  if (body.general_reflection !== undefined) {
    contentUpdates.general_reflection = body.general_reflection
    hasUpdates = true
  }
  if (body.lessons_learned !== undefined) {
    contentUpdates.lessons_learned = body.lessons_learned
    hasUpdates = true
  }

  if (Object.keys(contentUpdates).length > 0) {
    const updated = await annualProgramModel.instance.updateProgramContent(body.id, contentUpdates)
    if (!updated) {
      throw error(500, 'Failed to update program content')
    }
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}