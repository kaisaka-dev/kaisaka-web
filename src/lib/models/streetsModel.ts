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
   * @param barangay_id the barangay id of where the street is located
   * @param street the name of the street
   * @returns the created street
   */
  async insertStreet(barangay_id: number | null, street: string): Promise<StreetsRow | null>{
      const newStreet : Partial<StreetsRow> = { barangay_id: barangay_id, street: street }
      const data  = await this.insertOne(newStreet)

      return data
    }
  
  /**
   * Find street data given an id number
   * @param id the unique id of the street in the DB
   * @returns the street record corresponding the id
   */
  async findById(id: number): Promise<StreetsRow | null>{
    return this.findOne({ id:id })
  }
  
  /**
   * Find street data given its street name
   * @param street the street name
   * @returns an array of streets with the same street name or null
   */
  async findByStreet(street: string): Promise<StreetsRow[] | null>{
    return this.findMany({ street: street })
  }

  /**
   * Finds all streets in a specific barangay
   * @param barangay_id the barangay id of where the street is located
   * @returns an array of streets with the same barangay or null
   */
  async findByBarangayId(barangay_id: number): Promise<StreetsRow[] | null>{
    return this.findMany({ barangay_id: barangay_id })
  }

  /**
   * Updates a street's street name
   * @param id the unique id of the street in the DB
   * @param street the street name
   * @returns the result of updating the existing street record
   */
  async updateStreet(id: number, street: string): Promise<boolean>{
    const reference: Partial<StreetsRow> = { id: id }
    const updates: Partial<StreetsRow> = { street: street}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates a street's barangay
   * @param id the unique id of the street in the DB
   * @param barangay_id the barangay id of where the street is located
   * @returns the result of updating the existing street record
   */
  async updateBarangay(id: number, barangay_id: number): Promise<boolean>{
    const reference: Partial<StreetsRow> = { id: id }
    const updates: Partial<StreetsRow> = { barangay_id: barangay_id }
    const data = await this.updateOne(reference, updates)

    return data
  }
}