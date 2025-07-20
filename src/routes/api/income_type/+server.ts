import { IncomeTypeModel } from "$lib/models/incomeTypeModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * Income Type API endpoints
 * 
 * Available endpoints:
 * - GET /api/income_type - Get all income types
 * - GET /api/income_type?caregiver_id=uuid - Get income types for specific caregiver
 * - GET /api/income_type?category=Home-based - Get income types by category (Home-based|Self-employed|Wage Earner)
 * - POST /api/income_type - Create new income type
 * - PUT /api/income_type - Update existing income type
 * - DELETE /api/income_type - Delete income type by id
 */

export const GET: RequestHandler = async({ url }) => {
  const caregiver_id = url.searchParams.get('caregiver_id');
  const category = url.searchParams.get('category');

  try {
    let data;

    if (caregiver_id) {
      data = await IncomeTypeModel.instance.findByCaregiver(caregiver_id);
    } else if (category && ['Home-based', 'Self-employed', 'Wage Earner'].includes(category)) {
      data = await IncomeTypeModel.instance.findByCategory(category as 'Home-based' | 'Self-employed' | 'Wage Earner');
    } else {
      data = await IncomeTypeModel.instance.getAll();
    }

    return json({ data });
  } catch (err) {
    throw error(500, 'Failed to retrieve income types');
  }
}

export const POST: RequestHandler = async({request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!body.income_category) {
    throw error(400, 'Missing required field: income_category.')
  }

  // Validate income_category enum
  if (!['Home-based', 'Self-employed', 'Wage Earner'].includes(body.income_category)) {
    throw error(400, 'Invalid income_category. Must be: Home-based, Self-employed, or Wage Earner')
  }

  const inserted = await IncomeTypeModel.instance.insertIncomeType(
    body.caregiver_id,
    body.date_start,
    body.date_end || null,
    body.income_category  // Now required, no null fallback
  )

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

  const updates: any = {}
  let hasUpdates = false

  if (body.caregiver_id !== undefined) {
    updates.caregiver_id = body.caregiver_id
    hasUpdates = true
  }

  if (body.date_start !== undefined) {
    updates.date_start = body.date_start
    hasUpdates = true
  }

  if (body.date_end !== undefined) {
    updates.date_end = body.date_end
    hasUpdates = true
  }

  if (body.income_category !== undefined) {
    updates.income_category = body.income_category
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  const updated = await IncomeTypeModel.instance.updateIncomeType(body.id, updates)
  if (!updated) {
    throw error(500, 'Failed to update income type')
  }

  return json({ message: 'Updated successfully' })
}

export const DELETE: RequestHandler = async({request}) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body.')
  }

  if (!body.id) {
    throw error(400, 'Missing required field: id.')
  }

  const deleted = await IncomeTypeModel.instance.deleteById(body.id)
  if (!deleted) {
    throw error(500, 'Failed to delete income type')
  }

  return json({ message: 'Deleted successfully' })
}