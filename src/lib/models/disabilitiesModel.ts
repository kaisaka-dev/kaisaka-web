import TableManager, { type tableRow } from '../types/manager.js';


type DisabilitiesRow = tableRow<"disabilities">

/**
 * A model concerning about CRUD operations on people who are disabled. 
 * 
 * Made for the `disabilities` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class DisabilitiesModel extends TableManager<"disabilities">('disabilities') {
  public static instance: DisabilitiesModel = new DisabilitiesModel();


  async insertDisability(name: string | null){
    const disability : Partial<DisabilitiesRow> = { name: name }
    const data = await this.insertOne(disability)
    
    return data
  }

  async findById(id: number){
    return this.findOne({ id: id })
  }

  async findByName(name: string){
    return this.findMany({ name: name })
  }

  async getAll(){
    return this.findMany()
  }

  async updateName(id: number, name: string){
    const reference: Partial<DisabilitiesRow> = { id: id }
    const updates: Partial<DisabilitiesRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

}