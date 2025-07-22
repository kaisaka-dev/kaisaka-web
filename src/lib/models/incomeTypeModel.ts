import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *income_type*. 
 * 
 * Schema: id, caregiver_id, date_start, date_end, income_category
 * 
 * Made for the `income_type` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type IncomeTypeRow = tableRow<"income_type">

export class IncomeTypeModel extends TableManager<"income_type">('income_type') {
  public static instance: IncomeTypeModel = new IncomeTypeModel();

  /**
   * Inserts a new income type
   * @param caregiver_id caregiver id (UUID)
   * @param date_start start date
   * @param date_end optional end date  
   * @param income_category income category
   * @returns created income type record or null
   */
  async insertIncomeType(
    caregiver_id: string,
    date_start: string,
    date_end?: string | null,
    income_category?: 'Home-based' | 'Self-employed' | 'Wage Earner' | null
  ): Promise<IncomeTypeRow | null>{
    const new_income_type : Partial<IncomeTypeRow> = { 
      caregiver_id,
      date_start,
      date_end,
      income_category
    }
    const data  = await this.insertOne(new_income_type)

    return data
  }

  /**
   * Finds an income type by its unique id
   * @param id the unique id of the income type
   * @returns the income type instance with said unique id
   */
  async findById(id: number): Promise<IncomeTypeRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds income types by caregiver id
   * @param caregiver_id the caregiver id to search for
   * @returns array of income types for the caregiver or null
   */
  async findByCaregiver(caregiver_id: string): Promise<IncomeTypeRow[] | null>{
    return this.findMany({ caregiver_id: caregiver_id })
  }

  /**
   * Finds income types by category
   * @param income_category the income category to search for
   * @returns array of income types in the category or null
   */
  async findByCategory(income_category: 'Home-based' | 'Self-employed' | 'Wage Earner'): Promise<IncomeTypeRow[] | null>{
    return this.findMany({ income_category: income_category })
  }

  /**
   * Gets all income type records
   * @returns array of all income type records or null
   */
  async getAll(): Promise<IncomeTypeRow[] | null>{
    return this.findMany({})
  }

  /**
   * Update income type record
   * @param id the unique id of the income type in the DB
   * @param updates object containing fields to update
   * @returns boolean if update is successful or not
   */
  async updateIncomeType(id: number, updates: {
    caregiver_id?: string,
    date_start?: string,
    date_end?: string | null,
    income_category?: 'Home-based' | 'Self-employed' | 'Wage Earner' | null
  }): Promise<boolean>{
    const reference: Partial<IncomeTypeRow> = { id: id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes an income type record given its id
   * @param id the unique id of the income type in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes income type records by caregiver id
   * @param caregiver_id the caregiver id in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteByCaregiver(caregiver_id: string): Promise<boolean>{
    const result = await this.deleteMany({ caregiver_id: caregiver_id });
    return result !== null;
  }

  /**
   * Checks if income types exist for a given caregiver
   * @param caregiver_id the caregiver id to check for
   * @returns boolean indicating whether income types exist for the caregiver
   */
  async existsForCaregiver(caregiver_id: string): Promise<boolean>{
    const result = await this.findByCaregiver(caregiver_id);
    return result !== null && result.length > 0;
  }

  /**
   * Checks if an income type with the given id exists
   * @param id the id to check for
   * @returns boolean indicating whether the income type exists
   */
  async existsById(id: number): Promise<boolean>{
    const result = await this.findById(id);
    return result !== null;
  }
}