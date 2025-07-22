/**
 * INTERVENTION HISTORY API - How to Use
 * 
 * GET - Retrieve intervention history records
 * • Get specific history record by ID: GET /api/intervention_history?id=history-123
 * • Get all history for intervention: GET /api/intervention_history?id=intervention-123&type=by_intervention
 * 
 * POST - Create new history record
 * • Required: intervention_id, improvement, status
 * • Status: "Improved" | "Neutral" | "Regressed"
 * • Optional: remarks, date_checked (defaults to now)
 * • Example: { "intervention_id": "123", "improvement": "Can walk 20 steps", "status": "Improved", "remarks": "Good progress" }
 * 
 * PUT - Update history record
 * • Required: id, intervention (update object)
 * • intervention object can contain: improvement, status, remarks, date_checked
 * • Example: { "id": "123", "intervention": { "status": "Improved", "date_checked": "2024-01-20T10:00:00Z" } }
 * 
 * DELETE - Remove history record
 * • DELETE /api/intervention_history?id=history-123
 */

import { InterventionHistoryModel } from "$lib/models/interventionHistoryModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  
  if (!id) {
    throw error(400, 'Missing id parameter');
  }

  let interventionHistory;

  try {
    if (type === 'by_intervention') {
      // Get all history records for a specific intervention
      interventionHistory = await InterventionHistoryModel.instance.findByInterventionId(id)
    } else {
      // Get a specific history record by its primary key ID
      interventionHistory = await InterventionHistoryModel.instance.findById(id)
    }

    if (!interventionHistory) {
      throw error(404, 'Intervention history not found');
    }

    return json(interventionHistory);
  } catch (err) {
    console.error('Error fetching intervention history:', err);
    throw error(500, 'Internal Server Error');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.intervention_id || !body.improvement || !body.status) {
    throw error(400, 'Missing required field: intervention object')
  }

  const inserted = await InterventionHistoryModel.instance.recordInterventionHistory(body.intervention_id, body.improvment, body.status, body.remarks, body.date_checked);

  if (!inserted) {
    throw error(500, 'Failed to record intervention history');
  }

  return json({ message: 'Intervention history recorded successfully', data: inserted });
}

export const PUT: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.id || !body.intervention) {
    throw error(400, 'Missing required fields: id, intervention object.')
  }

  let hasUpdates = false

  // The intervention history model has an updateRecord method that takes an intervention object
  const updated = await InterventionHistoryModel.instance.updateHistoryRecord(body.id, body.intervention)
  if (!updated) {
    throw error(500, 'Failed to update intervention history record')
  }
  hasUpdates = true

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  
  if (!id) {
    throw error(400, 'Missing id parameter');
  }

  try {
    const deleted = await InterventionHistoryModel.instance.deleteById(id);
    
    if (!deleted) {
      throw error(404, 'Intervention history record not found or failed to delete');
    }

    return json({ message: 'Intervention history deleted successfully' });
  } catch (err) {
    console.error('Error deleting intervention history:', err);
    throw error(500, 'Internal Server Error');
  }
}
