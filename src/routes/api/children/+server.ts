import { ChildrenModel } from "$lib/models/childrenModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');
    
    let children;
    
    if (type === 'pending-documents') {
      // Get children with pending documents data
      console.log('Fetching pending documents...');
      try {
        children = await ChildrenModel.instance.getPendingDocuments(id || '');
        console.log('Pending documents result:', children ? children.length : 'null', 'items');
      } catch (dbError) {
        console.error('Database error in getPendingDocuments:', dbError);
        throw error(500, 'Database query failed');
      }
    } else if (type === 'list' || type === 'joined') {
      // Get children list with joined data
      console.log('Fetching children list with joined data...');
      try {
        children = await ChildrenModel.instance.getChildrenList(id || '');
        console.log('Children list result:', children ? children.length : 'null', 'items');
      } catch (dbError) {
        console.error('Database error in getChildrenList:', dbError);
        throw error(500, 'Database query failed');
      }
    } else {
      // Default behavior - get all children
      console.log('Fetching all children...');
      try {
        children = await ChildrenModel.instance.getAll();
        console.log('All children result:', children ? children.length : 'null', 'items');
      } catch (dbError) {
        console.error('Database error in getAll:', dbError);
        throw error(500, 'Database query failed');
      }
    }

    if (!children) {
      console.log('No children found, returning empty array');
      return json({ data: [] });
    }

    return json({ data: children });
  } catch (err) {
    console.error('API error:', err);
    throw error(500, 'Failed to fetch children');
  }
};

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!('has_barangay_cert' in body) || !('has_birth_cert' in body) || !('has_medical_cert' in body) || !('is_active' in body) || !body.member_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await ChildrenModel.instance.insertChild(
    body.has_philhealth,
    body.has_barangay_cert,
    body.has_birth_cert,
    body.has_medical_cert,
    body.is_active,
    body.member_id,
    body.pwd_id,
    body.disability_id,
    body.disability_nature,
    body.remarks,
    body.has_national_id,
    body.has_vote
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Child Data Inserted', data: inserted})

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

  if (body.has_barangay_cert !== undefined) {
    const updated = await ChildrenModel.instance.updateBarangayCert(body.id, body.has_barangay_cert)
    if (!updated) {
      throw error(500, 'Failed to update has_barangay_cert')
    }
    hasUpdates = true
  }

  if (body.has_birth_cert !== undefined) {
    const updated = await ChildrenModel.instance.updateBirthCert(body.id, body.has_birth_cert)
    if (!updated) {
      throw error(500, 'Failed to update has_birth_cert')
    }
    hasUpdates = true
  }

  if (body.has_medical_cert !== undefined) {
    const updated = await ChildrenModel.instance.updateMedCert(body.id, body.has_medical_cert)
    if (!updated) {
      throw error(500, 'Failed to update has_medical_cert')
    }
    hasUpdates = true
  }

  if (body.is_active !== undefined) {
    const updated = await ChildrenModel.instance.updateActiveStatus(body.id, body.is_active)
    if (!updated) {
      throw error(500, 'Failed to update is_active')
    }
    hasUpdates = true
  }

  if (body.pwd_id !== undefined) {
    const updated = await ChildrenModel.instance.updatePwdId(body.id, body.pwd_id)
    if (!updated) {
      throw error(500, 'Failed to update pwd_id')
    }
    hasUpdates = true
  }

  if (body.remarks !== undefined) {
    const updated = await ChildrenModel.instance.updateRemarks(body.id, body.remarks)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if(body.has_vote !== undefined){
    const updated = await ChildrenModel.instance.updateHasVote(body.id, body.has_vote)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if(body.has_vote !== undefined){
    const updated = await ChildrenModel.instance.updateHasNatID(body.id, body.has_national_id)
    if (!updated) {
      throw error(500, 'Failed to update remarks')
    }
    hasUpdates = true
  }

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

