import { RequestHandler } from "@sveltejs/kit";
import { MembersModel } from "../../../lib/models/members.js";
import { json } from "stream/consumers";

export const GET: RequestHandler = async({ request, cookies, url }) => {

  const members = await MembersModel.instance.get_caregivers();
  console.log(members)
  return json()
}