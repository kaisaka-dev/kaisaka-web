import { FamiliesModel } from "$lib/models/familiesModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const inserted = await FamiliesModel.instance.createFamily();

  if (!inserted) {
    throw error(500, 'Failed to create family');
  }

  return json({ message: 'Family created successfully', data: inserted });
}