import TableManager, { type tableRow } from '../types/manager.js';

type FamilyMembersRow = tableRow<"family_members">

/**
 * A model concerning about CRUD operations on family member relationships. 
 * 
 * Made for the `family_members` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class FamilyMembersModel extends TableManager<"family_members">('family_members') {
  public static instance: FamilyMembersModel = new FamilyMembersModel();
  
  /**
   * Adds a member to a family
   * @param family_id the unique id of the family
   * @param member_id the unique id of the member
   * @param is_child boolean indicating if the member is a child
   * @param relationship_type the relationship type (optional)
   * @returns created family member record or null
   */
  async insertFamilyMember(
    family_id: string, 
    member_id: string, 
    is_child: boolean, 
    relationship_type?: string | null
  ): Promise<FamilyMembersRow | null> {
    const now = new Date().toISOString();
    const familyMember: Partial<FamilyMembersRow> = {
      family_id,
      member_id,
      is_child,
      relationship_type: relationship_type || null,
      date_added: now
    };
    
    return this.insertOne(familyMember);
  }

  /**
   * Finds all members of a specific family
   * @param family_id the unique id of the family
   * @returns array of family member records or null
   */
  async findByFamilyId(family_id: string): Promise<FamilyMembersRow[] | null> {
    return this.findMany({ family_id });
  }

  /**
   * Finds all families a specific member belongs to
   * @param member_id the unique id of the member
   * @returns array of family member records or null
   */
  async findByMemberId(member_id: string): Promise<FamilyMembersRow[] | null> {
    return this.findMany({ member_id });
  }

  /**
   * Finds family members by relationship type
   * @param relationship_type the relationship type to search for
   * @returns array of family member records or null
   */
  async findByRelationshipType(relationship_type: string): Promise<FamilyMembersRow[] | null> {
    return this.findMany({ relationship_type });
  }

  /**
   * Finds children in a specific family
   * @param family_id the unique id of the family
   * @returns array of child family member records or null
   */
  async findChildrenByFamilyId(family_id: string): Promise<FamilyMembersRow[] | null> {
    return this.findMany({ family_id, is_child: true });
  }

  /**
   * Finds adults in a specific family
   * @param family_id the unique id of the family
   * @returns array of adult family member records or null
   */
  async findAdultsByFamilyId(family_id: string): Promise<FamilyMembersRow[] | null> {
    return this.findMany({ family_id, is_child: false });
  }

  /**
   * Updates the relationship type for a family member
   * @param family_id the unique id of the family
   * @param member_id the unique id of the member
   * @param relationship_type the new relationship type
   * @returns boolean if update is successful
   */
  async updateRelationshipType(
    family_id: string, 
    member_id: string, 
    relationship_type: string
  ): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { family_id, member_id };
    const updates: Partial<FamilyMembersRow> = { relationship_type };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the child status for a family member
   * @param family_id the unique id of the family
   * @param member_id the unique id of the member
   * @param is_child boolean indicating if the member is a child
   * @returns boolean if update is successful
   */
  async updateChildStatus(
    family_id: string, 
    member_id: string, 
    is_child: boolean
  ): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { family_id, member_id };
    const updates: Partial<FamilyMembersRow> = { is_child };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates multiple fields for a family member
   * @param family_id the unique id of the family
   * @param member_id the unique id of the member
   * @param updates the fields to update
   * @returns boolean if update is successful
   */
  async updateFamilyMember(
    family_id: string, 
    member_id: string, 
    updates: Partial<Pick<FamilyMembersRow, 'is_child' | 'relationship_type'>>
  ): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { family_id, member_id };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Removes a member from a family
   * @param family_id the unique id of the family
   * @param member_id the unique id of the member
   * @returns boolean if delete is successful
   */
  async removeFamilyMember(family_id: string, member_id: string): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { family_id, member_id };
    const result = await this.deleteOne(reference);
    return result !== null;
  }

  /**
   * Removes all members from a family
   * @param family_id the unique id of the family
   * @returns boolean if delete is successful
   */
  async removeAllFamilyMembers(family_id: string): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { family_id };
    const result = await this.deleteOne(reference);
    return result !== null;
  }

  /**
   * Removes a member from all families
   * @param member_id the unique id of the member
   * @returns boolean if delete is successful
   */
  async removeMemberFromAllFamilies(member_id: string): Promise<boolean> {
    const reference: Partial<FamilyMembersRow> = { member_id };
    const result = await this.deleteOne(reference);
    return result !== null;
  }

  async getOneJoin(select: string, filters: Record<string, string | number>): Promise<FamilyMembersRow | null> {
    return await this.findOneWithJoin(select, filters );
  }

  async getMultipleJoin(select: string, filters: Record<string, string | number>): Promise<FamilyMembersRow[] | null> {
    return await this.findWithJoin(select, filters );
  }

  /**
   * Gets family members with detailed information including names and contact info
   * @param family_id optional family id to filter by
   * @returns array of family members with details or null
   */
  async getFamilyMembersWithDetails(family_id?: string): Promise<any[] | null> {
    const joinStatement = `
      family_id,
      member_id, 
      relationship_type,
      is_child,
      date_added,
      members!inner(
        first_name,
        last_name,
        caregivers(
          contact_number
        )
      )
    `;
    
    if (family_id) {
      return this.findWithJoin(joinStatement, { eq: { family_id } });
    } else {
      return this.findWithJoin(joinStatement);
    }
  }
}