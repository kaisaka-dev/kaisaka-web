import TableManager, { type tableRow } from '../types/manager.js';


type AddressesRow = tableRow<"addresses">

export class AddressesModel extends TableManager<"addresses">('addresses') {
  public static instance: AddressesModel = new AddressesModel();

  async insertAddress(address: string, barangay_id: number, id: string, street_id: number){
    const new_address : Partial<AddressesRow> = { address, barangay_id, id, street_id }
    const data  = await this.insertOne(new_address)

    return data
  }
  async findById(id: string){
    return this.findOne({ id: id })
  }

  async findByAddress(address: string){
    return this.findMany({ address: address })
  }

  async findByBarangayId(barangay_id: number){
    return this.findMany({ barangay_id: barangay_id })
  }

  async findByStreetId(street_id: number){
    return this.findMany({ street_id: street_id })
  }

  async updateAddress(id: string, address: string){
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { address: address }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateBarangayId(id: string, barangay_id: number){
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { barangay_id: barangay_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async updateStreetId(id: string, street_id: number){
    const reference: Partial<AddressesRow> = { id: id }
    const updates: Partial<AddressesRow> = { street_id: street_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  async deleteById(id: string){
    return this.deleteOne({ id: id }) !== null;
  }
}