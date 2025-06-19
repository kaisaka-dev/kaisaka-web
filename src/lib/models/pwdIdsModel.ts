import TableManager, { type tableRow } from '../types/manager.js';


type PwdIdsRow = tableRow<"pwd_ids">

/**
 * A model concerning about pwd_ids API. 
 * 
 * Refer to `src/lib/models/db.md` about what is exactly is a model.
 */
export class pwdIdsModel extends TableManager<"pwd_ids">('pwd_ids'){
  public static instance: pwdIdsModel = new pwdIdsModel();
 
  /**
   * Finds a pwd_id entry by its pwd_id (veyr confusing)
   * @param pwd_id the pwd id 
   * @returns 
   */
  async findById(pwd_id: string): Promise<PwdIdsRow[] | null> {
    return this.findMany( { pwd_id } )
  }

  /**
   * Finds a pwd_id entries by its expiry date
   * @param expiryDate is the expiry date
   * @returns 
   */
  async findByExpiryDate(expiry_date: string): Promise<PwdIdsRow[] | null>{
    return this.findMany( { expiry_date } )
  }

  /**
   * Insert a barangay to supabase
   * @param id - the id number (auto-generated)
   * @param pwd_id - the pwd id of the entry
   * @param expiry_date - the expiry date of the pwd id
   * @returns none
   */
  async insertPwdId(pwd_id: string, expiry_date: string): Promise<PwdIdsRow | null>{
      const pwd_ids: Partial<PwdIdsRow> = {expiry_date, pwd_id}
      const data = await this.insertOne(pwd_ids);

      return data;
  }

  async updateId(id: string, pwd_id: string): Promise<Boolean>{
    const references: Partial<PwdIdsRow> = { id }
    const updates: Partial<PwdIdsRow> = { pwd_id }
    const data = await this.updateOne(references, updates)

    return data;
  }

  async updateExpiryDate(id: string, expiry_date: string): Promise<Boolean>{
    const references: Partial<PwdIdsRow> = { id }
    const updates: Partial<PwdIdsRow> = { expiry_date }
    const data = await this.updateOne(references, updates)

    return data;
  }
}
