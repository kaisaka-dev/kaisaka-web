import TableManager, { type tableRow } from '../types/manager.js';

type MembershipPaymentRow = tableRow<"membership_payment">

/**
 * A model concerning about CRUD operations on membership payments made by families. 
 * 
 * Made for the `membership_payment` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class MembershipPaymentModel extends TableManager<"membership_payment">('membership_payment') {
  public static instance: MembershipPaymentModel = new MembershipPaymentModel();
  
  /**
   * Records a new membership payment
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family making payment (optional)
   * @param amount_paid the amount paid (optional)
   * @param date_paid the date payment was made (optional)
   * @param remarks additional remarks (optional)
   * @returns created payment record or null
   */
  async insertPayment(
    annual_program_id: number,
    family_id?: string | null,
    amount_paid?: number | null,
    date_paid?: string | null,
    remarks?: string | null
  ): Promise<MembershipPaymentRow | null> {
    const now = new Date().toISOString();
    const payment: Partial<MembershipPaymentRow> = {
      annual_program_id,
      family_id: family_id || null,
      amount_paid: amount_paid || null,
      date_paid: date_paid || null,
      remarks: remarks || null,
      date_created: now
    };
    
    return this.insertOne(payment);
  }

  /**
   * Finds payment records by family id
   * @param family_id the unique id of the family
   * @returns array of payment records or null
   */
  async findByFamilyId(family_id: string): Promise<MembershipPaymentRow[] | null> {
    return this.findMany({ family_id });
  }

  /**
   * Finds payment records by annual program id
   * @param annual_program_id the unique id of the annual program
   * @returns array of payment records or null
   */
  async findByAnnualProgramId(annual_program_id: number): Promise<MembershipPaymentRow[] | null> {
    return this.findMany({ annual_program_id });
  }

  /**
   * Finds payment records for a specific family and annual program
   * @param family_id the unique id of the family
   * @param annual_program_id the unique id of the annual program
   * @returns array of payment records or null
   */
  async findByFamilyAndProgram(family_id: string, annual_program_id: number): Promise<MembershipPaymentRow[] | null> {
    return this.findMany({ family_id, annual_program_id });
  }

  /**
   * Finds payments by amount range
   * @param min_amount minimum amount paid
   * @param max_amount maximum amount paid (optional)
   * @returns array of payment records or null
   */
  async findByAmountRange(min_amount: number, max_amount?: number): Promise<MembershipPaymentRow[] | null> {
    let query = this.getQuery().gte('amount_paid', min_amount);
    if (max_amount !== undefined) {
      query = query.lte('amount_paid', max_amount);
    }
    const { data, error } = await query;
    return error ? null : (data as MembershipPaymentRow[]);
  }

  /**
   * Finds payments within a date range
   * @param start_date start date for the range
   * @param end_date end date for the range (optional)
   * @returns array of payment records or null
   */
  async findByDateRange(start_date: string, end_date?: string): Promise<MembershipPaymentRow[] | null> {
    let query = this.getQuery().gte('date_paid', start_date);
    if (end_date !== undefined) {
      query = query.lte('date_paid', end_date);
    }
    const { data, error } = await query;
    return error ? null : (data as MembershipPaymentRow[]);
  }

  /**
   * Finds unpaid records (where amount_paid is null)
   * @param annual_program_id the unique id of the annual program (optional)
   * @returns array of unpaid payment records or null
   */
  async findUnpaidRecords(annual_program_id?: number): Promise<MembershipPaymentRow[] | null> {
    const filter: Partial<MembershipPaymentRow> = { amount_paid: null };
    if (annual_program_id !== undefined) {
      filter.annual_program_id = annual_program_id;
    }
    return this.findMany(filter);
  }

  /**
   * Finds paid records (where amount_paid is not null)
   * @param annual_program_id the unique id of the annual program (optional)
   * @returns array of paid payment records or null
   */
  async findPaidRecords(annual_program_id?: number): Promise<MembershipPaymentRow[] | null> {
    let query = this.getQuery().not('amount_paid', 'is', null);
    if (annual_program_id !== undefined) {
      query = query.eq('annual_program_id', annual_program_id);
    }
    const { data, error } = await query;
    return error ? null : (data as MembershipPaymentRow[]);
  }

  /**
   * Gets all payment records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns array of all payment records corresponding to the filters or null
   */
  async getAll(filter?: Partial<MembershipPaymentRow>): Promise<MembershipPaymentRow[] | null> {
    return this.findMany(filter);
  }

  /**
   * Updates the amount paid for a payment record
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param amount_paid the new amount paid
   * @returns boolean if update is successful
   */
  async updateAmountPaid(annual_program_id: number, family_id: string, amount_paid: number): Promise<boolean> {
    const reference: Partial<MembershipPaymentRow> = { annual_program_id, family_id };
    const updates: Partial<MembershipPaymentRow> = { amount_paid };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the date paid for a payment record
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param date_paid the new date paid
   * @returns boolean if update is successful
   */
  async updateDatePaid(annual_program_id: number, family_id: string, date_paid: string): Promise<boolean> {
    const reference: Partial<MembershipPaymentRow> = { annual_program_id, family_id };
    const updates: Partial<MembershipPaymentRow> = { date_paid };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the remarks for a payment record
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param remarks the updated remarks
   * @returns boolean if update is successful
   */
  async updateRemarks(annual_program_id: number, family_id: string, remarks: string): Promise<boolean> {
    const reference: Partial<MembershipPaymentRow> = { annual_program_id, family_id };
    const updates: Partial<MembershipPaymentRow> = { remarks };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Records a payment (updates amount_paid and date_paid)
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param amount_paid the amount paid
   * @param date_paid the date payment was made (optional, defaults to now)
   * @returns boolean if update is successful
   */
  async recordPayment(
    annual_program_id: number, 
    family_id: string, 
    amount_paid: number,
    date_paid?: string
  ): Promise<boolean> {
    const reference: Partial<MembershipPaymentRow> = { annual_program_id, family_id };
    const updates: Partial<MembershipPaymentRow> = { 
      amount_paid,
      date_paid: date_paid || new Date().toISOString()
    };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates multiple fields for a payment record
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @param updates the fields to update
   * @returns boolean if update is successful
   */
  async updatePayment(
    annual_program_id: number,
    family_id: string,
    updates: Partial<Pick<MembershipPaymentRow, 
      'amount_paid' | 'date_paid' | 'remarks'
    >>
  ): Promise<boolean> {
    const reference: Partial<MembershipPaymentRow> = { annual_program_id, family_id };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Deletes payment records for a specific family and annual program
   * @param annual_program_id the unique id of the annual program
   * @param family_id the unique id of the family
   * @returns boolean if delete is successful
   */
  async deleteByFamilyAndProgram(annual_program_id: number, family_id: string): Promise<boolean> {
    return this.deleteOne({ annual_program_id, family_id }) !== null;
  }

  /**
   * Deletes all payment records for a specific family
   * @param family_id the unique id of the family
   * @returns boolean if delete is successful
   */
  async deleteByFamilyId(family_id: string): Promise<boolean> {
    return this.deleteOne({ family_id }) !== null;
  }

  /**
   * Deletes all payment records for a specific annual program
   * @param annual_program_id the unique id of the annual program
   * @returns boolean if delete is successful
   */
  async deleteByAnnualProgramId(annual_program_id: number): Promise<boolean> {
    return this.deleteOne({ annual_program_id }) !== null;
  }
}