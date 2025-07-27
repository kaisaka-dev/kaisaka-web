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

  // Check if caregiver already has a relationship record
  try {
    const existingRelationship = await relationshipCCModel.instance.findByCaregiver(body.caregiver);
    if (existingRelationship) {
      throw error(409, `Caregiver already has a relationship record with child: ${existingRelationship.child}. Each caregiver can only have one relationship record.`);
    }
  } catch (err) {
    // If it's our custom error, re-throw it
    if (err.status === 409) {
      throw err;
    }
    // Otherwise, continue (might be a "not found" error which is what we want)
  }

  const relationshipData = {
    caregiver: body.caregiver,
    child: body.child,
    relationship: body.relationship !== undefined ? body.relationship : null
  };

  try {
    const inserted = await relationshipCCModel.instance.insertRelationship(relationshipData);
    
    if (!inserted) {
      console.error('insertRelationship returned null - likely constraint violation');
      throw error(400, 'Failed to create relationship. Check if caregiver and child IDs are valid.');
    }

    return json({ message: 'Relationship created successfully', data: inserted });
  } catch (dbError) {
    console.error('Raw database error:', dbError);
    
    // Skip HttpErrors (our own errors)
    if (dbError.status) {
      throw dbError;
    }
    
    // Handle actual database errors
    if (dbError.code === '23503') {
      throw error(400, 'Invalid caregiver or child ID. Please verify the IDs exist in the database.');
    } else if (dbError.code === '23505') {
      throw error(409, 'This caregiver-child relationship already exists.');
    } else {
      console.error('Unhandled database error:', dbError);
      throw error(500, 'Database connection or constraint error');
    }
  }
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