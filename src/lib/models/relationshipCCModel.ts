import TableManager, { type tableRow } from '../types/manager.js';

type RelationshipCCRow = tableRow<"relationship_cc">

/**
 * A model concerning about CRUD operations on the relationships between children and caregivers. 
 * 
 * Made for the `relationship_cc` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class relationshipCCModel extends TableManager<"relationship_cc">('relationship_cc') {
  public static instance: relationshipCCModel = new relationshipCCModel();
  
  /**
   * Finds relationships by caregiver ID
   * @param caregiver Caregiver's UUID
   * @returns relationship record or null
   */
  async findByCaregiver(caregiver: string) {
    return this.findOne({ caregiver });
  }

  /**
   * Finds relationships by child ID
   * @param child Child's UUID
   * @returns array of relationship records or null
   */
  async findByChild(child: string) {
    return this.findMany({ child });
  }

  /**
   * Finds relationships by relationship type
   * @param relationship Relationship type (varchar)
   * @returns array of relationship records or null
   */
  async findByRelationship(relationship: string) {
    return this.findMany({ relationship });
  }

  /**
   * Inserts a new caregiver-child relationship
   * @param relationshipData Complete relationship data
   * @returns created relationship record or null
   */
  async insertRelationship(relationshipData: Omit<RelationshipCCRow, 'caregiver'> & { caregiver: string }) {
    return this.insertOne(relationshipData);
  }

  /**
   * Updates relationship type for a caregiver-child pair
   * @param caregiver Caregiver's UUID
   * @param newRelationship New relationship type
   * @returns boolean success indicator
   */
  async updateRelationshipType(caregiver: string, newRelationship: string) {
    const references: Partial<RelationshipCCRow> = { caregiver };
    const updates: Partial<RelationshipCCRow> = { relationship: newRelationship };
    return this.updateOne(references, updates);
  }

  /**
   * Updates child reference for a caregiver
   * @param caregiver Caregiver's UUID
   * @param newChild New child UUID
   * @returns boolean success indicator
   */
  async updateChildForCaregiver(caregiver: string, newChild: string) {
    const references: Partial<RelationshipCCRow> = { caregiver };
    const updates: Partial<RelationshipCCRow> = { child: newChild };
    return this.updateOne(references, updates);
  }

  /**
   * Deletes a caregiver-child relationship
   * @param caregiver Caregiver's UUID
   * @returns boolean success indicator
   */
  async deleteRelationship(caregiver: string) {
    const references: Partial<RelationshipCCRow> = { caregiver };
    const result = await this.deleteOne(references);
    return result !== null;
  }
}