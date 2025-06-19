import TableManager, { type tableRow } from '../types/manager.js';


type StreetsRow = tableRow<"streets">

export class StreetsModel extends TableManager<"streets">('streets') {
  public static instance: StreetsModel = new StreetsModel();

  async insertStreet(barangay_id: number | null, street: string){
      const newStreet : Partial<StreetsRow> = { barangay_id: barangay_id, street: street }
      const data  = await this.insertOne(newStreet)

      return data
    }

  async findById(id: number){
    return this.findOne({ id:id })
  }
  async findByStreet(street: string){
    return this.findMany({ street: street })
  }

  async findByBarangayId(barangay_id: number){
    return this.findMany({ barangay_id: barangay_id })
  }

  async updateStreet(id: number, street: string){
    const reference: Partial<StreetsRow> = { id: id }
    const updates: Partial<StreetsRow> = { street: street}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateBarangay(id: number, barangay_id: number){
    const reference: Partial<StreetsRow> = { id: id }
    const updates: Partial<StreetsRow> = { barangay_id: barangay_id }
    const data = await this.updateOne(reference, updates)

    return data
  }
}