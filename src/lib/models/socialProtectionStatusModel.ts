import TableManager, { type tableRow } from '../types/manager.js';

type SocialProtectionStatusRow = tableRow<"social_protection_status">

/**
 * A model concerning about CRUD operations on the social protection status of children data. 
 * 
 * Made for the `social_protection_status` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
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
   * @param fam_year_accessed Year accessed of family life participation
   * @returns array of status records or null
   */
  async findByFamYearAccessed(fam_year_accessed: number) {
    return this.findMany({ fam_year_accessed });
  }

  /**
   * Finds status records by year accessed
   * @param comm_year_accessed Year accessed of family life participation
   * @returns array of status records or null
   */
  async findByCommYearAccessed(comm_year_accessed: number) {
    return this.findMany({ comm_year_accessed });
  }


  /**
   * Finds status records by participation in community club
   * @param participates_community_club Boolean value
   * @returns array of status records or null
   */
  async findByParticipatesCommunityClub(participates_community_club: boolean) {
    return this.findMany({ participates_community_club });
  }

  /**
   * Finds status records by participation in family life
   * @param participates_family_life Boolean value
   * @returns array of status records or null
   */
  async findByParticipatesFamilyLife(participates_family_life: boolean) {
    return this.findMany({ participates_family_life });
  }

  /**
   * Inserts a new social protection status record
   * @param statusData Full status data including participation fields
   * @returns created status record or null
   */
  async insertStatus(
    statusData: Omit<SocialProtectionStatusRow, 'id' | 'date_created' | 'updated_at'>
  ) {
    const now = new Date().toISOString();
    const fullData: Partial<SocialProtectionStatusRow> = {
      ...statusData,
      date_created: now,
      updated_at: now
    };
    return this.insertOne(fullData);
  }

  /**
   * Updates the year accessed for a status record
   * @param id Record ID (bigint)
   * @param fam_year_accessed New year accessed in family life
   * @returns boolean success indicator
   */
  async updateFamYearAccessed(id: number, fam_year_accessed: number): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = { 
      fam_year_accessed,
      updated_at: new Date().toISOString()
    };
    return this.updateOne(references, updates);
  }

    /**
   * Updates the year accessed for a status record
   * @param id Record ID (bigint)
   * @param comm_year_accessed New year accessed in community
   * @returns boolean success indicator
   */
  async updateYearAccessed(id: number, comm_year_accessed: number): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = {
      comm_year_accessed,
      updated_at: new Date().toISOString() 
    };
    return this.updateOne(references, updates);
  }

  /**
   * Updates participation in community club
   * @param id Record ID (bigint)
   * @param participates_community_club New participation status
   * @returns boolean success indicator
   */
  async updateParticipatesCommunityClub(id: number, participates_community_club: boolean): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = { 
      participates_community_club,
      updated_at: new Date().toISOString() 
    };
    return this.updateOne(references, updates);
  }

  /**
   * Updates participation in family life
   * @param id Record ID (bigint)
   * @param participates_family_life New participation status
   * @returns boolean success indicator
   */
  async updateParticipatesFamilyLife(id: number, participates_family_life: boolean): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const updates: Partial<SocialProtectionStatusRow> = { 
      participates_family_life,
      updated_at: new Date().toISOString() 
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
      updated_at: new Date().toISOString() 
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
    updates: Partial<Pick<SocialProtectionStatusRow, 
      'comm_year_accessed' | 'fam_year_accessed' | 'child_id' | 'participates_community_club' | 'participates_family_life'
    >>
  ): Promise<boolean> {
    const references: Partial<SocialProtectionStatusRow> = { id };
    const fullUpdates: Partial<SocialProtectionStatusRow> = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    return this.updateOne(references, fullUpdates);
  }
}