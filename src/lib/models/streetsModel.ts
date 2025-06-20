import TableManager, { type tableRow } from '../types/manager.js';


type StreetsRow = tableRow<"streets">

/**
 * A model concerning about CRUD operations on street data. 
 * 
 * Made for the `streets` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class StreetsModel extends TableManager<"streets">('streets') {
  public static instance: StreetsModel = new StreetsModel();

  /**
   * Insert street data from an existing barangay
   * @param barangay_id 
   * @param street 
   * @returns {Promise<tableRow<"streets" > | null>} e
   */
  async insertStreet(barangay_id: number | null, street: string): Promise<tableRow<"streets" > | null>{
      const newStreet : Partial<StreetsRow> = { barangay_id: barangay_id, street: street }
      const data  = await this.insertOne(newStreet)

      return data
    }
  
  /**
   * Find street data given an id number
   * @param barangay_id 
   * @param street 
   * @returns Promise tablerow
   */
  async findById(id: number){
    return this.findOne({ id:id })
  }
  
  /**
   * Find street data given its street name
   * @param street 
   * @returns Promise
   */
  async findByStreet(street: string){
    return this.findMany({ street: street })
  }

  /**
   * 
   * @param barangay_id 
   * @returns 
   */
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