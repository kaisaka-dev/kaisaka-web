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
  
  /**
   * Creates an employment status record of an existing member
   * @param able_to_work indicates whether or not member is able to work
   * @param employment_type the employment type of the member
   * @param member_id unique id of the member in the DB
   * @returns created employment status record
   */
  async insertEmploymentStatus(able_to_work: boolean, employment_type: employment_type_enum | null, member_id: string): Promise<EmploymentStatusRow | null>{
    const finalEmploymentType = able_to_work ? employment_type : null; //prevents having employment type if able_to_work is false
    
    const employment_status : Partial<EmploymentStatusRow> = { able_to_work: able_to_work, employment_type: finalEmploymentType, member_id: member_id }
    const data = await this.insertOne(employment_status)

    return data
  }

  /**
   * Finds employment status record given its id
   * @param id unique id of the employment status record in the DB
   * @returns employment status record corresponding the id
   */
  async findById(id: number): Promise<EmploymentStatusRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds employment status record given the member's id
   * @param member_id unique id of the member in the DB
   * @returns employment status record of the given member
   */
  async findByMemberId(member_id: string): Promise<EmploymentStatusRow | null>{
    return this.findOne({ member_id: member_id })
  }

  /**
   * Updates employment status record given an id
   * @param id unique id of the employment status record in the DB
   * @param able_to_work the update able_to_work value to apply 
   * @param employment_type the update employment type to apply
   * @returns boolean if updated successfully
   */
  async updateEmploymentStatus(id: number, able_to_work: boolean, employment_type: employment_type_enum | null): Promise<boolean>{
    const finalEmploymentType = able_to_work ? employment_type : null; //prevents having employment type if able_to_work is false
    
    const reference: Partial<EmploymentStatusRow> = { id: id }
    const updates: Partial<EmploymentStatusRow> = { able_to_work : able_to_work, employment_type: finalEmploymentType}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes employment status record given an id
   * @param id unique id of the employment status record in the DB
   * @returns boolean if deleted successfully
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes employment status record given the member's id 
   * @param member_id unique id of the member in the DB
   * @returns boolean if deleted successfully
   */
  async deleteByMemberId(member_id: string): Promise<boolean>{
    const result = await this.deleteOne({ member_id: member_id });
    return result !== null;
  }
}