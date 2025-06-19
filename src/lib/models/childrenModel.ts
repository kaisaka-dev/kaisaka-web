import TableManager, { type tableRow } from '../types/manager.js';


type ChildrenRow = tableRow<"children">

export class ChildrenModel extends TableManager<"children">('children') {
  public static instance: ChildrenModel = new ChildrenModel();

  async insertChild (has_barangay_cert: boolean, has_birth_cert: boolean, has_medical_cert: boolean, 
                     has_philhealth: boolean, is_active: boolean, member_id: string, philhealth_id: string | null, 
                     pwd_id: string | null, remarks: string | null ){
      const child: Partial<ChildrenRow> = { has_barangay_cert, has_birth_cert, has_medical_cert, 
                                            has_philhealth, is_active, member_id, philhealth_id, pwd_id, remarks}
      const data = await this.insertOne(child);
      return data
  }

  async findById(id: string){
    return this.findOne({ id: id })
  }

  async getAllChildren(){
    return this.findMany()
  }
  
  async updateBarangayCert(id: string, has_barangay_cert: boolean){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_barangay_cert: has_barangay_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateBirthCert(id: string, has_birth_cert: boolean){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_birth_cert: has_birth_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateMedCert(id: string, has_med_cert: boolean){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_medical_cert: has_med_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updatePhilHealthId(id: string, philhealth_id: string){
    const reference: Partial<ChildrenRow> = { id: id }

    const has_philhealth = philhealth_id ? true : false

    const updates: Partial<ChildrenRow> = { philhealth_id: philhealth_id, has_philhealth: has_philhealth}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateActiveStatus(id: string, is_active: boolean){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { is_active: is_active}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updatePwdId(id: string, pwd_id: string){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { pwd_id: pwd_id}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateRemarks(id: string, remarks: string){
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { remarks: remarks}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async deleteById(id: string){
    return this.deleteOne({ id: id })
  }
}