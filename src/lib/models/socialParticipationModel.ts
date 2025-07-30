import TableManager, { type tableRow } from '../types/manager.js';
import type { Database } from '../types/supabase-types.ts';

type participation_type_enum = Database['public']['Enums']['participation_type_enum'];
type SocialParticipationRow = tableRow<"social_participation">

/**
 * A model concerning about CRUD operations on social participation records of children. 
 * 
 * Made for the `social_participation` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class SocialParticipationModel extends TableManager<"social_participation">('social_participation') {
  public static instance: SocialParticipationModel = new SocialParticipationModel();
  
  /**
   * Creates a social participation record for an existing child
   * @param child_id unique id of the child in the DB
   * @param participation_type the participation type (Family Life or Community Life)
   * @param year the year of participation
   * @returns created social participation record
   */
  async insertSocialParticipation(child_id: string, participation_type: participation_type_enum, year: number): Promise<SocialParticipationRow | null>{
    const social_participation: Partial<SocialParticipationRow> = { 
      child_id: child_id, 
      participation_type: participation_type, 
      year: year
    }
    const data = await this.insertOne(social_participation)

    return data
  }

  /**
   * Finds social participation record given its id
   * @param id unique id of the social participation record in the DB
   * @returns social participation record corresponding the id
   */
  async findById(id: number): Promise<SocialParticipationRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds all social participation records for a given child
   * @param child_id unique id of the child in the DB
   * @returns array of social participation records for the given child
   */
  async findByChildId(child_id: string): Promise<SocialParticipationRow[]>{
    return this.findMany({ child_id: child_id }) || []
  }

  /**
   * Finds social participation records for a specific child, participation type, and year
   * @param child_id unique id of the child in the DB
   * @param participation_type the participation type to filter by
   * @param year the year to filter by
   * @returns social participation record matching the criteria
   */
  async findByChildParticipationYear(child_id: string, participation_type: participation_type_enum, year: number): Promise<SocialParticipationRow | null>{
    return this.findOne({ child_id: child_id, participation_type: participation_type, year: year })
  }

  /**
   * Finds all social participation records for a specific participation type and year
   * @param participation_type the participation type to filter by
   * @param year the year to filter by
   * @returns array of social participation records matching the criteria
   */
  async findByParticipationTypeAndYear(participation_type: participation_type_enum, year: number): Promise<SocialParticipationRow[]>{
    return this.findMany({ participation_type: participation_type, year: year }) || []
  }

  /**
   * Updates social participation record given an id
   * @param id unique id of the social participation record in the DB
   * @param participation_type the updated participation type to apply (optional)
   * @param year the updated year to apply (optional)
   * @returns boolean if updated successfully
   */
  async updateSocialParticipation(id: number, participation_type?: participation_type_enum, year?: number): Promise<boolean>{
    const reference: Partial<SocialParticipationRow> = { id: id }
    const updates: Partial<SocialParticipationRow> = {}
    
    if (participation_type !== undefined) updates.participation_type = participation_type
    if (year !== undefined) updates.year = year
    
    const data = await this.updateOne(reference, updates)
    return data
  }

  /**
   * Deletes social participation record given an id
   * @param id unique id of the social participation record in the DB
   * @returns boolean if deleted successfully
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes all social participation records for a given child
   * @param child_id unique id of the child in the DB
   * @returns boolean if deleted successfully
   */
  async deleteByChildId(child_id: string): Promise<boolean>{
    const result = await this.deleteMany({ child_id: child_id });
    return result !== null;
  }

  /**
   * Deletes a specific social participation record for a child, participation type, and year
   * @param child_id unique id of the child in the DB
   * @param participation_type the participation type
   * @param year the year
   * @returns boolean if deleted successfully
   */
  async deleteByChildParticipationYear(child_id: string, participation_type: participation_type_enum, year: number): Promise<boolean>{
    const result = await this.deleteOne({ child_id: child_id, participation_type: participation_type, year: year });
    return result !== null;
  }
}