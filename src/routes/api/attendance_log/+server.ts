import { AttendanceLogModel } from "$lib/models/attendanceLogModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request, locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.conducted_activity_id || !body.participant_id) {
    throw error(400, 'Missing required fields: conducted_activity_id, participant_id.')
  }

  const inserted = await AttendanceLogModel.instance.insertAttendanceLog(
    body.conducted_activity_id,
    body.participant_id,
    body.is_late || false,
    body.participant_type,
    body.individual_intervention_plan,
    body.transition_graduation_plan,
    body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
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

  let hasUpdates = false

  if (body.is_late !== undefined) {
    const updated = await AttendanceLogModel.instance.updateLateStatus(body.id, body.is_late)
    if (!updated) {
      throw error(500, 'Failed to update is_late')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await AttendanceLogModel.instance.updateRemarks(body.id, body.remarks)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}