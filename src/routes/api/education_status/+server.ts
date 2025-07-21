import { educationStatusModel } from "$lib/models/educationStatusModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  
  if (!id) {
    throw error(400, 'Missing required parameter: id');
  }

  const educStatus = await educationStatusModel.instance.findByChildId(id);

  if (!educStatus) {
    throw error(404, 'Education Status Not Found');
  }

  return json(educStatus);
};

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }
  
  if (!body.child_id || !body.year_start) {
    throw error(400, 'Missing required fields: child_id, year_start')
  }

  const educationData = {
    child_id: body.child_id,
    year_start: body.year_start,
    education_type: body.education_type !== undefined ? body.education_type : null,
    year_end: body.year_end !== undefined ? body.year_end : null,
    grade_level: body.grade_level !== undefined ? body.grade_level : null,
    updated_at: new Date().toISOString()
  };

  const inserted = await educationStatusModel.instance.insertEducationStatus(educationData);

  if (!inserted) {
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Education Status Inserted', data: inserted })
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
  const updates: any = {}

  if (body.education_type !== undefined) {
    updates.education_type = body.education_type
    hasUpdates = true
  }

  if (body.year_start !== undefined) {
    updates.year_start = body.year_start
    hasUpdates = true
  }

  if (body.year_end !== undefined) {
    updates.year_end = body.year_end
    hasUpdates = true
  }

  if (body.grade_level !== undefined) {
    updates.grade_level = body.grade_level
    hasUpdates = true
  }

  if (Object.keys(updates).length > 0) {
    const updated = await educationStatusModel.instance.updateEducationDetails(body.id, updates)
    if (!updated) {
      throw error(500, 'Failed to update education details')
    }
  }

  if (body.child_id !== undefined) {
    const updated = await educationStatusModel.instance.updateChildReference(body.id, body.child_id)
    if (!updated) {
      throw error(500, 'Failed to update child_id')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

export const DELETE: RequestHandler = async({ request }) => {
    let body: any = {}

    try {
      body = await request.json();
    } catch {
      throw error(400, 'Invalid JSON body.')
    }

    if (!body.id) {
      throw error(400, 'Missing required ID')
    }

    try{
        const result = await educationStatusModel.instance.deleteById(body.id)

        if(!result){
          throw error(404, 'Failed to education status.')
        }
        return json({ success: true, data: result });
    } catch {
        throw error(500, 'Failed to delete education status')
    }
}