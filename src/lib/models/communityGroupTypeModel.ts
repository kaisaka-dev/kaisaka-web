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
}