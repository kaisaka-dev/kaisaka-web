import { FamiliesModel } from "$lib/models/familiesModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const items = await FamiliesModel.instance.findMany();
    
    if (!items) {
      throw error(500, 'Failed to fetch families');
    }
    
    return json(items);
  } catch {
    throw error(500, 'Failed to fetch families');
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