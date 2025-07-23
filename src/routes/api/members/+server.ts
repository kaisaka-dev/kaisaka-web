
import { membersModel } from "$lib/models/membersModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * GET /api/members
 * 
 * Available endpoints:
 * - GET /api/members - Get all members
 * - GET /api/members?id=uuid - Get member by ID
 * - GET /api/members?firstName=John&lastName=Doe - Get members by full name
 * - GET /api/members?barangay_id=123 - Get members by barangay
 */
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const firstName = url.searchParams.get('firstName')
  const lastName = url.searchParams.get('lastName')
  const barangay_id = url.searchParams.get('barangay_id')
  
  try {
    let member;
    
    if (id) {
      member = await membersModel.instance.findById(id);
      if (!member) {
        throw error(404, 'Member not found');
      }
    } else if (firstName && lastName) {
      member = await membersModel.instance.findByFullName(firstName, lastName)
    } else if (barangay_id) {
      member = await membersModel.instance.findByBarangayId(parseInt(barangay_id))
    } else {
      member = await membersModel.instance.getAll()
    }

    return json({ data: member });
  } catch (err) {
    throw error(500, 'Failed to retrieve members');
  }
};

/**
 * POST /api/members
 * 
 * Creates a new member record.
 * 
 * Required fields:
 * - first_name (string): Member's first name
 * - last_name (string): Member's last name  
 * - sex (string): Must be "Male", "Female", or "Other"
 * 
 * Optional fields:
 * - middle_name (string|null): Member's middle name
 * - birthday (string|null): Birth date in ISO format (YYYY-MM-DD)
 * - address_id (string|null): UUID reference to addresses table
 * - barangay_id (number|null): Reference to barangays table
 * - admission_date (string|null): Date member was admitted in ISO format
 * - last_approved (string|null): Last approval date in ISO format
 * - updated_at (string|null): Last update timestamp in ISO format
 * 
 * Example request body:
 * {
 *   "first_name": "Juan",
 *   "last_name": "Cruz", 
 *   "middle_name": "Santos",
 *   "birthday": "1990-05-15",
 *   "sex": "Male",
 *   "address_id": "123e4567-e89b-12d3-a456-426614174000",
 *   "barangay_id": 42,
 *   "admission_date": "2023-01-15"
 * }
 * 
 * Response:
 * {
 *   "message": "Member created successfully",
 *   "data": { /* created member object with generated ID */ }
 * }
 * 
 * Error responses:
 * - 400: Missing required fields or invalid sex value
 * - 500: Database insertion failed
 */
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
    birthday: body.birthday !== undefined ? body.birthday: null,
    sex: body.sex,
    middle_name: body.middle_name !== undefined ? body.middle_name : null,
    address_id: body.address_id !== undefined ? body.address_id : null,
    barangay_id: body.barangay_id !== undefined ? body.barangay_id : null,
    admission_date: body.admission_date !== undefined ? body.admission_date : null,
    date_created: new Date().toISOString(),
    updated_at: body.updated_at !== undefined ? body.updated_at : null,
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

  // Handle barangay update
  if (body.barangay_id !== undefined) {
    const updated = await membersModel.instance.updateBarangay(body.id, body.barangay_id)
    if (!updated) {
      throw error(500, 'Failed to update barangay_id')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}