import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type status_enum = Database['public']['Enums']['improvement_status_enum'];
type type_enum = Database['public']['Enums']['intervention_type'];
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

    async insertIntervention(child_id: string, intervention: string, remarks: string | null, service_category_id: number, status: status_enum, type: type_enum){
        const now = new Date().toISOString();
        const new_intervention : Partial<InterventionRow> = { child_id: child_id, date_created: now, intervention: intervention, last_updated: now, remarks: remarks, service_category_id: service_category_id, status: status, type: type }
        const data = await this.insertOne(new_intervention)

        return data
    }

    async findById(id: string){
        return this.findOne({ id: id });
    }

    async findByChild(child_id: string){
        return this.findMany({ child_id: child_id });
    }

    async findByServiceCategoryId(service_category_id: number){
        return this.findMany({ service_category_id: service_category_id })
    }

    async findByStatus(status: status_enum){
        return this.findMany({ status: status });
    }

    async findByInterventionType(intervention_type: type_enum){
        return this.findMany({ type: intervention_type });
    }

    async updateRemarks(id: string, remarks: string){
        const now = new Date().toISOString();
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { remarks: remarks, last_updated: now }
        const data = await this.updateOne(reference, updates)

        return data
    }

    async updateStatus(id: string, status: status_enum){
        const now = new Date().toISOString();
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { status: status, last_updated: now }
        const data = await this.updateOne(reference, updates)

        return data
    }
    
    async updateInterventionType(id: string, intervention_type: type_enum){
        const now = new Date().toISOString();
        const reference: Partial<InterventionRow> = { id: id }
        const updates: Partial<InterventionRow> = { type: intervention_type, last_updated: now }
        const data = await this.updateOne(reference, updates)

        return data
    }

    async deleteById(id: string){
        return this.deleteOne({ id: id }) !== null;
    }
}