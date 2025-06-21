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

  async insertCity(city_name: string){
    const city : Partial<CitiesRow> = { city_name: city_name }
    const data  = await this.insertOne(city)

    return data
  }

  async getAll(filter: Partial<CitiesRow> = {}){
    return this.findMany(filter)
  }

  async findById(id: number){
    return this.findOne({ id:id })
  }
  async findByName(name: string){
    return this.findMany({ city_name: name })
  }

  async updateName(id: number, name: string){
    const reference: Partial<CitiesRow> = { id: id }
    const updates: Partial<CitiesRow> = { city_name: name}
    const data = await this.updateOne(reference, updates)

    return data
  }
}