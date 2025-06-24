import { philhealthIdsModel } from "$lib/models/philhealthIdsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.philhealth_id || !body.exp_date) {
    throw error(400, 'Missing required fields: philhealth_id, exp_date')
  }

  const inserted = await philhealthIdsModel.instance.insertPhilhealthId(
    body.philhealth_id,
    body.exp_date
  );

  if (!inserted) {
    throw error(500, 'Failed to create PhilHealth ID');
  }

  return json({ message: 'PhilHealth ID created successfully', data: inserted });
}