import TableManager, { type tableRow } from '../types/manager.js';


type BarangayRow = tableRow<"barangays">

export class BarangayModel extends TableManager<"barangays">('barangays') {
  public static instance: BarangayModel = new BarangayModel();

  async findByName(name: string): Promise<BarangayRow[] | null> {
    return this.findMany({ name })
  }

  async findByCity(city: string): Promise<BarangayRow[] | null> {
    return this.findMany({ city })
  }

  async findByNum(num: string): Promise<BarangayRow[] | null> {
    return this.findMany({ num })
  }

  async insertBarangay(id: number, name: string, city: string, num: string) {
    const barangay: Partial<BarangayRow> = {id, name, city, num}
    let data = await this.insertOne(barangay);
    console.log(data)
    return data 
  }
}