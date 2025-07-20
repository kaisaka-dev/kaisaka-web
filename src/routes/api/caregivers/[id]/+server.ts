import { CaregiversModel } from "$lib/models/caregiversModel.js";
import { parseJoinParams } from "$lib/types/joining.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// READ - Get member by ID
export async function GET({ params, url , locals }) {
  const { session, user } = await locals.safeGetSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const id = params.id;
  const joinParams = parseJoinParams(url);
  let caregiver;

  try {
    if (!joinParams.select || id.length === 0) {
      // No join or filter params — simple find by ID
      caregiver = await CaregiversModel.instance.findById(id)
    } else {
      // Join query with filters
      caregiver = await CaregiversModel.instance.getJoin(joinParams.select, { eq: {id: id}});
    }

    if (!caregiver) {
      throw error(404, 'Caregiver not found');
    }

    return json(caregiver);
  } catch (err) {
    console.error('Error fetching member:', err);
    throw error(500, 'Internal Server Error');
  }
}