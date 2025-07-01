import { MembershipAnnualRenewalModel } from "$lib/models/MemberShipAnnualRenewalModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.annual_program_id || !body.family_id || body.total_amount_due === undefined) {
    throw error(400, 'Missing required fields: annual_program_id, family_id, total_amount_due.')
  }

  const inserted = await MembershipAnnualRenewalModel.instance.insertRenewal(
    body.annual_program_id,
    body.family_id,
    body.total_amount_due,
    body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})
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

  if (body.total_amount_due !== undefined) {
    const updated = await MembershipAnnualRenewalModel.instance.updateTotalAmountDue(body.id, body.total_amount_due)
    if (!updated) {
      throw error(500, 'Failed to update total_amount_due')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await MembershipAnnualRenewalModel.instance.updateRemarks(body.id, body.remarks)
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