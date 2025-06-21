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

  /**
   * Creates new disability record in the DB
   * @param name name of the disability
   * @returns the created disability record
   */
  async insertDisability(name: string | null): Promise<DisabilitiesRow | null>{
    const disability : Partial<DisabilitiesRow> = { name: name }
    const data = await this.insertOne(disability)
    
    return data
  }

  /**
   * Finds disability given its id
   * @param id the unique id of the disability in the DB
   * @returns the disability record corresponding the id
   */
  async findById(id: number): Promise<DisabilitiesRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds disabilities given its name
   * @param name name of disability
   * @returns array of disabilities or null
   */
  async findByName(name: string): Promise<DisabilitiesRow[] | null>{
    return this.findMany({ name: name })
  }

  /**
   * Gets all disability records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns an array of all disability records corresponding to the filters or null
   */
  async getAll(filter?: Partial<DisabilitiesRow>): Promise<DisabilitiesRow[] | null>{
    return this.findMany(filter)
  }

  /**
   * Updates disability name
   * @param id the unique id of the disability in the DB
   * @param name updated name of disability to be applied
   * @returns boolean if update was successful
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<DisabilitiesRow> = { id: id }
    const updates: Partial<DisabilitiesRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

}