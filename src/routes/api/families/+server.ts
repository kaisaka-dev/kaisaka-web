/**
 * FAMILIES API - How to Use
 * 
 * GET - Retrieve family records
 * • Get all families: GET /api/families
 * • Get family by ID: GET /api/families?id=family-uuid
 * • Get surnames only: GET /api/families?type=surnames&id=family-uuid
 * • Get complete family data: GET /api/families?id=family-uuid (default behavior)
 * 
 * POST - Create new family record
 * • No request body required - family is auto-generated with current timestamp
 * • Returns: { "message": "Family created successfully", "data": { "id": "uuid", "date_created": "ISO-string" } }
 * • Data types: id (string/UUID), date_created (string/ISO timestamp)
 * 
 * PUT - Update family record
 * • Not supported - families table only contains id and date_created fields
 * • Returns 400 error with explanation
 */

import { FamiliesModel } from "$lib/models/familiesModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url , locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');
    
    console.log('Families API - id:', id, 'type:', type);
    
    let result;
    
    if (type === 'surnames') {
      // Get surnames only (existing functionality)
      console.log('Fetching surnames...');
      result = await FamiliesModel.instance.getSurname(id || '');
    } else {
      // Get complete family data (new functionality)
      console.log('Fetching family data...');
      result = await FamiliesModel.instance.getFamilyData(id || '');
    }
    
    console.log('Families result:', result ? result.length : 'null', 'items');
    
    if (!result) {
      console.log('No families found, returning empty array');
      return json({ data: [] });
    }
    
    return json({ data: result });
  } catch (err) {
    console.error('Families API error:', err);
    throw error(500, 'Failed to fetch family data');
  }
};

export const POST: RequestHandler = async ({ request , locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const inserted = await FamiliesModel.instance.createFamily();

  if (!inserted) {
    throw error(500, 'Failed to create family');
  }

  return json({ message: 'Family created successfully', data: inserted });
}

export const PUT: RequestHandler = async({request}) => {
  // Note: Families table only contains id and date_created fields
  // No updatable fields are available in the families model
  throw error(400, 'No updatable fields available for families. Families only contain id and date_created.')
}