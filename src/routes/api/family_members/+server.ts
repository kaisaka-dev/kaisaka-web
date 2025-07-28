import { FamilyMembersModel } from "$lib/models/FamilyMembersModel.js";
import { CaregiversModel } from "$lib/models/caregiversModel.js";
import { parseJoinParams } from "$lib/types/joining.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * FAMILY_MEMBERS API - How to Use
 * 
 * GET - Retrieve family member records
 * • Get all family members: GET /api/family_members
 * • Get by member ID: GET /api/family_members?member_id=uuid
 * • Get by family ID: GET /api/family_members?family_id=uuid
 * • Get detailed info: GET /api/family_members?details=true&family_id=uuid (optional family_id)
 * • Get with joins (legacy): GET /api/family_members?id=uuid&type=memberid&select=...
 * 
 * POST - Create family member relationship
 * • Required: family_id, member_id, is_child (boolean)
 * • Optional: relationship_type, caregiver_id (for non-child, non-caregiver members)
 * 
 * PUT - Update family member relationship
 * • Required: family_id, member_id
 * • Optional: is_child, relationship_type
 * 
 * DELETE - Remove family member relationship
 * • Required: family_id, member_id
 */

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  const member_id = url.searchParams.get('member_id');
  const family_id = url.searchParams.get('family_id');
  const details = url.searchParams.get('details') === 'true';
  const joinParams = parseJoinParams(url);
  
  try {
    let family_member;

    // Detailed info getter (new functionality)
    if (details) {
      // Get family members with detailed info (names, contact)
      family_member = await FamilyMembersModel.instance.getFamilyMembersWithDetails(family_id || undefined);
    }
    // Simple getters
    else if (member_id && !type && !joinParams.select) {
      // Get all family relationships for a member
      family_member = await FamilyMembersModel.instance.findByMemberId(member_id);
    } else if (family_id && !type && !joinParams.select) {
      // Get all members in a family
      family_member = await FamilyMembersModel.instance.findByFamilyId(family_id);
    } else if (!id && !type && !member_id && !family_id) {
      // Get all family member relationships
      family_member = await FamilyMembersModel.instance.findMany();
    } 
    // Legacy complex join functionality
    else if (id && joinParams.select && type) {
      // Ensure caregiver_id is included in legacy selects if not already present
      let selectStatement = joinParams.select;
      if (!selectStatement.includes('caregiver_id')) {
        // Add caregiver_id to the select if it's not already there
        const lines = selectStatement.split('\n').map(line => line.trim()).filter(line => line);
        // Find where to insert caregiver_id (after basic fields, before joins)
        let insertIndex = lines.findIndex(line => line.includes('!') || line.includes('('));
        if (insertIndex === -1) insertIndex = lines.length;
        lines.splice(insertIndex, 0, 'caregiver_id,');
        selectStatement = lines.join('\n      ');
      }
      
      switch (type) {
        case 'memberid':
          family_member = await FamilyMembersModel.instance.getMultipleJoin(selectStatement, { eq: { member_id: id } });
          break;
        case 'familyid':
          family_member = await FamilyMembersModel.instance.getMultipleJoin(selectStatement, { eq: { family_id: id } });
          break;
        default:
          throw error(400, 'Invalid type parameter for legacy joins');
      }
    } else {
      throw error(400, 'Invalid query parameters. Use member_id, family_id, or legacy id+type+select combination');
    }

    console.log('Family members API result:', family_member ? (Array.isArray(family_member) ? family_member.length : 1) : 'null', 'items');

    if (!family_member) {
      return json({ data: [] });
    }

    return json({ data: family_member });
  } catch (err) {
    console.error('Error fetching family members:', err);
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

  let caregiver_id: string | null = null;

  // If member is a child, caregiver_id should be null
  if (body.is_child) {
    caregiver_id = null;
  } else {
    // If member is not a child, check if they are a caregiver
    const caregiverRecord = await CaregiversModel.instance.findByMemberId(body.member_id);
    
    if (caregiverRecord) {
      // If they are a caregiver, use their own caregiver ID
      caregiver_id = caregiverRecord.id;
    } else {
      // If they are not a caregiver, use the provided caregiver_id or null
      caregiver_id = body.caregiver_id || null;
    }
  }

  const inserted = await FamilyMembersModel.instance.insertFamilyMember(
    body.family_id,
    body.member_id,
    body.is_child,
    caregiver_id,
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


export const DELETE: RequestHandler = async({ request }) => {
    let body: any = {}
    try {
      body = await request.json();
    } catch {
      throw error(400, 'Invalid JSON body.')
    }

    if (!body.family_id || !body.member_id) {
      throw error(400, 'Missing required fields: family_id and member_id for identification.')
    }

    try{
        const result = await FamilyMembersModel.instance.removeFamilyMember(body.family_id, body.member_id)

        if(!result){
          throw error(404, 'Failed to delete family member.')
        }

        return json({ success: true, data: result });
    } catch {
        throw error(500, 'Failed to delete family member')
    }
}