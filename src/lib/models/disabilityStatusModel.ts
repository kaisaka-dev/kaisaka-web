import TableManager, { type tableRow } from '../types/manager.js';

type DisabilityStatusRow = tableRow<"disability_status">

/**
 * A model concerning about CRUD operations on the different disabilities statuses. 
 * 
 * Made for the `disability_status` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class DisabilityStatusModel extends TableManager<"disability_status">('disability_status') {
  public static instance: DisabilityStatusModel = new DisabilityStatusModel();
  
  /**
   * Creates disability status record using existing child
   * @param child_id the unique id of the child 
   * @param disability_id the unique id of the disability
   * @param disability_nature description about the disability's nature
   * @returns created disability status record
   */
  async insertDisabilityStatus(child_id: string, disability_id: number | null, disability_nature: string | null): Promise<DisabilityStatusRow | null>{
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
  
  /**
   * Finds a disability status record given its unique id
   * @param id the unique id of the disability status record in the DB
   * @returns disability status record corresponding to id or null
   */
  async findById(id: number): Promise<DisabilityStatusRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds disability status records of a specific child
   * @param child_id the unique id of the child 
   * @returns array of disability status records with same child_id or null
   */
  async findByChildId(child_id: string): Promise<DisabilityStatusRow[] | null>{
    return this.findMany({ child_id: child_id })
  }

  /**
   * Finds disability status records of a specific disability
   * @param disability_id the unique id of the disability
   * @returns array of disability status records with same disability_id or null
   */
  async findByDisabilityId(disability_id: number): Promise<DisabilityStatusRow[] | null>{
    return this.findMany({ disability_id: disability_id })
  }
  
  /**
   * Updates the disability nature of a disability status record
   * @param id the unique id of the disability status record in the DB 
   * @param nature the updated disability nature value to be applied
   * @returns boolean if update is successful or not
   */
  async updateDisabilityNature(id: number, nature: string): Promise<boolean>{
    const now = new Date().toISOString()
    const reference: Partial<DisabilityStatusRow> = { id: id }
    const updates: Partial<DisabilityStatusRow> = { disability_nature: nature, last_updated: now }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes a disability status record given its id
   * @param id the unique id of the disability status record in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes a disability status record of a specific child
   * @param child_id the unique id of the child  
   * @returns boolean if delete is successful or not
   */
  async deleteByChildId(child_id: string): Promise<boolean>{
    const result = await this.deleteOne({ child_id: child_id });
    return result !== null;
  }
}