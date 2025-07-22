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
   * @returns created address record or null
   */
  async insertAddress(address: string): Promise<AddressesRow | null>{
    const new_address : Partial<AddressesRow> = { address }
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
   * Gets all addresses
   * @returns array of all address records or null
   */
  async getAll(): Promise<AddressesRow[] | null>{
    return this.findMany({})
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
   * Checks if an address with the given id exists
   * @param id the id to check for
   * @returns boolean indicating whether the address exists
   */
  async existsById(id: string): Promise<boolean>{
    const result = await this.findById(id);
    return result !== null;
  }

  /**
   * Deletes an address record given its id
   * @param id the unique id of the address in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: string): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }
}