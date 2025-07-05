import { CommunityGroupTypeModel } from "$lib/models/communityGroupTypeModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const communityGroupTypes = await CommunityGroupTypeModel.instance.findMany();
    
    if (!communityGroupTypes) {
      throw error(500, 'Failed to fetch community group types');
    }
    
    return json(communityGroupTypes);
  } catch {
    throw error(500, 'Failed to fetch community group types');
  }
};

export const POST: RequestHandler = async({request}) => {
  
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