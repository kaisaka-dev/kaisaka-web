import TableManager, { type tableRow } from '../types/manager.js';


type CitiesRow = tableRow<"cities">

/**
 * A model concerning about CRUD operations on *city information*. 
 * 
 * Made for the `cities` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class CitiesModel extends TableManager<"cities">('cities') {
  public static instance: CitiesModel = new CitiesModel();

  /**
   * Inserts city data
   * @param city_name name of the city
   * @returns the created city data
   */
  async insertCity(city_name: string): Promise<CitiesRow | null>{
    const city : Partial<CitiesRow> = { city_name: city_name }
    const data  = await this.insertOne(city)

    return data
  }

  /**
   * Gets all cities with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns an array of all cities corresponding to the filters or null
   */
  async getAll(filter?: Partial<CitiesRow>): Promise<CitiesRow[] | null>{
    return this.findMany(filter)
  }

  /**
   * Finds city record with given id
   * @param id the unique id of city in the DB
   * @returns the city corresponding to the id
   */
  async findById(id: number): Promise<CitiesRow | null>{
    return this.findOne({ id:id })
  }

  /**
   * Finds city records with given name
   * @param name the name of the city 
   * @returns an array of all cities with the same name or null
   */
  async findByName(name: string): Promise<CitiesRow[] | null>{
    return this.findMany({ city_name: name })
  }

  /**
   * Updates city name
   * @param id the unique id of city in the DB 
   * @param name the updated name of the city to be applied
   * @returns boolean if update is successful or not
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<CitiesRow> = { id: id }
    const updates: Partial<CitiesRow> = { city_name: name}
    const data = await this.updateOne(reference, updates)

    return data
  }
}