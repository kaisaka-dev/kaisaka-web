import { SocialParticipationModel } from "$lib/models/socialParticipationModel.js"
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * GET /api/social_participation
 * 
 * Retrieves social participation records by various filters.
 * 
 * Usage examples:
 * - GET /api/social_participation?id=123 (get by social participation record ID)
 * - GET /api/social_participation?child_id=abc-123-def (get all records for a child)
 * - GET /api/social_participation?child_id=abc-123-def&participation_type=Family%20Life&year=2023 (get specific record)
 * - GET /api/social_participation?participation_type=Community%20Life&year=2023 (get all records for type and year)
 * 
 * @param url.searchParams.id - Social participation record ID (optional)
 * @param url.searchParams.child_id - Child ID (optional)
 * @param url.searchParams.participation_type - Participation type filter (optional)
 * @param url.searchParams.year - Year filter (optional)
 * @returns JSON response with social participation record(s)
 */
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const child_id = url.searchParams.get('child_id');
  const participation_type = url.searchParams.get('participation_type');
  const year = url.searchParams.get('year');
  
  if (id) {
    const participationId = parseInt(id);
    if (isNaN(participationId)) {
      throw error(400, 'Invalid id format');
    }
    
    const participationRec = await SocialParticipationModel.instance.findById(participationId);
    if (!participationRec) {
      throw error(404, 'Social participation record not found');
    }
    return json(participationRec);
  }
  
  if (child_id && participation_type && year) {
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      throw error(400, 'Invalid year format');
    }
    
    const participationRec = await SocialParticipationModel.instance.findByChildParticipationYear(
      child_id, 
      participation_type as any, 
      yearNum
    );
    if (!participationRec) {
      throw error(404, 'Social participation record not found');
    }
    return json(participationRec);
  }
  
  if (child_id) {
    const participationRecs = await SocialParticipationModel.instance.findByChildId(child_id);
    return json(participationRecs);
  }
  
  if (participation_type && year) {
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      throw error(400, 'Invalid year format');
    }
    
    const participationRecs = await SocialParticipationModel.instance.findByParticipationTypeAndYear(
      participation_type as any, 
      yearNum
    );
    return json(participationRecs);
  }
  
  throw error(400, 'Missing required parameters. Provide id, child_id, or participation_type with year');
};

export const POST: RequestHandler = async({request}) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.child_id || !body.participation_type || !body.year) {
    throw error(400, 'Missing required fields: child_id, participation_type, year')
  }

  if (typeof body.year !== 'number' || body.year < 1900 || body.year > 2100) {
    throw error(400, 'Invalid year format')
  }

  const inserted = await SocialParticipationModel.instance.insertSocialParticipation(
    body.child_id, 
    body.participation_type, 
    body.year
  )

  if (!inserted){
    throw error(500, 'Failed to insert social participation record')
  }

  return json({ message: 'Social participation record inserted', data: inserted})
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

  const participationRec = await SocialParticipationModel.instance.findById(body.id)
  if(!participationRec){
    throw error(404, 'Social participation record not found')
  }

  let hasUpdates = false

  if (body.participation_type !== undefined || body.year !== undefined) {
    if (body.year !== undefined && (typeof body.year !== 'number' || body.year < 1900 || body.year > 2100)) {
      throw error(400, 'Invalid year format')
    }
    
    const updated = await SocialParticipationModel.instance.updateSocialParticipation(
      body.id, 
      body.participation_type, 
      body.year
    )
    if (!updated) {
      throw error(500, 'Failed to update social participation record')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Social participation record updated successfully' })
}

/**
 * DELETE /api/social_participation
 * 
 * Deletes social participation record(s) by various criteria.
 * 
 * Usage examples:
 * - DELETE /api/social_participation?id=123 (delete by social participation record ID)
 * - DELETE /api/social_participation?child_id=abc-123-def (delete all records for a child)
 * - DELETE /api/social_participation?child_id=abc-123-def&participation_type=Family%20Life&year=2023 (delete specific record)
 * 
 * @param url.searchParams.id - Social participation record ID (optional)
 * @param url.searchParams.child_id - Child ID (optional)
 * @param url.searchParams.participation_type - Participation type filter (optional, requires child_id and year)
 * @param url.searchParams.year - Year filter (optional, requires child_id and participation_type)
 * @returns JSON response with success message
 */
export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const child_id = url.searchParams.get('child_id');
  const participation_type = url.searchParams.get('participation_type');
  const year = url.searchParams.get('year');
  
  if (!id && !child_id) {
    throw error(400, 'Missing required parameter: id or child_id');
  }

  let deleted = false;
  
  if (id) {
    const participationId = parseInt(id);
    if (isNaN(participationId)) {
      throw error(400, 'Invalid id format');
    }
    deleted = await SocialParticipationModel.instance.deleteById(participationId);
  } else if (child_id && participation_type && year) {
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      throw error(400, 'Invalid year format');
    }
    deleted = await SocialParticipationModel.instance.deleteByChildParticipationYear(
      child_id, 
      participation_type as any, 
      yearNum
    );
  } else if (child_id) {
    console.log("childID found!")
    deleted = await SocialParticipationModel.instance.deleteByChildId(child_id);
  }

  if (!deleted) {
    throw error(404, 'Social participation record(s) not found or failed to delete');
  }

  return json({ message: 'Social participation record(s) deleted successfully' });
}