import { FamilyMembersModel } from "$lib/models/FamilyMembersModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.family_id || !body.member_id || body.is_child === undefined) {
    throw error(400, 'Missing required fields: family_id, member_id, is_child.')
  }

  const inserted = await FamilyMembersModel.instance.insertFamilyMember(
    body.family_id,
    body.member_id,
    body.is_child,
    body.relationship_type
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted family_member', data: inserted})
}

export const PUT: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.family_id || !body.member_id) {
    throw error(400, 'Missing required fields: family_id and member_id for identification.')
  }

  let hasUpdates = false

  if (body.is_child !== undefined) {
    const updated = await FamilyMembersModel.instance.updateChildStatus(body.family_id, body.member_id, body.is_child)
    if (!updated) {
      throw error(500, 'Failed to update is_child')
    }
    hasUpdates = true
  }

  if (body.relationship_type !== undefined) {
    const updated = await FamilyMembersModel.instance.updateRelationshipType(body.family_id, body.member_id, body.relationship_type)
    if (!updated) {
      throw error(500, 'Failed to update relationship_type')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}