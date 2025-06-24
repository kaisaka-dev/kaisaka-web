import { educationStatusModel } from "$lib/models/educationStatusModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }
  
  if (!body.child_id || !body.year_start) {
    throw error(400, 'Missing required fields: child_id, year_start')
  }

  const educationData = {
    child_id: body.child_id,
    year_start: body.year_start,
    education_type: body.education_type !== undefined ? body.education_type : null,
    year_end: body.year_end !== undefined ? body.year_end : null,
    grade_level: body.grade_level !== undefined ? body.grade_level : null,
    last_updated: new Date().toISOString()
  };