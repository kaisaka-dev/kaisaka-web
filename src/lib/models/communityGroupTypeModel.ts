import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *community_group_type*. 
 * 
 * Made for the `community_group_type` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type CommunityGroupTypeRow = tableRow<"community_group_type">

export class CommunityGroupTypeModel extends TableManager<"community_group_type">('community_group_type') {
  public static instance: CommunityGroupTypeModel = new CommunityGroupTypeModel();

  /**
   * Inserts a new community group type
   * @param name name of the community group type
   * @returns created community group type record or null
   */
  async insertCommunityGroupType(name: string): Promise<CommunityGroupTypeRow | null>{
    const new_community_group_type : Partial<CommunityGroupTypeRow> = { 
      name
    }
    const data  = await this.insertOne(new_community_group_type)

    return data
  }

  /**
   * Finds a community group type by its unique id
   * @param id the unique id of the community group type
   * @returns the community group type instance with said unique id
   */
  async findById(id: number): Promise<CommunityGroupTypeRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds a community group type by its name
   * @param name the name of the community group type
   * @returns the community group type instance with said name
   */
  async findByName(name: string): Promise<CommunityGroupTypeRow | null>{
    return this.findOne({ name: name })
  }

  /**
   * Finds community group types by partial name match
   * @param nameKeyword keyword to search in community group type names
   * @returns array of community group types matching the name keyword
   */
  async findByNameKeyword(nameKeyword: string): Promise<CommunityGroupTypeRow[] | null>{
    // Note: This would require a custom query for partial text matching
    // For now, returning exact matches
    return this.findMany({ name: nameKeyword })
  }

  /**
   * Gets all community group type records
   * @returns array of all community group type records or null
   */
  async getAll(): Promise<CommunityGroupTypeRow[] | null>{
    return this.findMany({})
  }

  /**
   * Update community group type record's name
   * @param id the unique id of the community group type in the DB
   * @param name the updated name to be applied
   * @returns boolean if update is successful or not
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<CommunityGroupTypeRow> = { id: id }
    const updates: Partial<CommunityGroupTypeRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes a community group type record given its id
   * @param id the unique id of the community group type in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes a community group type record given its name
   * @param name the name of the community group type in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteByName(name: string): Promise<boolean>{
    const result = await this.deleteOne({ name: name });
    return result !== null;
  }

  /**
   * Checks if a community group type with the given name exists
   * @param name the name to check for
   * @returns boolean indicating whether the community group type exists
   */
  async exists(name: string): Promise<boolean>{
    const result = await this.findByName(name);
    return result !== null;
  }

  /**
   * Checks if a community group type with the given id exists
   * @param id the id to check for
   * @returns boolean indicating whether the community group type exists
   */
  async existsById(id: number): Promise<boolean>{
    const result = await this.findById(id);
    return result !== null;
  }

  /**
   * Gets all caregivers associated with a specific community group type
   * @param community_group_type_id the community group type id
   * @returns array of caregivers in this community group type
   */
  async getCaregiversByGroupType(community_group_type_id: number): Promise<any[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('community_group_type')
        .select(`
          *,
          caregiver_groups!inner (
            caregivers!inner (
              id,
              contact_number,
              email,
              facebook_link,
              occupation,
              members (
                first_name,
                last_name,
                middle_name
              )
            ),
            date_joined,
            date_left
          )
        `)
        .eq('id', community_group_type_id);

      if (error) {
        console.error('Error fetching caregivers by group type:', error);
        return null;
      }

      // Flatten the nested structure
      const caregivers = data.flatMap(group => 
        group.caregiver_groups?.map(cg => ({
          ...cg.caregivers,
          date_joined: cg.date_joined,
          date_left: cg.date_left
        })) || []
      );

      return caregivers;
    } catch (err) {
      console.error('Database query error:', err);
      return null;
    }
  }

  /**
   * Gets income types for caregivers in a specific community group type
   * @param community_group_type_id the community group type id
   * @returns array of income types for caregivers in this community group
   */
  async getIncomeTypesByGroupType(community_group_type_id: number): Promise<any[] | null> {
    try {
      const { data, error } = await this.supabase
        .from('community_group_type')
        .select(`
          *,
          caregiver_groups!inner (
            caregivers!inner (
              income_type (
                *
              )
            )
          )
        `)
        .eq('id', community_group_type_id);

      if (error) {
        console.error('Error fetching income types by group type:', error);
        return null;
      }

      // Flatten the nested structure
      const incomeTypes = data.flatMap(group => 
        group.caregiver_groups?.flatMap(cg => 
          cg.caregivers?.income_type || []
        ) || []
      );

      return incomeTypes;
    } catch (err) {
      console.error('Database query error:', err);
      return null;
    }
  }

  /**
   * Gets community group type with all associated data (caregivers, income types, etc.)
   * @param community_group_type_id the community group type id
   * @returns community group type with full relationship data
   */
  async getFullGroupTypeData(community_group_type_id: number): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('community_group_type')
        .select(`
          *,
          caregiver_groups (
            date_joined,
            date_left,
            caregivers (
              id,
              contact_number,
              email,
              facebook_link,
              occupation,
              members (
                first_name,
                last_name,
                middle_name,
                sex,
                birthday
              ),
              income_type (
                *
              )
            )
          )
        `)
        .eq('id', community_group_type_id)
        .single();

      if (error) {
        console.error('Error fetching full group type data:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Database query error:', err);
      return null;
    }
  }
}