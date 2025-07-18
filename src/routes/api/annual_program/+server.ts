import { annualProgramModel } from "$lib/models/annualProgramModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const result = await annualProgramModel.instance.getAll();
  
  if (!result) {
    throw error(500, 'Failed to fetch annual programs');
  }
  
  return json({ data: result });
};

export const POST: RequestHandler = async({request, locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  let body: any = {}
  try {
    console.log('Annual Program POST - Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Annual Program POST - Request method:', request.method);
    
    const rawBody = await request.text();
    console.log('Annual Program POST - Raw body text:', rawBody);
    console.log('Annual Program POST - Raw body length:', rawBody.length);
    
    body = JSON.parse(rawBody);
    console.log('Annual Program POST - Parsed body:', JSON.stringify(body, null, 2));
  } catch (parseError) {
    console.error('Annual Program POST - JSON parsing failed:', parseError);
    console.error('Annual Program POST - Error details:', parseError instanceof Error ? parseError.message : parseError);
    throw error(400, `Invalid JSON format in request body: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`)
  }

  // Check required fields with specific error messages
  const requiredFields = ['start_year', 'end_year', 'target_new_cwds', 'target_old_cwds'];
  const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
  
  if (missingFields.length > 0) {
    console.error('Annual Program POST - Missing required fields:', missingFields);
    throw error(400, `Missing required fields: ${missingFields.join(', ')}. Required: start_year, end_year, target_new_cwds`);
  }

  console.log('Annual Program POST - Attempting to insert program...');
  
  // Remove id field since it's auto-generated
  const { id, ...insertData } = body;
  console.log('Annual Program POST - Data for insertion:', JSON.stringify(insertData, null, 2));
  
  try {
    const inserted = await annualProgramModel.instance.insertAnnualProgram(insertData);
    console.log('Annual Program POST - Raw insert result:', inserted);

    if (!inserted){
      console.error('Annual Program POST - Insert returned null/undefined');
      throw error(500, 'Failed to insert: Database operation returned no data')
    }

    console.log('Annual Program POST - Successfully inserted with ID:', inserted.id);
    return json({ message: 'Inserted', data: inserted}) 
  } catch (dbError) {
    console.error('Annual Program POST - Database error:', dbError);
    console.error('Annual Program POST - Database error stack:', dbError instanceof Error ? dbError.stack : 'No stack trace');
    throw error(500, `Failed to insert annual program: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`)
  }
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

  // Check for date-related updates
  const dateUpdates: any = {}
  if (body.start_year !== undefined) {
    dateUpdates.start_year = body.start_year
    hasUpdates = true
  }
  if (body.start_month !== undefined) {
    dateUpdates.start_month = body.start_month
    hasUpdates = true
  }
  if (body.start_date !== undefined) {
    dateUpdates.start_date = body.start_date
    hasUpdates = true
  }
  if (body.end_year !== undefined) {
    dateUpdates.end_year = body.end_year
    hasUpdates = true
  }
  if (body.end_month !== undefined) {
    dateUpdates.end_month = body.end_month
    hasUpdates = true
  }
  if (body.end_date !== undefined) {
    dateUpdates.end_date = body.end_date
    hasUpdates = true
  }

  if (Object.keys(dateUpdates).length > 0) {
    const updated = await annualProgramModel.instance.updateProgramDates(body.id, dateUpdates)
    if (!updated) {
      throw error(500, 'Failed to update program dates')
    }
  }

  // Check for content-related updates
  const contentUpdates: any = {}
  if (body.target_new_cwds !== undefined) {
    contentUpdates.target_new_cwds = body.target_new_cwds
    hasUpdates = true
  }
  if (body.target_old_cwds !== undefined) {
    contentUpdates.target_old_cwds = body.target_old_cwds
    hasUpdates = true
  }
  if (body.actual_new_cwds !== undefined) {
    contentUpdates.actual_new_cwds = body.actual_new_cwds
    hasUpdates = true
  }
  if (body.actual_old_cwds !== undefined) {
    contentUpdates.actual_old_cwds = body.actual_old_cwds
    hasUpdates = true
  }
  if (body.general_reflection !== undefined) {
    contentUpdates.general_reflection = body.general_reflection
    hasUpdates = true
  }
  if (body.lessons_learned !== undefined) {
    contentUpdates.lessons_learned = body.lessons_learned
    hasUpdates = true
  }

  if (Object.keys(contentUpdates).length > 0) {
    const updated = await annualProgramModel.instance.updateProgramContent(body.id, contentUpdates)
    if (!updated) {
      throw error(500, 'Failed to update program content')
    }
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}