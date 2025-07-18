import { CommunityGroupTypeModel } from "$lib/models/communityGroupTypeModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * GET /api/community_group_type
 * 
 * Available endpoints:
 * - GET /api/community_group_type - Get all community group types
 * - GET /api/community_group_type?id=1 - Get specific community group type by ID
 * - GET /api/community_group_type?id=1&caregivers=true - Get caregivers in the group
 * - GET /api/community_group_type?id=1&income_types=true - Get income types for caregivers in the group  
 * - GET /api/community_group_type?id=1&full_data=true - Get complete group data with all relationships
 */
export const GET: RequestHandler = async({ url }) => {
  const group_id = url.searchParams.get('id');
  const get_caregivers = url.searchParams.get('caregivers') === 'true';
  const get_income_types = url.searchParams.get('income_types') === 'true';
  const get_full_data = url.searchParams.get('full_data') === 'true';

  try {
    let data;

    if (group_id) {
      const groupId = parseInt(group_id);
      
      if (get_full_data) {
        data = await CommunityGroupTypeModel.instance.getFullGroupTypeData(groupId);
      } else if (get_caregivers) {
        data = await CommunityGroupTypeModel.instance.getCaregiversByGroupType(groupId);
      } else if (get_income_types) {
        data = await CommunityGroupTypeModel.instance.getIncomeTypesByGroupType(groupId);
      } else {
        data = await CommunityGroupTypeModel.instance.findById(groupId);
      }
    } else {
      data = await CommunityGroupTypeModel.instance.getAll();
    }

    return json({ data });
  } catch (err) {
    throw error(500, 'Failed to retrieve community group types');
  }
}

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

  if (!body.name) {
    throw error(400, 'Missing required field: name.')
  }

  const inserted = await CommunityGroupTypeModel.instance.insertCommunityGroupType(body.name)

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

  if (body.name !== undefined) {
    const updated = await CommunityGroupTypeModel.instance.updateName(body.id, body.name)
    if (!updated) {
      throw error(500, 'Failed to update name')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}