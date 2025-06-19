import TableManager, { type tableRow } from '../types/manager.js';

type DisabilityStatusRow = tableRow<"disability_status">

export class DisabilityStatusModel extends TableManager<"disability_status">('disability_status') {
  public static instance: DisabilityStatusModel = new DisabilityStatusModel();
  
  async insertDisabilityStatus(child_id: string, disability_id: number, disability_nature: string){
    const now = new Date().toISOString() //to set "date created" to today's date
    const disability_status : Partial<DisabilityStatusRow> = { 
      child_id: child_id, 
      date_created: now,
      disability_id: disability_id,
      disability_nature: disability_nature,
      last_updated: now
    }
    const data = await this.insertOne(disability_status)
  
    return data
  }
  
  async findById(id: number){
    return this.findOne({ id: id })
  }

  async updateDisabilityNature(id: number, nature: string){
    const now = new Date().toISOString()
    const reference: Partial<DisabilityStatusRow> = { id: id }
    const updates: Partial<DisabilityStatusRow> = { disability_nature: nature, last_updated: now }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async deleteById(id: number){
    return this.deleteOne({ id: id })
  }
}