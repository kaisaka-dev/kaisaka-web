import TableManager, { type tableRow } from '../types/manager.js';


type ServiceCategoriesRow = tableRow<"service_categories">

/**
 * A model concerning about CRUD operations on service categories available for intervention. 
 * 
 * Made for the `intervention` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class ServiceCategoriesModel extends TableManager<"service_categories">('service_categories') {
  public static instance: ServiceCategoriesModel = new ServiceCategoriesModel();
  
  /**
   * Insert service category data in the DB
   * @param name name of service category
   * @returns the created service category
   */
  async insertServiceCategory(name: string): Promise<ServiceCategoriesRow | null>{
    const service_category : Partial<ServiceCategoriesRow> = { name: name }
    const data  = await this.insertOne(service_category)

    return data
  }

  /**
   * Gets all services given a filter.
   * @param filter filter to be applied to the query
   * @returns an array of all service categories corresponding to the filters or null
   */
  async getAll(filter: Partial<ServiceCategoriesRow> = {}): Promise<ServiceCategoriesRow[] | null>{
    return this.findMany(filter)
  }

  /**
   * Find service category data given an id number
   * @param id the unique id of the service category in the DB
   * @returns the service category corresponding the id
   */
  async findById(id: number): Promise<ServiceCategoriesRow | null>{
    return this.findOne({ id:id })
  }

  /**
   * Find service category data given a name
   * @param name the name of the service category
   * @returns an array of service categories with the same name or null
   */
  async findByName(name: string): Promise<ServiceCategoriesRow[] | null>{
    return this.findMany({ name: name })
  }

  /**
   * Updates service category name
   * @param id the unique id of the service category in the DB
   * @param name the new name of service category to be applied
   * @returns the result of updating the existing service category record
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<ServiceCategoriesRow> = { id: id }
    const updates: Partial<ServiceCategoriesRow> = { name: name}
    const data = await this.updateOne(reference, updates)

    return data
  }
}