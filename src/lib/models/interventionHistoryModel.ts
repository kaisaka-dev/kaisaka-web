import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type status_enum = Database['public']['Enums']['improvement_status_enum'];
type InterventionHistoryRow = tableRow<"intervention_history">
type InterventionRow = tableRow<"intervention">

/**
 * A model concerning about CRUD operations on *intervention history information*. 
 * 
 * Made for the `intervention_history` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class InterventionHistoryModel extends TableManager<"intervention_history">('intervention_history') {
    public static instance: InterventionHistoryModel = new InterventionHistoryModel();

    /**
     * Records an intervention in the history
     * @param intervention the intervention instance to be recorded
     * @returns the newly recorded intervention
     */
    async recordIntervention(intervention: InterventionRow): Promise<InterventionHistoryRow | null>{
        const now = new Date().toISOString();
        const new_intervention : Partial<InterventionHistoryRow> = { 
            child_id: intervention.child_id,
            created_at: now,
            intervention_id: intervention.id,
            intervention_created_at: intervention.date_created,
            intervention_modified_at: intervention.last_updated,
            intervention_text: intervention.intervention, //also not sure what this is
            remarks: intervention.remarks, //? not sure if this is different or same as intervention remarks. 
            status: intervention.status
        }
        const data = await this.insertOne(new_intervention)

        return data
    }

    /**
     * Find intervention history data given an id number
     * @param id the unique id of the intervention history record in the DB
     * @returns the intervention history record corresponding the id
     */
    async findById(id: string): Promise<InterventionHistoryRow | null>{
        return this.findOne({ id: id });
    }

    /**
     * Finds intervention history records of a specific child
     * @param child_id the unique id of the child
     * @returns array of intervention history records with same child id or null
     */
    async findByChild(child_id: string): Promise<InterventionHistoryRow[] | null>{
        return this.findMany({ child_id: child_id });
    }

    /**
     * 
     * @param status 
     * @returns 
     */
    async findByStatus(status: status_enum): Promise<InterventionHistoryRow[] | null>{
        return this.findMany({ status: status });
    }

    /**
     * Find intervention history records with a specific status
     * @param status the status of the interventions to find
     * @returns an array of intervention history records with given status or null
     */
    async updateRecord(id: string, intervention: InterventionRow): Promise<boolean>{
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { 
            child_id: intervention.child_id,
            intervention_id: intervention.id,
            intervention_created_at: intervention.date_created,
            intervention_modified_at: intervention.last_updated,
            intervention_text: intervention.intervention, //also not sure what this is
            remarks: intervention.remarks, //? not sure if this is different or same as intervention remarks. 
            status: intervention.status
         }
        const data = await this.updateOne(reference, updates)

        return data
    }

    /**
     * Deletes an intervention in the history with given ID
     * @param id the unique id of the intervention history record in the DB
     * @returns boolean if the update was successful
     */
    async deleteById(id: string): Promise<boolean>{
    const result = await this.deleteOne({ id });
    return result !== null;
    }
}