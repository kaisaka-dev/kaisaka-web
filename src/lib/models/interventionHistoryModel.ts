import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type status_enum = Database['public']['Enums']['improvement_status_enum'];
type InterventionHistoryRow = tableRow<"intervention_history">

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
     * Records an intervention history entry
     * @param intervention_id the intervention id to record history for
     * @param improvement the improvement description
     * @param status the improvement status
     * @param remarks optional remarks
     * @param date_checked optional date checked (defaults to now)
     * @returns the newly recorded intervention history
     */
    async recordInterventionHistory(
        intervention_id: string, 
        improvement: string,
        status: status_enum,
        remarks?: string | null,
        date_checked?: string
    ): Promise<InterventionHistoryRow | null>{
        const now = new Date().toISOString();
        const history_entry : Partial<InterventionHistoryRow> = { 
            intervention_id: intervention_id,
            improvement: improvement,
            status: status,
            remarks: remarks || null,
            date_checked: date_checked || now
        }
        const data = await this.insertOne(history_entry)

        return data
    }

    /**
     * Find intervention history data given an id
     * @param id the unique id of the intervention history record in the DB
     * @returns the intervention history record corresponding the id
     */
    async findById(id: string): Promise<InterventionHistoryRow | null>{
        return this.findOne({ id: id });
    }

    /**
     * Finds intervention history records for a specific intervention
     * @param intervention_id the unique id of the intervention
     * @returns array of intervention history records or null
     */
    async findByInterventionId(intervention_id: string): Promise<InterventionHistoryRow[] | null>{
        return this.findMany({ intervention_id: intervention_id });
    }

    /**
     * Find intervention history records with a specific status
     * @param status the status of the interventions to find
     * @returns an array of intervention history records with given status or null
     */
    async findByStatus(status: status_enum): Promise<InterventionHistoryRow[] | null>{
        return this.findMany({ status: status });
    }

    /**
     * Updates an intervention history record
     * @param id the unique id of the history record
     * @param updates the fields to update
     * @returns boolean if update was successful
     */
    async updateHistoryRecord(
        id: string, 
        updates: Partial<Pick<InterventionHistoryRow, 'improvement' | 'status' | 'remarks' | 'date_checked'>>
    ): Promise<boolean>{
        const reference: Partial<InterventionHistoryRow> = { id: id }
        const data = await this.updateOne(reference, updates)

        return data
    }

    /**
     * Deletes an intervention history record
     * @param id the unique id of the intervention history record in the DB
     * @returns boolean if the delete was successful
     */
    async deleteById(id: string): Promise<boolean>{
        const result = await this.deleteOne({ id });
        return result !== null;
    }

    async getMultipleJoin(select: string, filters: Record<string, string | number>): Promise<InterventionHistoryRow[] | null> {
        return await this.findWithJoin(select, filters );
    }
}
