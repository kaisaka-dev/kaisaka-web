import TableManager, { type tableRow } from '../types/manager.js';

type AnnualProgramRow = tableRow<"annual_program">

/**
 * A model concerning about CRUD operations on *annual programs kaisaka has for children*. 
 * 
 * Made for the `annual_program` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class annualProgramModel extends TableManager<"annual_program">('annual_program') {
  public static instance: annualProgramModel = new annualProgramModel();
  
  /**
   * Finds programs by start year
   * @param start_year 
   * @returns array of programs or null
   */
  async findByStartYear(start_year: number) {
    return this.findMany({ start_year });
  }

  /**
   * Finds programs by end year
   * @param end_year 
   * @returns array of programs or null
   */
  async findByEndYear(end_year: number) {
    return this.findMany({ end_year });
  }

  /**
   * Finds programs by target CWD count
   * @param target_new_cwds 
   * @returns array of programs or null
   */
  async findByTargetCwds(target_new_cwds: number) {
    return this.findMany({ target_new_cwds });
  }

  /**
   * Inserts a new annual program
   * @param programData 
   * @returns created program record or null
   */
  async insertAnnualProgram(
    programData: Omit<AnnualProgramRow, 'id' | 'date_created'>
  ) {
    return this.insertOne(programData);
  }

  /**
   * Updates program dates
   * @param id program ID (bigint)
   * @param updates date fields to update
   * @returns boolean success indicator
   */
  async updateProgramDates(
    id: number,
    updates: Partial<Pick<AnnualProgramRow, 
      'start_year' | 'start_month' | 'start_date' |
      'end_year' | 'end_month' | 'end_date'
    >>
  ): Promise<boolean> {
    const references: Partial<AnnualProgramRow> = { id };
    return this.updateOne(references, updates);
  }

  /**
   * Updates program targets and reflections
   * @param id program ID (bigint)
   * @param updates fields to update
   * @returns boolean success indicator
   */
  async updateProgramContent(
    id: number,
    updates: Partial<Pick<AnnualProgramRow,
      'target_new_cwds' | 'general_reflection' | 'lessons_learned'
    >>
  ): Promise<boolean> {
    const references: Partial<AnnualProgramRow> = { id };
    return this.updateOne(references, updates);
  }

  /**
   * Updates entire program record
   * @param id program ID (bigint)
   * @param updates all editable fields
   * @returns boolean success indicator
   */
  async updateFullProgram(
    id: number,
    updates: Partial<Omit<AnnualProgramRow, 'id' | 'date_created'>>
  ): Promise<boolean> {
    const references: Partial<AnnualProgramRow> = { id };
    return this.updateOne(references, updates);
  }
}