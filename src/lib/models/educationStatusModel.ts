import TableManager, { type tableRow } from '../types/manager.js';

type EducationStatusRow = tableRow<"education_status">

type EducationType = 
  "Home Program" 
  | "Nonformal" 
  | "Integrated/SPED" 
  | "Inclusive/Gen. Ed." 
  | null;

export class educationStatusModel extends TableManager<"education_status">('education_status') {
  public static instance: educationStatusModel = new educationStatusModel();
  
  /**
   * Finds education records by child ID
   * @param child_id Child's UUID
   * @returns array of education records or null
   */
  async findByChildId(child_id: string) {
    return this.findMany({ child_id });
  }

  /**
   * Finds education records by education type
   * @param education_type Education type enum
   * @returns array of education records or null
   */
  async findByEducationType(education_type: EducationType) {
    return this.findMany({ education_type });
  }

  /**
   * Finds education records by year range
   * @param year_start Starting year
   * @param year_end Ending year (optional)
   * @returns array of education records or null
   */
  async findByYearRange(year_start: number, year_end?: number) {
    let query = this.getQuery().gte('year_start', year_start);
    if (year_end !== undefined) {
      query = query.lte('year_end', year_end);
    }
    const { data, error } = await query;
    return error ? null : (data as EducationStatusRow[]);
  }

  /**
   * Inserts a new education status record
   * @param educationData Partial education data
   * @returns created education record or null
   */
  async insertEducationStatus(
    educationData: Omit<EducationStatusRow, 'id' | 'date_created' | 'last_updated'>
  ) {
    return this.insertOne(educationData);
  }

  /**
   * Updates education type and dates
   * @param id Record ID (bigint)
   * @param updates Fields to update
   * @returns boolean success indicator
   */
  async updateEducationDetails(
    id: number,
    updates: Partial<Pick<EducationStatusRow, 
      'education_type' | 'year_start' | 'year_end' | 'grade_level'
    >>
  ): Promise<Boolean> {
    const references: Partial<EducationStatusRow> = { id };
    const fullUpdates: Partial<EducationStatusRow> = {
      ...updates,
      last_updated: new Date().toISOString()
    };
    return this.updateOne(references, fullUpdates);
  }

  /**
   * Updates grade level
   * @param id Record ID (bigint)
   * @param grade_level New grade level
   * @returns boolean success indicator
   */
  async updateGradeLevel(id: number, grade_level: number): Promise<Boolean> {
    const references: Partial<EducationStatusRow> = { id };
    const updates: Partial<EducationStatusRow> = { 
      grade_level,
      last_updated: new Date().toISOString()
    };
    return this.updateOne(references, updates);
  }

  /**
   * Updates child reference
   * @param id Record ID (bigint)
   * @param child_id New child UUID
   * @returns boolean success indicator
   */
  async updateChildReference(id: number, child_id: string): Promise<Boolean> {
    const references: Partial<EducationStatusRow> = { id };
    const updates: Partial<EducationStatusRow> = { 
      child_id,
      last_updated: new Date().toISOString()
    };
    return this.updateOne(references, updates);
  }
}