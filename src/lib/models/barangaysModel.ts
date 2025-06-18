import TableManager, { type tableRow } from '../types/manager.js';


type BarangayRow = tableRow<"barangays">

/**
 * A model concerning about barangay API. 
 * 
 * Refer to `src/lib/models/db.md` about what is exactly is a model.
 */
export class BarangayModel extends TableManager<"barangays">('barangays') {
  public static instance: BarangayModel = new BarangayModel();

  /**
   * Finds a barangay by name
   * @param name name of Barangay
   * @returns 
   */
  async findByName(name: string): Promise<BarangayRow[] | null> {
    return this.findMany({ name })
  }

  /**
   * Finds a barangay by city
   * @param city name of City
   * @returns 
   */
  async findByCity(city: string): Promise<BarangayRow[] | null> {
    return this.findMany({ city })
  }

  /**
   * Finds a barangay by its barangay number
   * @param num number of barangay
   * @returns 
   */
  async findByNum(num: string): Promise<BarangayRow[] | null> {
    return this.findMany({ num })
  }

  /**
   * Insert a barangay to supabase
   * @param id - the id number
   * @param name - the name of the barangay
   * @param city - the name of city its in
   * @param num - optional, the barangay number
   * @returns none
   */
  async insertBarangay(name: string, city: string, num: string) {
    const barangay: Partial<BarangayRow> = {name, city, num}
    const data = await this.insertOne(barangay);
      
    return data 
  }

  async updateName(brgy_id: number, name: string){
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateCity(brgy_id: number, city_id: string){
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { city: city_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateNum(brgy_id: number, num: string){
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { num: num }
    const data = await this.updateOne(reference, updates)

    return data
  }
}