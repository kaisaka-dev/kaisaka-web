import { FamilyMembersModel } from "$lib/models/FamilyMembersModel.js";
import { parseJoinParams } from "$lib/types/joining.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  const joinParams = parseJoinParams(url);
  
  if (!id || !joinParams.select || !type) {
    throw error(400, 'Missing id, type, or select query param');
  }

  let family_member;

  try {
    switch (type) {
      case 'memberid':
        family_member = await FamilyMembersModel.instance.getMultipleJoin(joinParams.select, { eq: { member_id: id } });
        break;
      case 'familyid':
        family_member = await FamilyMembersModel.instance.getMultipleJoin(joinParams.select, { eq: { family_id: id } });
        break;
      default:
        throw error(400, 'Invalid type parameter');
    }

    console.log('in API: ', family_member)

    if (!family_member) {
      throw error(404, 'Family Member not found');
    }

    return json(family_member);
  } catch (err) {
    console.error('Error fetching family member:', err);
    throw error(500, 'Internal Server Error');
  }
};

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