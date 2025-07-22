import TableManager, { type QueryConfigurationBuilder, type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type status_enum = Database['public']['Enums']['improvement_status_enum'];
type InterventionRow = tableRow<"intervention">
/**
 * A model concerning about CRUD operations on *intervention information*. 
 * 
 * Made for the `intervention` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class InterventionModel extends TableManager<"intervention">('intervention') {
    public static instance: InterventionModel = new InterventionModel();

    /**
     * Insert intervention data in the DB
     * @param child_id the unique id of the child to apply intervention
     * @param intervention the name of the intervention
     * @param remarks additional remarks of the intervention
     * @param service_category_id unique id of service category this belongs to
     * @param status the status of the result of the intervention
     * @returns the created intervention record
     */
    async insertIntervention(
        child_id: string, 
        intervention: string, 
        remarks: string | null, 
        service_category_id: number, 
        status: status_enum
    ): Promise<InterventionRow | null>{
        const now = new Date().toISOString();
        const new_intervention : Partial<InterventionRow> = { 
            child_id: child_id, 
            date_created: now, 
            intervention: intervention, 
            updated_at: now, 
            remarks: remarks, 
            service_category_id: service_category_id, 
            status: status
        }
        const data = await this.insertOne(new_intervention)

        return data
    }

    /**
     * Find intervention data given an id number
     * @param id the unique id of the intervention in the DB
     * @returns the intervention record corresponding the id
     */
    async findById(id: string): Promise<InterventionRow | null>{
        return this.findOne({ id: id });
    }

    /**
     * Finds intervention records of a specific child
     * @param child_id the unique id of the child
     * @returns array of interventions with same child id or null
     */
    async findByChild(child_id: string): Promise<InterventionRow[] | null>{
        return this.findMany({ child_id: child_id });
    }

    /**
     * Find intervention records in a specific service category
     * @param service_category_id the unique id of service category
     * @returns array of interventions within a service category or null
     */
    async findByServiceCategoryId(service_category_id: number): Promise<InterventionRow[] | null>{
        return this.findMany({ service_category_id: service_category_id })
    }

    /**
     * Find intervention records with a specific status
     * @param status the status of the interventions to find
     * @returns an array of interventions with given status or null
     */
    async findByStatus(status: status_enum): Promise<InterventionRow[] | null>{
        return this.findMany({ status: status });
    }

    /**
     * Updates an intervention's remarks
     * @param id the unique id of the intervention in the DB
     * @param remarks updated remarks of the intervention to be applied
     * @returns boolean if the update was successful
     */
    async updateRemarks(id: string, remarks: string): Promise<boolean>{
        const now = new Date().toISOString();
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { remarks: remarks, updated_at: now }
        const data = await this.updateOne(reference, updates)

        return data
    }

    /**
     * Updates an intervention's status
     * @param id the unique id of the intervention in the DB
     * @param status updated status of intervention to be applied
     * @returns boolean if the update was successful
     */
    async updateStatus(id: string, status: status_enum): Promise<boolean>{
        const now = new Date().toISOString();
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { status: status, updated_at: now }
        const data = await this.updateOne(reference, updates)

        return data
    }

    /**
     * Deletes an intervention with given ID
     * @param id the unique id of the intervention in the DB
     * @returns boolean if the update was successful
     */
    async deleteById(id: string): Promise<boolean>{
        const result = await this.deleteOne({ id });
        return result !== null;
    }

    async getMultipleJoin(select: string, filters: Record<string, string | number>): Promise<InterventionRow[] | null> {
        return await this.findWithJoin(select, filters );
    }
    async findByJoin_InTheProgramReport(config: QueryConfigurationBuilder) {
        const joinStatement =`*, children!inner(id, birthday, members(first_name, last_name, sex), disability_category(name))`;

        return this.findWithJoinAndCount(joinStatement, config)
    }
}