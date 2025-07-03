
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
  if (!body.first_name || !body.last_name || !body.sex) {
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

  // Handle basic info updates
  const basicInfoUpdates: any = {}
  if (body.first_name !== undefined) {
    basicInfoUpdates.first_name = body.first_name
    hasUpdates = true
  }
  if (body.middle_name !== undefined) {
    basicInfoUpdates.middle_name = body.middle_name
    hasUpdates = true
  }
  if (body.last_name !== undefined) {
    basicInfoUpdates.last_name = body.last_name
    hasUpdates = true
  }
  if (body.birthday !== undefined) {
    basicInfoUpdates.birthday = body.birthday
    hasUpdates = true
  }
  if (body.sex !== undefined) {
    if (!['Male', 'Female', 'Other'].includes(body.sex)) {
      throw error(400, 'Invalid sex value. Must be: Male, Female, or Other')
    }
    basicInfoUpdates.sex = body.sex
    hasUpdates = true
  }

  if (Object.keys(basicInfoUpdates).length > 0) {
    const updated = await membersModel.instance.updateMemberInfo(body.id, basicInfoUpdates)
    if (!updated) {
      throw error(500, 'Failed to update member basic info')
    }
  }

  // Handle address update
  if (body.address_id !== undefined) {
    const updated = await membersModel.instance.updateAddress(body.id, body.address_id)
    if (!updated) {
      throw error(500, 'Failed to update address_id')
    }
    hasUpdates = true
  }

  // Handle admission date update
  if (body.admission_date !== undefined) {
    const updated = await membersModel.instance.updateAdmissionDate(body.id, body.admission_date)
    if (!updated) {
      throw error(500, 'Failed to update admission_date')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}