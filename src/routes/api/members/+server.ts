
import { membersModel } from "$lib/models/membersModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// CREATE - Add new member
export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  // Required fields
  if (!body.first_name || !body.last_name || !body.birthday || !body.sex) {
    throw error(400, 'Missing required fields: first_name, last_name, birthday, sex')
  }

  // Validate sex enum
  if (!['Male', 'Female', 'Other'].includes(body.sex)) {
    throw error(400, 'Invalid sex value. Must be: Male, Female, or Other')
  }

  // Prepare member data with nullable field handling
  const memberData = {
    first_name: body.first_name,
    last_name: body.last_name,
    birthday: body.birthday,
    sex: body.sex,
    middle_name: body.middle_name !== undefined ? body.middle_name : null,
    address_id: body.address_id !== undefined ? body.address_id : null,
    admission_date: body.admission_date !== undefined ? body.admission_date : null,
    date_created: new Date().toISOString(),
    last_updated: body.last_updated !== undefined ? body.last_updated : null,
    last_approved: body.last_approved !== undefined ? body.last_approved : null
  };

  const inserted = await membersModel.instance.insertMember(memberData);

  if (!inserted) {
    throw error(500, 'Failed to create member');
  }

  return json({ message: 'Member created successfully', data: inserted });
}