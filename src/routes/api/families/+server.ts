import { FamiliesModel } from "$lib/models/familiesModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
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

export const POST: RequestHandler = async ({ request }) => {
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