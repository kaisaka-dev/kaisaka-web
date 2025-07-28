import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *caregiver_groups*. 
 * 
 * Made for the `caregiver_groups` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type CaregiverGroupsRow = tableRow<"caregiver_groups">

export class CaregiverGroupsModel extends TableManager<"caregiver_groups">('caregiver_groups') {
  public static instance: CaregiverGroupsModel = new CaregiverGroupsModel();

  /**
   * Inserts a new caregiver group membership
   * @param caregiver_id id of the caregiver
   * @param community_group_id id of the community group
   * @param date_joined date when caregiver joined the group
   * @param date_left date when caregiver left the group (optional)
   * @returns created caregiver group record or null
   */
  async insertCaregiverGroup(
    caregiver_id: string,
    community_group_id: number,
    date_joined: string = new Date().toISOString(),
    date_left?: string | null
  ): Promise<CaregiverGroupsRow | null>{
    const new_caregiver_group : Partial<CaregiverGroupsRow> = { 
      caregiver_id,
      community_group_id,
      date_joined,
      date_left
    }
    const data  = await this.insertOne(new_caregiver_group)

    return data
  }

  /**
   * Finds a caregiver group record by its unique id
   * @param id the unique id of the caregiver group record
   * @returns the caregiver group instance with said unique id
   */
  async findById(id: number): Promise<CaregiverGroupsRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds caregiver group records by caregiver id
   * @param caregiver_id the unique id of the caregiver
   * @returns array of caregiver group records for the given caregiver
   */
  async findByCaregiverId(caregiver_id: string): Promise<CaregiverGroupsRow[] | null>{
    return this.findMany({ caregiver_id: caregiver_id })
  }

  /**
   * Finds caregiver group records by community group id
   * @param community_group_id the unique id of the community group
   * @returns array of caregiver group records for the given community group
   */
  async findByCommunityGroupId(community_group_id: number): Promise<CaregiverGroupsRow[] | null>{
    return this.findMany({ community_group_id: community_group_id })
  }

  /**
   * Finds active caregiver group memberships (no date_left)
   * @param caregiver_id the unique id of the caregiver (optional)
   * @returns array of active caregiver group records
   */
  async findActiveMembers(caregiver_id?: string): Promise<CaregiverGroupsRow[] | null>{
    const filter: Partial<CaregiverGroupsRow> = { date_left: null }
    if (caregiver_id) {
      filter.caregiver_id = caregiver_id
    }
    return this.findMany(filter)
  }

  /**
   * Finds inactive caregiver group memberships (has date_left)
   * @param caregiver_id the unique id of the caregiver (optional)
   * @returns array of inactive caregiver group records
   */
  async findInactiveMembers(caregiver_id?: string): Promise<CaregiverGroupsRow[] | null>{
    // Note: This would require a custom query for IS NOT NULL
    // For now, this is a placeholder implementation
    return this.findMany(caregiver_id ? { caregiver_id } : {})
  }

  /**
   * Update caregiver group record's date left
   * @param id the unique id of the caregiver group record in the DB
   * @param date_left the date when caregiver left the group
   * @returns boolean if update is successful or not
   */
  async updateDateLeft(id: number, date_left: string | null): Promise<boolean>{
    const reference: Partial<CaregiverGroupsRow> = { id: id }
    const updates: Partial<CaregiverGroupsRow> = { date_left: date_left }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update caregiver group record's date joined
   * @param id the unique id of the caregiver group record in the DB
   * @param date_joined the date when caregiver joined the group
   * @returns boolean if update is successful or not
   */
  async updateDateJoined(id: number, date_joined: string): Promise<boolean>{
    const reference: Partial<CaregiverGroupsRow> = { id: id }
    const updates: Partial<CaregiverGroupsRow> = { date_joined: date_joined }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update caregiver group record's community group id
   * @param id the unique id of the caregiver group record in the DB
   * @param community_group_id the new community group id
   * @returns boolean if update is successful or not
   */
  async updateCommunityGroupId(id: number, community_group_id: number): Promise<boolean>{
    const reference: Partial<CaregiverGroupsRow> = { id: id }
    const updates: Partial<CaregiverGroupsRow> = { community_group_id: community_group_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Mark a caregiver as having left a group
   * @param id the unique id of the caregiver group record in the DB
   * @param date_left the date when caregiver left the group (defaults to current date)
   * @returns boolean if update is successful or not
   */
  async markAsLeft(id: number, date_left: string = new Date().toISOString()): Promise<boolean>{
    return this.updateDateLeft(id, date_left)
  }

  /**
   * Reactivate a caregiver group membership (remove date_left)
   * @param id the unique id of the caregiver group record in the DB
   * @returns boolean if update is successful or not
   */
  async reactivateMembership(id: number): Promise<boolean>{
    return this.updateDateLeft(id, null)
  }

  /**
   * Deletes a caregiver group record given its id
   * @param id the unique id of the caregiver group record in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes all caregiver group records for a specific caregiver
   * @param caregiver_id the unique id of the caregiver
   * @returns boolean if delete is successful or not
   */
  async deleteByCaregiverId(caregiver_id: string): Promise<boolean>{
    const result = await this.deleteOne({ caregiver_id: caregiver_id });
    return result !== null;
  }
}