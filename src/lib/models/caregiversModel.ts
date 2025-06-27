import TableManager, { type tableRow } from '../types/manager.js';

type CaregiverRow = tableRow<"caregivers">

/**
 * A model concerning about CRUD operations on *recognized caregivers of kaisaka*. 
 * 
 * Made for the `caregivers` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class CaregiversModel extends TableManager<"caregivers">('caregivers') {
  public static instance: CaregiversModel = new CaregiversModel();

  /**
   * Creates a new caregiver record
   * @param member_id the unique id of the member who is the caregiver
   * @param contact_number contact number of the caregiver (optional)
   * @param facebook_link Facebook profile link (optional)
   * @param email email address of the caregiver (optional)
   * @param occupation occupation of the caregiver (optional)
   * @param remarks additional remarks (optional)
   * @returns created caregiver record or null
   */
  async insertCaregiver(
    member_id: string,
    contact_number?: string | null,
    facebook_link?: string | null,
    email?: string | null,
    occupation?: string | null,
    remarks?: string | null
  ): Promise<CaregiverRow | null> {
    const caregiver: Partial<CaregiverRow> = {
      member_id,
      contact_number: contact_number || null,
      facebook_link: facebook_link || null,
      email: email || null,
      occupation: occupation || null,
      remarks: remarks || null
    };
    
    return this.insertOne(caregiver);
  }

  /**
   * Finds a caregiver by their unique id
   * @param id the unique id of the caregiver
   * @returns caregiver record or null
   */
  async findById(id: string): Promise<CaregiverRow | null> {
    return this.findOne({ id });
  }

  /**
   * Finds a caregiver by their member id
   * @param member_id the unique id of the member
   * @returns caregiver record or null
   */
  async findByMemberId(member_id: string): Promise<CaregiverRow | null> {
    return this.findOne({ member_id });
  }

  /**
   * Finds caregivers by contact number
   * @param contact_number the contact number to search for
   * @returns array of caregiver records or null
   */
  async findByContactNumber(contact_number: string): Promise<CaregiverRow[] | null> {
    return this.findMany({ contact_number });
  }

  /**
   * Finds caregivers by email address
   * @param email the email address to search for
   * @returns array of caregiver records or null
   */
  async findByEmail(email: string): Promise<CaregiverRow[] | null> {
    return this.findMany({ email });
  }

  /**
   * Finds caregivers by occupation
   * @param occupation the occupation to search for
   * @returns array of caregiver records or null
   */
  async findByOccupation(occupation: string): Promise<CaregiverRow[] | null> {
    return this.findMany({ occupation });
  }

  /**
   * Finds caregivers by Facebook link
   * @param facebook_link the Facebook link to search for
   * @returns array of caregiver records or null
   */
  async findByFacebookLink(facebook_link: string): Promise<CaregiverRow[] | null> {
    return this.findMany({ facebook_link });
  }

  /**
   * Gets all caregiver records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns array of all caregiver records corresponding to the filters or null
   */
  async getAll(filter?: Partial<CaregiverRow>): Promise<CaregiverRow[] | null> {
    return this.findMany(filter);
  }

  /**
   * Updates the contact number for a caregiver
   * @param id the unique id of the caregiver
   * @param contact_number the new contact number
   * @returns boolean if update is successful
   */
  async updateContactNumber(id: string, contact_number: string): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    const updates: Partial<CaregiverRow> = { contact_number };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the Facebook link for a caregiver
   * @param id the unique id of the caregiver
   * @param facebook_link the new Facebook link
   * @returns boolean if update is successful
   */
  async updateFacebookLink(id: string, facebook_link: string): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    const updates: Partial<CaregiverRow> = { facebook_link };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the email address for a caregiver
   * @param id the unique id of the caregiver
   * @param email the new email address
   * @returns boolean if update is successful
   */
  async updateEmail(id: string, email: string): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    const updates: Partial<CaregiverRow> = { email };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the occupation for a caregiver
   * @param id the unique id of the caregiver
   * @param occupation the new occupation
   * @returns boolean if update is successful
   */
  async updateOccupation(id: string, occupation: string): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    const updates: Partial<CaregiverRow> = { occupation };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates the remarks for a caregiver
   * @param id the unique id of the caregiver
   * @param remarks the new remarks
   * @returns boolean if update is successful
   */
  async updateRemarks(id: string, remarks: string): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    const updates: Partial<CaregiverRow> = { remarks };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates contact information for a caregiver
   * @param id the unique id of the caregiver
   * @param updates the contact fields to update
   * @returns boolean if update is successful
   */
  async updateContactInfo(
    id: string,
    updates: Partial<Pick<CaregiverRow, 
      'contact_number' | 'facebook_link' | 'email'
    >>
  ): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Updates multiple fields for a caregiver
   * @param id the unique id of the caregiver
   * @param updates the fields to update
   * @returns boolean if update is successful
   */
  async updateCaregiver(
    id: string,
    updates: Partial<Pick<CaregiverRow, 
      'contact_number' | 'facebook_link' | 'email' | 'occupation' | 'remarks'
    >>
  ): Promise<boolean> {
    const reference: Partial<CaregiverRow> = { id };
    
    return this.updateOne(reference, updates);
  }

  /**
   * Deletes a caregiver record by their unique id
   * @param id the unique id of the caregiver
   * @returns boolean if delete is successful
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this.deleteOne({id});
    return result !== null;
  }

  /**
   * Deletes a caregiver record by their member id
   * @param member_id the unique id of the member
   * @returns boolean if delete is successful
   */
  async deleteByMemberId(member_id: string): Promise<boolean> {
    const result = await this.deleteOne({member_id});
    return result !== null;
  }
}