import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *addresses*. 
 * 
 * Made for the `addresses` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type AddressesRow = tableRow<"addresses">

export class AddressesModel extends TableManager<"addresses">('addresses') {
  public static instance: AddressesModel = new AddressesModel();

  /**
   * Inserts a new address
   * @param address full address name
   * @param barangay_id id of barangay of address
   * @param street_id street of the address
   * @returns created address record or null
   */
  async insertAddress(address: string, barangay_id: number, street_id: number): Promise<AddressesRow | null>{
    const new_address : Partial<AddressesRow> = { address, barangay_id, street_id }
    const data  = await this.insertOne(new_address)

    return data
  }

  /**
   * Finds an address by its unique id
   * @param id the unique id of the address
   * @returns the address instance with said unique id
   */
  async findById(id: string): Promise<AddressesRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds addresses by its address name
   * @param address full address name
   * @returns array of addresses with the given address name
   */
  async findByAddress(address: string): Promise<AddressesRow[] | null>{
    return this.findMany({ address: address })
  }

  /**
   * Finds addresses within a specific barangay
   * @param barangay_id the unique id of the barangay in the DB
   * @returns an array of addresses within the given barangay
   */
  async findByBarangayId(barangay_id: number): Promise<AddressesRow[] | null>{
    return this.findMany({ barangay_id: barangay_id })
  }

  /**
   * Find addresses within a specific street
   * @param street_id the unique id of the street in the DB
   * @returns an array of addresses within the given street
   */
  async findByStreetId(street_id: number){
    return this.findMany({ street_id: street_id })
  }


  /**
   * Update address record's address
   * @param id the unique id of the address in the DB
   * @param address the updated address to be applied
   * @returns boolean if update is successful or not
   */
  async updateAddress(id: string, address: string): Promise<boolean>{
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { address: address }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update address record's barangay
   * @param id the unique id of the address in the DB
   * @param barangay_id the unique id of the barangay in the DB
   * @returns boolean if update is successful or not
   */
  async updateBarangayId(id: string, barangay_id: number): Promise<boolean>{
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { barangay_id: barangay_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update address record's street
   * @param id the unique id of the address in the DB
   * @param street_id the unique id of the street in the DB
   * @returns boolean if update is successful or not
   */
  async updateStreetId(id: string, street_id: number): Promise<boolean>{
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { street_id: street_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes an address record given its id
   * @param id the unique id of the address in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: string): Promise<boolean>{
    return this.deleteOne({ id: id }) !== null;
  }
}