import { relationshipCCModel } from "$lib/models/relationshipCCModel.js";
import { error, json, type RequestHandler} from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.caregiver || !body.child) {
    throw error(400, 'Missing required fields: caregiver, child, relationship')
  }

  const relationshipData = {
    caregiver: body.caregiver,
    child: body.child,
    relationship: body.relationship !== undefined ? body.relationship : null
  };

  const inserted = await relationshipCCModel.instance.insertRelationship(relationshipData);

  if (!inserted) {
    throw error(500, 'Failed to create caregiver-child relationship');
  }

  return json({ message: 'Relationship created successfully', data: inserted });
}

export const PUT: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.caregiver) {
    throw error(400, 'Missing required field: caregiver.')
  }

  let hasUpdates = false

  if (body.relationship !== undefined) {
    const updated = await relationshipCCModel.instance.updateRelationshipType(body.caregiver, body.relationship)
    if (!updated) {
      throw error(500, 'Failed to update relationship')
    }
    hasUpdates = true
  }

  if (body.child !== undefined) {
    const updated = await relationshipCCModel.instance.updateChildForCaregiver(body.caregiver, body.child)
    if (!updated) {
      throw error(500, 'Failed to update child')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}