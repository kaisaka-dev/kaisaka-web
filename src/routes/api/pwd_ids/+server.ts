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