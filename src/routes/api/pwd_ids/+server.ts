import { pwdIdsModel } from "$lib/models/pwdIdsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  // Required fields
  if (!body.pwd_id || !body.expiry_date) {
    throw error(400, 'Missing required fields: pwd_id, expiry_date')
  }

  const inserted = await pwdIdsModel.instance.insertPwdId(
    body.pwd_id,
    body.expiry_date
  );

  if (!inserted) {
    throw error(500, 'Failed to create PWD ID');
  }

  return json({ message: 'PWD ID created successfully', data: inserted });
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

  if (body.pwd_id !== undefined) {
    const updated = await pwdIdsModel.instance.updateId(body.id, body.pwd_id)
    if (!updated) {
      throw error(500, 'Failed to update pwd_id')
    }
    hasUpdates = true
  }

  if (body.expiry_date !== undefined) {
    const updated = await pwdIdsModel.instance.updateExpiryDate(body.id, body.expiry_date)
    if (!updated) {
      throw error(500, 'Failed to update expiry_date')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}