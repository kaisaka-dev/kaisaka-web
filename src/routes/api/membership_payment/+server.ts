import { MembershipPaymentModel } from "$lib/models/MembershipPaymentModel.js";
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

  if (!body.annual_program_id) {
    throw error(400, 'Missing required field: annual_program_id.')
  }

  const inserted = await MembershipPaymentModel.instance.insertPayment(
    body.annual_program_id,
    body.family_id,
    body.amount_paid,
    body.date_paid,
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

  if (!body.annual_program_id || !body.family_id) {
    throw error(400, 'Missing required fields: annual_program_id and family_id for identification.')
  }

  let hasUpdates = false

  if (body.amount_paid !== undefined) {
    const updated = await MembershipPaymentModel.instance.updateAmountPaid(body.annual_program_id, body.family_id, body.amount_paid)
    if (!updated) {
      throw error(500, 'Failed to update amount_paid')
    }
    hasUpdates = true
  }

  if (body.date_paid !== undefined) {
    const updated = await MembershipPaymentModel.instance.updateDatePaid(body.annual_program_id, body.family_id, body.date_paid)
    if (!updated) {
      throw error(500, 'Failed to update date_paid')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await MembershipPaymentModel.instance.updateRemarks(body.annual_program_id, body.family_id, body.remarks)
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