
import { membersModel } from "$lib/models/membersModel.js";
import { parseJoinParams } from "$lib/types/joining.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

// READ - Get member by ID
export async function GET({ url, params }) {
  const id = params.id;
  const joinParams = parseJoinParams(url);
  let member;

  try {
    if (!joinParams.select || id.length === 0) {
      // No join or filter params — simple find by ID
      member = await membersModel.instance.findById(id)
    } else {
      // Join query with filters
      member = await membersModel.instance.getJoin(joinParams.select, { eq: {id: id}});
    }

    if (!member) {
      throw error(404, 'Member not found');
    }

    return json(member);
  } catch (err) {
    console.error('Error fetching member:', err);
    throw error(500, 'Internal Server Error');
  }
}