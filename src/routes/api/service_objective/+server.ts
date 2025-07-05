import { ServiceObjectiveModel } from "$lib/models/serviceObjectiveModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const items = await ServiceObjectiveModel.instance.findMany();
    
    if (!items) {
      throw error(500, 'Failed to fetch service objectives');
    }
    
    return json(items);
  } catch {
    throw error(500, 'Failed to fetch service objectives');
  }
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.annual_program_id || !body.service_category_id || !body.objective_description) {
    throw error(400, 'Missing required fields: annual_program_id, service_category_id, objective_description.')
  }

  const inserted = await ServiceObjectiveModel.instance.insertServiceObjective(
    body.annual_program_id,
    body.service_category_id,
    body.objective_description
  )

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

  if (body.objective_description !== undefined) {
    const updated = await ServiceObjectiveModel.instance.updateObjectiveDescription(body.id, body.objective_description)
    if (!updated) {
      throw error(500, 'Failed to update objective_description')
    }
    hasUpdates = true
  }

  if (body.service_category_id !== undefined) {
    const updated = await ServiceObjectiveModel.instance.updateServiceCategoryId(body.id, body.service_category_id)
    if (!updated) {
      throw error(500, 'Failed to update service_category_id')
    }
    hasUpdates = true
  }

  if (body.annual_program_id !== undefined) {
    const updated = await ServiceObjectiveModel.instance.updateAnnualProgramId(body.id, body.annual_program_id)
    if (!updated) {
      throw error(500, 'Failed to update annual_program_id')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}