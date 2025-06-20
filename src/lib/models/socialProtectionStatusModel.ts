import TableManager, { type tableRow } from '../types/manager.js';

type SocialProtectionStatusRow = tableRow<"social_protection_status">

export class socialProtectionStatusModel extends TableManager<"social_protection_status">('social_protection_status') {
  public static instance: socialProtectionStatusModel = new socialProtectionStatusModel();
  
  /**
   * Finds status records by child ID
   * @param child_id Child's UUID
   * @returns array of status records or null
   */
  async findByChildId(child_id: string) {
    return this.findMany({ child_id });
  }

  /**
   * Finds status records by year accessed
   * @param year_accessed Year accessed
   * @returns array of status records or null
   */
  async findByYearAccessed(year_accessed: number) {
    return this.findMany({ year_accessed });
  }

  /**
   * Inserts a new social protection status record
   * @param statusData Partial status data (id is auto-generated)
   * @returns created status record or null
   */
  async insertStatus(
    statusData: Omit<SocialProtectionStatusRow, 'id' | 'date_created' | 'last_updated'>
  ) {
    return this.insertOne(statusData);
  }

  /**
   * Updates the year accessed for a status record
   * @param id Record ID (bigint)
   * @param year_accessed New year accessed
   * @returns boolean success indicator
   */
  async updateYearAccessed(id: number, year_accessed: number): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = { 
      year_accessed,
      last_updated: new Date().toISOString() 
    };
    return this.updateOne(references, updates);
  }

  /**
   * Updates the child reference for a status record
   * @param id Record ID (bigint)
   * @param child_id New child UUID
   * @returns boolean success indicator
   */
  async updateChildReference(id: number, child_id: string): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = { 
      child_id,
      last_updated: new Date().toISOString() 
    };
    return this.updateOne(references, updates);
  }

  /**
   * Updates multiple fields for a status record
   * @param id Record ID (bigint)
   * @param updates Fields to update
   * @returns boolean success indicator
   */
  async updateStatus(
    id: number, 
    updates: Partial<Pick<SocialProtectionStatusRow, 'year_accessed' | 'child_id'>>
  ): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const fullUpdates: Partial<SocialProtectionStatusRow> = {
      ...updates,
      last_updated: new Date().toISOString()
    };
    return this.updateOne(references, fullUpdates);
  }
}