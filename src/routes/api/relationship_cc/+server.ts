import { relationshipCCModel } from "$lib/models/relationshipCCModel.js";
import { error, json, type RequestHandler} from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  if (!body.caregiver || !body.child || !body.relationship) {
    throw error(400, 'Missing required fields: caregiver, child, relationship')
  }

  const relationshipData = {
    caregiver: body.caregiver,
    child: body.child,
    relationship: body.relationship
  };

  const inserted = await relationshipCCModel.instance.insertRelationship(relationshipData);

  if (!inserted) {
    throw error(500, 'Failed to create caregiver-child relationship');
  }

  return json({ message: 'Relationship created successfully', data: inserted });
}