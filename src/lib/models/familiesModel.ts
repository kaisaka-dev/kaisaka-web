import TableManager, { type tableRow } from '../types/manager.js';


type FamiliesRow = tableRow<"families">

/**
 * A model concerning about CRUD operations on *families information*. 
 * 
 * Made for the `cities` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class FamiliesModel extends TableManager<"families">('families') {
  public static instance: FamiliesModel = new FamiliesModel();
    async createFamily(){
        const now = new Date().toISOString();
        const data = await this.insertOne({ date_created: now });

        return data
    }

    async findById(id: string){
        return this.findOne({ id: id })
    }

    async getAll(filter: Partial<FamiliesRow> = {}){
        return this.findMany(filter)
    }

    async deleteById(id: string){
        return this.deleteOne({ id: id }) !== null;
    }
}