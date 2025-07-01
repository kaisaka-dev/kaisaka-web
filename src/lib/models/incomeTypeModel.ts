import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *income_type*. 
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
   * @param name name of the income type
   * @returns created income type record or null
   */
  async insertIncomeType(name: string): Promise<IncomeTypeRow | null>{
    const new_income_type : Partial<IncomeTypeRow> = { 
      name
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
   * Finds an income type by its name
   * @param name the name of the income type
   * @returns the income type instance with said name
   */
  async findByName(name: string): Promise<IncomeTypeRow | null>{
    return this.findOne({ name: name })
  }

  /**
   * Finds income types by partial name match
   * @param nameKeyword keyword to search in income type names
   * @returns array of income types matching the name keyword
   */
  async findByNameKeyword(nameKeyword: string): Promise<IncomeTypeRow[] | null>{
    // Note: This would require a custom query for partial text matching
    // For now, returning exact matches
    return this.findMany({ name: nameKeyword })
  }

  /**
   * Gets all income type records
   * @returns array of all income type records or null
   */
  async getAll(): Promise<IncomeTypeRow[] | null>{
    return this.findMany({})
  }

  /**
   * Update income type record's name
   * @param id the unique id of the income type in the DB
   * @param name the updated name to be applied
   * @returns boolean if update is successful or not
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<IncomeTypeRow> = { id: id }
    const updates: Partial<IncomeTypeRow> = { name: name }
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
   * Deletes an income type record given its name
   * @param name the name of the income type in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteByName(name: string): Promise<boolean>{
    const result = await this.deleteOne({ name: name });
    return result !== null;
  }

  /**
   * Checks if an income type with the given name exists
   * @param name the name to check for
   * @returns boolean indicating whether the income type exists
   */
  async exists(name: string): Promise<boolean>{
    const result = await this.findByName(name);
    return result !== null;
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