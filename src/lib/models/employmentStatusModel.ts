import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type employment_type_enum = Database['public']['Enums']['employment_type_enum'];
type EmploymentStatusRow = tableRow<"employment_status">

/**
 * A model concerning about CRUD operations on current employmed members. 
 * 
 * Made for the `employment` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class EmploymentStatusModel extends TableManager<"employment_status">('employment_status') {
  public static instance: EmploymentStatusModel = new EmploymentStatusModel();
  async insertEmploymentStatus(able_to_work: boolean, employment_type: employment_type_enum | null, member_id: string){
    const finalEmploymentType = able_to_work ? employment_type : null; //prevents having employment type if able_to_work is false
    
    const employment_status : Partial<EmploymentStatusRow> = { able_to_work: able_to_work, employment_type: finalEmploymentType, member_id: member_id }
    const data = await this.insertOne(employment_status)

    return data
  }

  async findById(id: number){
    return this.findOne({ id: id })
  }

  async findByMemberId(member_id: string){
    return this.findOne({ member_id: member_id })
  }

  async updateEmploymentStatus(id: number, able_to_work: boolean, employment_type: employment_type_enum | null){
    const finalEmploymentType = able_to_work ? employment_type : null; //prevents having employment type if able_to_work is false
    
    const reference: Partial<EmploymentStatusRow> = { id: id }
    const updates: Partial<EmploymentStatusRow> = { able_to_work : able_to_work, employment_type: finalEmploymentType}
    const data = await this.updateOne(reference, updates)

    return data
  }

  async deleteById(id: number){
    return this.deleteOne({ id: id }) !== null;
  }

  async deleteByMemberId(member_id: string){
    return this.deleteOne({ member_id: member_id }) !== null;
  }
}