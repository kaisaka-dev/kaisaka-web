/**
 * CAREGIVER_GROUPS API - How to Use
 * 
 * GET - Retrieve caregiver group records
 * • Get all records: GET /api/caregiver_groups
 * • Get by record ID: GET /api/caregiver_groups?id=123
 * • Get by caregiver ID: GET /api/caregiver_groups?caregiver_id=uuid
 * • Get by community group ID: GET /api/caregiver_groups?community_group_id=123
 * • Get active memberships: GET /api/caregiver_groups?active=true&caregiver_id=uuid (optional caregiver_id)
 * 
 * POST - Create caregiver group membership
 * • Required: caregiver_id, community_group_id
 * • Optional: date_joined, date_left
 * 
 * PUT - Update caregiver group membership
 * • Required: id
 * • Optional: date_joined, date_left, community_group_id
 * 
 * DELETE - Remove caregiver group membership
 * • Required: id
 */

import { CaregiverGroupsModel } from "$lib/models/caregiverGroupsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const caregiver_id = url.searchParams.get('caregiver_id');
  const community_group_id = url.searchParams.get('community_group_id');
  const active = url.searchParams.get('active') === 'true';

  try {
    let data;

    if (id) {
      // Get by record ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw error(400, 'Invalid id format');
      }
      data = await CaregiverGroupsModel.instance.findById(numericId);
      if (!data) {
        throw error(404, 'Caregiver group record not found');
      }
    } else if (active) {
      // Get active memberships
      data = await CaregiverGroupsModel.instance.findActiveMembers(caregiver_id || undefined);
    } else if (caregiver_id) {
      // Get by caregiver ID
      data = await CaregiverGroupsModel.instance.findByCaregiverId(caregiver_id);
    } else if (community_group_id) {
      // Get by community group ID
      const numericGroupId = parseInt(community_group_id);
      if (isNaN(numericGroupId)) {
        throw error(400, 'Invalid community_group_id format');
      }
      data = await CaregiverGroupsModel.instance.findByCommunityGroupId(numericGroupId);
    } else {
      // Get all caregiver group records
      data = await CaregiverGroupsModel.instance.findMany();
    }

    return json({ data });
  } catch (err) {
    console.error('Caregiver groups API error:', err);
    throw error(500, 'Failed to retrieve caregiver group records');
  }
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.caregiver_id || !body.community_group_id) {
    throw error(400, 'Missing required fields: caregiver_id, community_group_id.')
  }

  const inserted = await CaregiverGroupsModel.instance.insertCaregiverGroup(
    body.caregiver_id,
    body.community_group_id,
    body.date_joined,
    body.date_left
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

  if (body.date_joined !== undefined) {
    const updated = await CaregiverGroupsModel.instance.updateDateJoined(body.id, body.date_joined)
    if (!updated) {
      throw error(500, 'Failed to update date_joined')
    }
    hasUpdates = true
  }

  if (body.date_left !== undefined) {
    const updated = await CaregiverGroupsModel.instance.updateDateLeft(body.id, body.date_left)
    if (!updated) {
      throw error(500, 'Failed to update date_left')
    }
    hasUpdates = true
  }

  if (body.community_group_id !== undefined) {
    const updated = await CaregiverGroupsModel.instance.updateCommunityGroupId(body.id, body.community_group_id)
    if (!updated) {
      throw error(500, 'Failed to update community_group_id')
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

  if (!body.id) {
    throw error(400, 'Missing required field: id.')
  }

  try {
    const numericId = parseInt(body.id);
    if (isNaN(numericId)) {
      throw error(400, 'Invalid id format');
    }

    const result = await CaregiverGroupsModel.instance.deleteById(numericId);

    if (!result) {
      throw error(404, 'Caregiver group record not found or failed to delete.');
    }

    return json({ message: 'Caregiver group membership deleted successfully' });
  } catch (err) {
    console.error('Delete caregiver group error:', err);
    throw error(500, 'Failed to delete caregiver group membership');
  }
}