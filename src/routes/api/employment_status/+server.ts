import { EmploymentStatusModel } from "$lib/models/employmentStatusModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  
  if (!id) {
    throw error(400, 'Missing required parameter: id');
  }

  const employmentRec = await EmploymentStatusModel.instance.findByMemberId(id)

  if (!employmentRec) {
    throw error(404, 'Employment Status Record not found');
  }

  return json(employmentRec);
};

export const POST: RequestHandler = async({request}) => {

  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!('able_to_work' in body) || !body.member_id ){
    throw error(400, 'Missing required fields.')
  }

  const inserted = await EmploymentStatusModel.instance.insertEmploymentStatus(body.able_to_work, body.employment_type, body.member_id)

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Employment Status Inserted', data: inserted})
}

export const PUT: RequestHandler = async({request, locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.id) {
    throw error(400, 'Missing required field: id.')
  }

  const employmentRec = await EmploymentStatusModel.instance.findByMemberId(body.id)

  if(!employmentRec){
    throw error(400, 'Member not found')
  }

  const id = employmentRec.id

  // console.log('Updating employment:', {
  //   id: id,
  //   able_to_work: body.able_to_work,
  //   employment_type: body.employment_type
  // });

  let hasUpdates = false

  if (body.able_to_work !== undefined || body.employment_type !== undefined) {
    const updated = await EmploymentStatusModel.instance.updateEmploymentStatus(
      id, 
      body.able_to_work, 
      body.employment_type
    )
    if (!updated) {
      throw error(500, 'Failed to update employment status')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

/**
 * DELETE /api/employment_status
 * 
 * Deletes an employment status record by employment status ID or member ID.
 * 
 * Usage examples:
 * - DELETE /api/employment_status?id=123 (delete by employment status record ID)
 * - DELETE /api/employment_status?member_id=abc-123-def (delete by member ID)
 * 
 * @param url.searchParams.id - Employment status record ID (optional)
 * @param url.searchParams.member_id - Member ID (optional)
 * @returns JSON response with success message
 */
export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const member_id = url.searchParams.get('member_id');
  
  if (!id && !member_id) {
    throw error(400, 'Missing required parameter: id or member_id');
  }

  let deleted = false;
  
  if (id) {
    const employmentId = parseInt(id);
    if (isNaN(employmentId)) {
      throw error(400, 'Invalid id format');
    }
    deleted = await EmploymentStatusModel.instance.deleteById(employmentId);
  } else if (member_id) {
    deleted = await EmploymentStatusModel.instance.deleteByMemberId(member_id);
  }

  if (!deleted) {
    throw error(404, 'Employment status record not found or failed to delete');
  }

  return json({ message: 'Employment status deleted successfully' });
}