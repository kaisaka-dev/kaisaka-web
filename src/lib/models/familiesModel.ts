import TableManager, { type tableRow } from '../types/manager.js';


type FamiliesRow = tableRow<"families">

/**
 * A model concerning about CRUD operations on *families information*. 
 * 
 * Made for the `families` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class FamiliesModel extends TableManager<"families">('families') {
  public static instance: FamiliesModel = new FamiliesModel();

    /**
     * Generates a new family
     * @returns the created family record
     */
    async createFamily(): Promise<FamiliesRow | null>{
        const now = new Date().toISOString();
        const data = await this.insertOne({ date_created: now });

        return data
    }

    /**
     * Find family by its id
     * @param id the unique id of the family in the DB
     * @returns the family record corresponding the ID
     */
    async findById(id: string): Promise<FamiliesRow | null>{
        return this.findOne({ id: id })
    }

    /**
     * Gets all families with a specific
     * @returns array of families or null
     */
    async getAll(): Promise<FamiliesRow[] | null>{
        return this.findMany()
    }

    /**
     * Deletes family record using its id
     * @param id the unique id of the family in the DB
     * @returns boolean if family is successfully deleted or not
     */
    async deleteById(id: string){
    const result = await this.deleteOne({ id });
    return result !== null;
    }

    
    /**
     * gets Surnames
     * @param id the unique id of the family in the DB
     * @returns all surnames of yes
     */
    async getSurname(id: string = ''){
        const joinStatement = `id,
            family_members!inner(
                family_id,
                is_child,
                members!inner(
                    last_name
                )
            ),
            membership_annual_renewal(
                updated_at
            )
        `
        return this.findWithJoin(joinStatement, {eq: {id: id}})
    }

    /**
     * Gets complete family data including surnames, caregivers, children, and membership info
     * @param id the unique id of the family in the DB (optional - if not provided, gets all families)
     * @returns families with complete information
     */
    async getFamilyData(id: string = ''){
        const joinStatement = `
            id,
            family_members(
                family_id,
                is_child,
                members(
                    id,
                    first_name,
                    last_name
                )
            ),
            membership_annual_renewal(
                updated_at
            )
        `
        return this.findWithJoin(joinStatement, id ? {eq: {id: id}} : {})
    }
}