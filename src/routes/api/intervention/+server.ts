/**
 * INTERVENTION API - How to Use
 * 
 * GET - Retrieve interventions
 * • Get specific intervention by ID: GET /api/intervention?id=intervention-123
 * • Get interventions by child with joins: GET /api/intervention?id=child-123&type=serviceCategory&select=*,service_category(*)
 * 
 * POST - Create new intervention
 * • Required: child_id, intervention, service_category_name, status, type
 * • Status: "Improved" | "Neutral" | "Regressed"
 * • Type: "education" | "social"
 * • Optional: remarks
 * • Example: { "child_id": "123", "intervention": "Speech Therapy", "service_category_name": "Health", "status": "Improved", "type": "education" }
 * 
 * PUT - Update intervention
 * • Required: id
 * • Optional: intervention, date_created, remarks, status
 * • Example: { "id": "123", "intervention": "Updated therapy name", "status": "Improved" }
 * 
 * DELETE - Remove intervention
 * • DELETE /api/intervention?id=intervention-123
 */

import { InterventionModel } from "$lib/models/interventionModel.js";
import { ServiceCategoryModel } from "$lib/models/serviceCategoryModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { parseJoinParams } from "$lib/types/joining.js";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  const joinParams = parseJoinParams(url);
  
  if (!id) {
    throw error(400, 'Missing id parameter');
  }

  let intervention;

  try {
    // If no type specified, get intervention by its primary key ID
    if (!type) {
      intervention = await InterventionModel.instance.findById(id);
      
      if (!intervention || intervention.length === 0) {
        throw error(404, 'Intervention not found');
      }

      return json(intervention);
    }

    // Existing logic for joined queries
    if (!joinParams.select) {
      throw error(400, 'Missing select query param for joined queries');
    }

    switch (type) {
      case 'serviceCategory':
        intervention = await InterventionModel.instance.getMultipleJoin(joinParams.select, { eq: {child_id: id} });
        break;
      default:
        throw error(400, 'Invalid type parameter');
    }

    if (!intervention || (Array.isArray(intervention) && intervention.length === 0)) {
      throw error(404, 'No interventions found');
    }

    return json(intervention);
  } catch (err) {
    console.error('Error fetching intervention:', err);
    throw error(500, 'Internal Server Error');
  }
};


export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.child_id || !body.intervention || !body.service_category_name || !body.status || !body.type) {
    throw error(400, 'Missing required fields: child_id, intervention, service_category_name, status, type')
  }

  if (!['Improved', 'Neutral', 'Regressed'].includes(body.status)) {
    throw error(400, 'Invalid status. Must be: Improved, Neutral, or Regressed')
  }

  if (!['education', 'social'].includes(body.type)) {
    throw error(400, 'Invalid type. Must be: education or social')
  }

  // Find or create service category
  let serviceCategory = await ServiceCategoryModel.instance.findByNameIgnoreCase(body.service_category_name);
  
  if (!serviceCategory) {
    // Create new service category if it doesn't exist
    serviceCategory = await ServiceCategoryModel.instance.insertServiceCategory(body.service_category_name);
    
    if (!serviceCategory) {
      throw error(500, 'Failed to create service category');
    }
  }
  
  console.log('Service category found/created:', serviceCategory);

  try {
    const inserted = await InterventionModel.instance.insertIntervention(
      body.child_id,
      body.intervention,
      body.remarks !== undefined ? body.remarks : null,
      serviceCategory.id,
      body.status,
    );

    if (!inserted) {
      console.error('Failed to insert intervention - no data returned');
      throw error(500, 'Failed to create intervention');
    }

    return json({ message: 'Intervention created successfully', data: inserted });
  } catch (err) {
    console.error('Error creating intervention:', err);
    const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
    throw error(500, 'Failed to create intervention: ' + errorMessage);
  }

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

  if (body.remarks !== undefined) {
    const updated = await InterventionModel.instance.updateRemarks(body.id, body.remarks)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if (body.status !== undefined) {
    if (!['Improved', 'Neutral', 'Regressed'].includes(body.status)) {
      throw error(400, 'Invalid status. Must be: Improved, Neutral, or Regressed')
    }
    const updated = await InterventionModel.instance.updateStatus(body.id, body.status)
    if (!updated) {
      throw error(500, 'Failed to update status')
    }
    hasUpdates = true
  }

  if (body.intervention !== undefined) {
    const updated = await InterventionModel.instance.updateIntervention(body.id, body.intervention)
    if (!updated) {
      throw error(500, 'Failed to update intervention name')
    }
    hasUpdates = true
  }

  if (body.date_created !== undefined) {
    const updated = await InterventionModel.instance.updateDateCreated(body.id, body.date_created)
    if (!updated) {
      throw error(500, 'Failed to update date_created')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  
  if (!id) {
    throw error(400, 'Missing id parameter');
  }

  try {
    const deleted = await InterventionModel.instance.deleteById(id);
    
    if (!deleted) {
      throw error(404, 'Intervention not found or failed to delete');
    }

    return json({ message: 'Intervention deleted successfully' });
  } catch (err) {
    console.error('Error deleting intervention:', err);
    throw error(500, 'Internal Server Error');
  }
}