import { CaregiverGroupsModel } from "$lib/models/caregiverGroupsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const caregiverGroups = await CaregiverGroupsModel.instance.findMany();
    
    if (!caregiverGroups) {
      throw error(500, 'Failed to fetch caregiver groups');
    }
    
    return json(caregiverGroups);
  } catch {
    throw error(500, 'Failed to fetch caregiver groups');
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

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}