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

    async recordIntervention(intervention: InterventionRow){
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

    async findById(id: string){
        return this.findOne({ id: id });
    }

    async findByChild(child_id: string){
        return this.findMany({ child_id: child_id });
    }

    async findByStatus(status: status_enum){
        return this.findMany({ status: status });
    }

    async updateRecord(id: string, intervention: InterventionRow){
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

    async deleteById(id: string){
        return this.deleteOne({ id: id }) !== null;
    }
}