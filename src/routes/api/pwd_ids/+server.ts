import { pwdIdsModel } from "$lib/models/pwdIdsModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

/**
 * PWD_IDS API - How to Use
 * 
 * GET - Retrieve PWD ID records
 * • Get all PWD IDs: GET /api/pwd_ids
 * • Get by database ID: GET /api/pwd_ids?id=123
 * • Get by PWD ID string: GET /api/pwd_ids?pwd_id=PWD-12345
 * • Get by child ID: GET /api/pwd_ids?childID=child-uuid
 * 
 * POST - Create PWD ID record
 * • Required: pwd_id (string), expiry_date (string)
 * 
 * PUT - Update PWD ID record
 * • Required: id (database ID)
 * • Optional: pwd_id, expiry_date
 * 
 * DELETE - Remove PWD ID record
 * • Required: childID
 */

export const GET: RequestHandler = async ({ url, fetch }) => {
  const id = url.searchParams.get('id');
  const pwd_id = url.searchParams.get('pwd_id');
  const childID = url.searchParams.get('childID');
  let pwdRec;

  try {
    if (pwd_id) {
      // Get by PWD ID varchar field (Paolo's request)
      pwdRec = await pwdIdsModel.instance.findByPWDid(pwd_id);
      console.log('Found PWD record by pwd_id:', pwdRec);
    } else if (id) {
      // Get by database ID
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw error(400, 'Invalid id format');
      }
      pwdRec = await pwdIdsModel.instance.findById(numericId);
      console.log('Found PWD record by database ID:', pwdRec);
    } else if (childID) {
      // Get by child ID (legacy)
      const childRes = await fetch(`/api/children/${childID}`);
      console.log('[Fetch childRes]:', childRes);

      if (!childRes.ok) {
        throw error(400, 'Failed to fetch child');
      }

      const child = await childRes.json();

      if (!child?.pwd_id) {
        throw error(400, 'Child does not have a PWD ID');
      }

      pwdRec = await pwdIdsModel.instance.findById(child.pwd_id);
    } else {
      // Get all PWD IDs
      pwdRec = await pwdIdsModel.instance.getAll();
    }
    
    if (!pwdRec) {
      return json({ data: [] });
    }

    return json({ data: pwdRec });
  } catch (err) {
    console.error('PWD IDs API error:', err);
    throw error(500, 'Failed to retrieve PWD ID records');
  }
};


export const POST: RequestHandler = async ({ request }) => {
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON format.')
  }

  // Required fields
  if (!body.pwd_id || !body.expiry_date) {
    throw error(400, 'Missing required fields: pwd_id, expiry_date')
  }

  const inserted = await pwdIdsModel.instance.insertPwdId(
    body.pwd_id,
    body.expiry_date
  );

  if (!inserted) {
    throw error(500, 'Failed to create PWD ID');
  }

  return json({ message: 'PWD ID created successfully', data: inserted });
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

  if (body.pwd_id !== undefined) {
    const updated = await pwdIdsModel.instance.updateId(body.id, body.pwd_id)
    if (!updated) {
      throw error(500, 'Failed to update pwd_id')
    }
    hasUpdates = true
  }

  if (body.expiry_date !== undefined) {
    const updated = await pwdIdsModel.instance.updateExpiryDate(body.id, body.expiry_date)
    if (!updated) {
      throw error(500, 'Failed to update expiry_date')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}


export const DELETE: RequestHandler = async({ request, fetch }) => {
    let body: any = {}
    let result

    try {
      body = await request.json();
    } catch {
      throw error(400, 'Invalid JSON body.')
    }
    try{
      if(body.childID !== undefined){
        const childRes = await fetch(`/api/children/${body.childID}`);

        if (!childRes.ok) {
          throw error(400, 'Failed to fetch child');
        }

        const child = await childRes.json();

        if (!child?.pwd_id) {
          throw error(400, 'Child does not have a PWD ID');
        }
        const updateChild = await fetch('/api/children', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: child.id,
            pwd_id: null
          })
        })
        if(updateChild)
          result = await pwdIdsModel.instance.deleteById(child.pwd_id)
        else
          throw error(400, 'failed to remove pwd id in child record')
      }
      else{
        throw error(400, 'Missing required ID: childID')
      }

      if(!result)
        throw error(404, 'Failed to delete PWD ID.')
      return json({ success: true, data: result });
    } catch {
        throw error(500, 'Failed to delete PWD ID')
    }
}