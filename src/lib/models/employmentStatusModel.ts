import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type employment_type_enum = Database['public']['Enums']['employment_type_enum'];
type EmploymentStatusRow = tableRow<"employment_status">

/**
 * A model concerning about CRUD operations on employment status of children. 
 * 
 * Made for the `employment_status` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class EmploymentStatusModel extends TableManager<"employment_status">('employment_status') {
  public static instance: EmploymentStatusModel = new EmploymentStatusModel();
  
  /**
   * Creates an employment status record for an existing child
   * @param able_to_work indicates whether or not child is able to work
   * @param employment_type the employment type of the child
   * @param child_id unique id of the child in the DB
   * @returns created employment status record
   */
  async insertEmploymentStatus(able_to_work: boolean, employment_type: employment_type_enum | null, child_id: string): Promise<EmploymentStatusRow | null>{
    const finalEmploymentType = able_to_work ? employment_type : null; //prevents having employment type if able_to_work is false
    
    const employment_status : Partial<EmploymentStatusRow> = { 
      able_to_work: able_to_work, 
      employment_type: finalEmploymentType, 
      child_id: child_id 
    }
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
   * Finds employment status record given the child's id
   * @param child_id unique id of the child in the DB
   * @returns employment status record of the given child
   */
  async findByChildId(child_id: string): Promise<EmploymentStatusRow | null>{
    return this.findOne({ child_id: child_id })
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
   * Deletes employment status record given the child's id 
   * @param child_id unique id of the child in the DB
   * @returns boolean if deleted successfully
   */
  async deleteByChildId(child_id: string): Promise<boolean>{
    const result = await this.deleteOne({ child_id: child_id });
    return result !== null;
  }
}