import { ChildrenModel } from "$lib/models/childrenModel.js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async({request}) => {
  
  let body: any = {}
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Missing required fields.')
  }

  if (!('has_barangay_cert' in body) || !('has_birth_cert' in body) || !('has_medical_cert' in body) || !('is_active' in body) || !('has_philhealth' in body) || !body.member_id) {
    throw error(400, 'Missing required fields.')
  }

  const inserted = await ChildrenModel.instance.insertChild(
    body.has_barangay_cert, body.has_birth_cert, body.has_medical_cert, body.is_active, body.member_id, body.philhealth_id,  body.pwd_id, body.remarks
  )

  if (!inserted){
    throw error(500, 'Failed to insert')
  }

  return json({ message: 'Inserted', data: inserted})

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

  if (body.has_med_cert !== undefined) {
    const updated = await ChildrenModel.instance.updateMedCert(body.id, body.has_med_cert)
    if (!updated) {
      throw error(500, 'Failed to update has_med_cert')
    }
    hasUpdates = true
  }

  if (body.philhealth_id !== undefined) {
    const updated = await ChildrenModel.instance.updatePhilHealthId(body.id, body.philhealth_id)
    if (!updated) {
      throw error(500, 'Failed to update philhealth_id')
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

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
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

  if (body.philhealth_id !== undefined) {
    const updated = await ChildrenModel.instance.updatePhilHealthId(body.id, body.philhealth_id)
    if (!updated) {
      throw error(500, 'Failed to update philhealth_id')
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

  if (!hasUpdates) {
    throw error(400, 'No valid fields to update.')
  }

  return json({ message: 'Updated successfully' })
}

