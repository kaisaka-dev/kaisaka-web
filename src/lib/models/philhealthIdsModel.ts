import TableManager, { type tableRow } from '../types/manager.js';

type PhilhealthIdsRow = tableRow<"philhealth_ids">

/**
 * A model concerning about CRUD operations on the relationships between children and caregivers. 
 * 
 * Made for the `relationship_cc` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class philhealthIdsModel extends TableManager<"philhealth_ids">('philhealth_ids') {
  public static instance: philhealthIdsModel = new philhealthIdsModel();
  
  /**
   * Finds entries by PhilHealth ID number
   * @param philhealth_id The PhilHealth ID number
   * @returns Array of matching records or null
   */
  async findByPhilhealthId(philhealth_id: number): Promise<PhilhealthIdsRow[] | null> {
    return this.findMany({ philhealth_id });
  }

  /**
   * Finds entries by expiration date
   * @param exp_date Expiration date (ISO string format)
   * @returns Array of matching records or null
   */
  async findByExpDate(exp_date: string): Promise<PhilhealthIdsRow[] | null> {
    return this.findMany({ exp_date });
  }

  /**
   * Inserts a new PhilHealth ID record
   * @param philhealth_id The PhilHealth ID number
   * @param exp_date Expiration date (ISO string format)
   * @returns Created record or null
   */
  async insertPhilhealthId(philhealth_id: number, exp_date: string): Promise<PhilhealthIdsRow | null> {
    const data: Partial<PhilhealthIdsRow> = { philhealth_id, exp_date };
    return this.insertOne(data);
  }

  /**
   * Updates PhilHealth ID number
   * @param id Record ID (UUID)
   * @param new_philhealth_id New PhilHealth ID number
   * @returns Updated record or null
   */
  async updatePhilhealthId(id: string, new_philhealth_id: number): Promise<boolean>{
    const references: Partial<PhilhealthIdsRow> = { id };
    const updates: Partial<PhilhealthIdsRow> = { philhealth_id: new_philhealth_id };
    return this.updateOne(references, updates);
  }

  /**
   * Updates expiration date
   * @param id Record ID (UUID)
   * @param new_exp_date New expiration date (ISO string format)
   * @returns Updated record or null
   */
  async updateExpDate(id: string, new_exp_date: string): Promise<boolean>{
    const references: Partial<PhilhealthIdsRow> = { id };
    const updates: Partial<PhilhealthIdsRow> = { exp_date: new_exp_date };
    return this.updateOne(references, updates);
  }

  /**
   * Updates both PhilHealth ID and expiration date
   * @param id Record ID (UUID)
   * @param new_philhealth_id New PhilHealth ID number
   * @param new_exp_date New expiration date (ISO string format)
   * @returns Updated record or null
   */
  async updatePhilhealthRecord(
    id: string,
    new_philhealth_id: number,
    new_exp_date: string
  ): Promise<boolean>{
    const references: Partial<PhilhealthIdsRow> = { id };
    const updates: Partial<PhilhealthIdsRow> = { 
      philhealth_id: new_philhealth_id, 
      exp_date: new_exp_date 
    };
    return this.updateOne(references, updates);
  }
}