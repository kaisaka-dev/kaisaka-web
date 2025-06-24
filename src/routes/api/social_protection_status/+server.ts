import { socialProtectionStatusModel } from "$lib/models/socialProtectionStatusModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.child_id) {
    throw error(400, 'Missing required field: child_id')
  }

  const statusData = {
    child_id: body.child_id,
    year_accessed: body.year_accessed !== undefined ? body.year_accessed : null
  };

  const inserted = await socialProtectionStatusModel.instance.insertStatus(statusData);

  if (!inserted) {
    throw error(500, 'Failed to create social protection status');
  }

  return json({ message: 'Social protection status created successfully', data: inserted });
}