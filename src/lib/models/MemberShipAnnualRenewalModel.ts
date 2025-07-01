import TableManager, { type tableRow } from '../types/manager.js';

type MembershipAnnualRenewalRow = tableRow<"membership_annual_renewal">

/**
 * A model concerning about CRUD operations on annual membership renewals for families. 
 * 
 * Made for the `membership_annual_renewal` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class MembershipAnnualRenewalModel extends TableManager<"membership_annual_renewal">('membership_annual_renewal') {
  public static instance: MembershipAnnualRenewalModel = new MembershipAnnualRenewalModel();
  
  /**
   * Creates a new annual renewal record for a family
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param total_amount_due the total amount due for renewal
   * @param remarks additional remarks (optional)
   * @returns created renewal record or null
   */
  async insertRenewal(
    annual_program_id: number,
    family_id: string,
    total_amount_due: number,
    remarks?: string | null
  ): Promise<MembershipAnnualRenewalRow | null> {
    const now = new Date().toISOString();
    const renewal: Partial<MembershipAnnualRenewalRow> = {
      annual_program_id,
      family_id,
      total_amount_due,
      remarks: remarks || null,
      date_created: now,
      last_updated: now
    };
    
    return this.insertOne(renewal);
  }

  /**
   * Finds a renewal record by its unique id
   * @param id the unique id of the renewal record
   * @returns renewal record or null
   */
  async findById(id: number): Promise<MembershipAnnualRenewalRow | null> {
    return this.findOne({ id });
  }

  /**
   * Finds renewal records by family id
   * @param family_id the unique id of the family
   * @returns array of renewal records or null
   */
  async findByFamilyId(family_id: string): Promise<MembershipAnnualRenewalRow[] | null> {
    return this.findMany({ family_id });
  }

  /**
   * Finds renewal records by annual program id
   * @param annual_program_id the unique id of the annual program
   * @returns array of renewal records or null
   */
  async findByAnnualProgramId(annual_program_id: number): Promise<MembershipAnnualRenewalRow[] | null> {
    return this.findMany({ annual_program_id });
  }

  /**
   * Finds renewal record for a specific family and annual program
   * @param family_id the unique id of the family
   * @param annual_program_id the unique id of the annual program
   * @returns renewal record or null
   */
  async findByFamilyAndProgram(family_id: string, annual_program_id: number): Promise<MembershipAnnualRenewalRow | null> {
    return this.findOne({ family_id, annual_program_id });
  }

  /**
   * Finds renewals by amount due range
   * @param min_amount minimum amount due
   * @param max_amount maximum amount due (optional)
   * @returns array of renewal records or null
   */
  async findByAmountRange(min_amount: number, max_amount?: number): Promise<MembershipAnnualRenewalRow[] | null> {
    let query = this.getQuery().gte('total_amount_due', min_amount);
    if (max_amount !== undefined) {
      query = query.lte('total_amount_due', max_amount);
    }
    const { data, error } = await query;
    return error ? null : (data as MembershipAnnualRenewalRow[]);
  }

  /**
   * Gets all renewal records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns array of all renewal records corresponding to the filters or null
   */
  async getAll(filter?: Partial<MembershipAnnualRenewalRow>): Promise<MembershipAnnualRenewalRow[] | null> {
    return this.findMany(filter);
  }

  /**
   * Updates the total amount due for a renewal
   * @param id the unique id of the renewal record
   * @param total_amount_due the new total amount due
   * @returns boolean if update is successful
   */
  async updateTotalAmountDue(id: number, total_amount_due: number): Promise<boolean> {
    const now = new Date().toISOString();
    const reference: Partial<MembershipAnnualRenewalRow> = { id };
    const updates: Partial<MembershipAnnualRenewalRow> = { 
      total_amount_due, 
      last_updated: now 
    };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the remarks for a renewal
   * @param id the unique id of the renewal record
   * @param remarks the updated remarks
   * @returns boolean if update is successful
   */
  async updateRemarks(id: number, remarks: string): Promise<boolean> {
    const now = new Date().toISOString();
    const reference: Partial<MembershipAnnualRenewalRow> = { id };
    const updates: Partial<MembershipAnnualRenewalRow> = { 
      remarks, 
      last_updated: now 
    };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the annual program for a renewal
   * @param id the unique id of the renewal record
   * @param annual_program_id the new annual program id
   * @returns boolean if update is successful
   */
  async updateAnnualProgram(id: number, annual_program_id: number): Promise<boolean> {
    const now = new Date().toISOString();
    const reference: Partial<MembershipAnnualRenewalRow> = { id };
    const updates: Partial<MembershipAnnualRenewalRow> = { 
      annual_program_id, 
      last_updated: now 
    };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates multiple fields for a renewal record
   * @param id the unique id of the renewal record
   * @param updates the fields to update
   * @returns boolean if update is successful
   */
  async updateRenewal(
    id: number,
    updates: Partial<Pick<MembershipAnnualRenewalRow, 
      'annual_program_id' | 'total_amount_due' | 'remarks'
    >>
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const reference: Partial<MembershipAnnualRenewalRow> = { id };
    const fullUpdates: Partial<MembershipAnnualRenewalRow> = {
      ...updates,
      last_updated: now
    };
    
    return this.updateOne(reference, fullUpdates);
  }

  /**
   * Deletes a renewal record by its id
   * @param id the unique id of the renewal record
   * @returns boolean if delete is successful
   */
  async deleteById(id: number): Promise<boolean> {
    const result = await this.deleteOne({ id });
    return result !== null;
  }

  /**
   * Deletes all renewal records for a specific family
   * @param family_id the unique id of the family
   * @returns boolean if delete is successful
   */
  async deleteByFamilyId(family_id: string): Promise<boolean> {
    const result = await this.deleteOne({ family_id });
    return result !== null;
  }

  /**
   * Deletes all renewal records for a specific annual program
   * @param annual_program_id the unique id of the annual program
   * @returns boolean if delete is successful
   */
  async deleteByAnnualProgramId(annual_program_id: number): Promise<boolean> {
    const result = await this.deleteOne({ annual_program_id });
    return result !== null;
  }
}