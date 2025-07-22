import TableManager, { type tableRow } from '../types/manager.js';

type BarangayRow = tableRow<"barangays">

/**
 * A model concerning about CRUD operations on *barangay*. 
 * 
 * Made for the `barangays` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class BarangayModel extends TableManager<"barangays">('barangays') {
  public static instance: BarangayModel = new BarangayModel();

  /**
   * Finds a barangay by name
   * @param name name of Barangay
   * @returns array of barangays with matching name or null
   */
  async findByName(name: string): Promise<BarangayRow[] | null> {
    return this.findMany({ name })
  }

  /**
   * Finds barangays by city ID
   * @param city_id ID of the city
   * @returns array of barangays in the specified city or null
   */
  async findByCityId(city_id: number): Promise<BarangayRow[] | null> {
    return this.findMany({ city_id })
  }

  /**
   * Finds a barangay by its barangay number
   * @param num number of barangay
   * @returns array of barangays with matching number or null
   */
  async findByNum(num: string): Promise<BarangayRow[] | null> {
    return this.findMany({ num })
  }

  /**
   * Finds a barangay by its ID
   * @param id unique ID of the barangay
   * @returns barangay record or null
   */
  async findById(id: number): Promise<BarangayRow | null> {
    return this.findOne({ id })
  }

  /**
   * Insert a barangay to supabase
   * @param name - the name of the barangay
   * @param city_id - optional, the ID of the city it belongs to
   * @param num - optional, the barangay number
   * @returns the created barangay record or null
   */
  async insertBarangay(name: string, city_id?: number, num?: string): Promise<BarangayRow | null> {
    const barangay: Partial<BarangayRow> = {
      name,
      city_id: city_id !== undefined ? city_id : null,
      num: num !== undefined ? num : null
    }
    const data = await this.insertOne(barangay);
      
    return data 
  }

  /**
   * Update name of the barangay
   * @param brgy_id - the id number
   * @param name - the name to be updated
   * @returns boolean if updated or not
   */
  async updateName(brgy_id: number, name: string): Promise<boolean> {
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update city of the barangay
   * @param brgy_id - the id number
   * @param city_id - the city id to be updated (number, not string)
   * @returns boolean if updated or not
   */
  async updateCityId(brgy_id: number, city_id: number): Promise<boolean> {
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { city_id: city_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /** 
   * Update assigned brgy number of the barangay 
   * @param brgy_id - the id number
   * @param num - the assigned brgy number of the barangay
   * @returns boolean if updated or not
   */
  async updateNum(brgy_id: number, num: string): Promise<boolean> {
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const updates: Partial<BarangayRow> = { num: num }
    const data = await this.updateOne(reference, updates)

    return data
  }
  
  /**
   * Deletes a barangay
   * @param brgy_id - the id number
   * @returns the deleted barangay record or null
   */
  async deleteBarangay(brgy_id: number): Promise<boolean> {
    const reference: Partial<BarangayRow> = { id: brgy_id }
    const data = await this.deleteOne(reference)

    return data !== null;
  }

  /**
   * Gets all barangays with optional filters
   * @param filter optional filter to apply
   * @returns array of all barangays matching the filter or null
   */
  async getAll(filter?: Partial<BarangayRow>): Promise<BarangayRow[] | null> {
    return this.findMany(filter)
  }

  /**
   * Gets all members in a specific barangay
   * @param barangay_id the barangay ID
   * @returns array of members in this barangay
   */
  async getMembersInBarangay(barangay_id: number): Promise<any[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('barangays')
        .select(`
          *,
          members (
            id,
            first_name,
            last_name,
            middle_name,
            sex,
            birthday,
            admission_date
          )
        `)
        .eq('id', barangay_id)
        .single();

      if (error) {
        console.error('Error fetching members in barangay:', error);
        return null;
      }

      return data?.members || [];
    } catch (err) {
      console.error('Database query error:', err);
      return null;
    }
  }
}