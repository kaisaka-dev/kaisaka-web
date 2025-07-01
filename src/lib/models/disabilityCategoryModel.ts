import TableManager, { type tableRow } from '../types/manager.js';

type DisabilityCategoryRow = tableRow<"disability_category">

/**
 * A model concerning about CRUD operations on disability categories. 
 * 
 * Made for the `disability_category` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class DisabilityCategoryModel extends TableManager<"disability_category">('disability_category') {
  public static instance: DisabilityCategoryModel = new DisabilityCategoryModel();

  /**
   * Creates new disability category record in the DB
   * @param name name of the disability category
   * @returns the created disability category record
   */
  async insertDisabilityCategory(name: string | null): Promise<DisabilityCategoryRow | null>{
    const disability_category : Partial<DisabilityCategoryRow> = { name: name }
    const data = await this.insertOne(disability_category)
    
    return data
  }

  /**
   * Finds disability category given its id
   * @param id the unique id of the disability category in the DB
   * @returns the disability category record corresponding the id
   */
  async findById(id: number): Promise<DisabilityCategoryRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds disability categories given its name
   * @param name name of disability category
   * @returns array of disability categories or null
   */
  async findByName(name: string): Promise<DisabilityCategoryRow[] | null>{
    return this.findMany({ name: name })
  }

  /**
   * Gets all disability category records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns an array of all disability category records corresponding to the filters or null
   */
  async getAll(filter?: Partial<DisabilityCategoryRow>): Promise<DisabilityCategoryRow[] | null>{
    return this.findMany(filter)
  }

  /**
   * Updates disability category name
   * @param id the unique id of the disability category in the DB
   * @param name updated name of disability category to be applied
   * @returns boolean if update was successful
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<DisabilityCategoryRow> = { id: id }
    const updates: Partial<DisabilityCategoryRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }
}