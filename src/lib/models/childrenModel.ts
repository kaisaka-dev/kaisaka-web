import TableManager, { type tableRow } from '../types/manager.js';

type ChildrenRow = tableRow<"children">

/**
 * A model concerning about CRUD operations on *children information*. 
 * 
 * Made for the `children` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
export class ChildrenModel extends TableManager<"children">('children') {
  public static instance: ChildrenModel = new ChildrenModel();

  /**
   * Creates a new child record in the DB.
   * @param has_barangay_cert boolean if child's barangay certificate is submitted.
   * @param has_birth_cert boolean if child's birth certificate is submitted.
   * @param has_medical_cert boolean if child's medical certificate is submitted.
   * @param is_active boolean if child is active in the organization
   * @param member_id member id of child
   * @param philhealth_id philhealth id of child
   * @param pwd_id pwd id of child
   * @param disability_id disability category id (optional)
   * @param disability_nature description of disability nature (optional)
   * @param remarks additional remarks of child
   * @returns created child record
   */
  async insertChild (
    has_barangay_cert: boolean, 
    has_birth_cert: boolean, 
    has_medical_cert: boolean, 
    is_active: boolean, 
    member_id: string, 
    philhealth_id: string | null, 
    pwd_id: string | null, 
    disability_id: number | null,
    disability_nature: string | null,
    remarks: string | null 
  ): Promise<ChildrenRow | null>{
      const has_philhealth = philhealth_id ? true : false

      const child: Partial<ChildrenRow> = {
        has_barangay_cert: has_barangay_cert, 
        has_birth_cert: has_birth_cert, 
        has_medical_cert: has_medical_cert, 
        has_philhealth: has_philhealth,
        is_active: is_active, 
        member_id: member_id, 
        philhealth_id: philhealth_id, 
        pwd_id: pwd_id, 
        disability_id: disability_id,
        disability_nature: disability_nature,
        remarks: remarks
      }
      console.log("inserting: ", child);
      const data = await this.insertOne(child);
      return data
  }

  /**
   * Finds a specific child given their ID
   * @param id unique id of the child in the DB
   * @returns child data corresponding the id
   */
  async findById(id: string): Promise<ChildrenRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds a specific child given their member id.
   * @param member_id unique member id of the child in the DB
   * @returns child data corresponding the member id
   */
  async findByMemberId(member_id: string): Promise<ChildrenRow | null>{
    return this.findOne({ member_id: member_id })
  }

  /**
   * Finds all children with a specific disability
   * @param disability_id unique id of the disability category
   * @returns array of children with the specified disability
   */
  async findByDisabilityId(disability_id: number): Promise<ChildrenRow[] | null>{
    return this.findMany({ disability_id: disability_id })
  }

  /**
   * Finds all children that are currently active in the organization.
   * @returns child data with is_active set as "true"
   */
  async findActiveChildren(): Promise<ChildrenRow[] | null>{
    return this.findMany({ is_active: true })
  }

  /**
   * Gets all children records with given (or no) filters
   * @param filter filter to be applied to the query (optional)
   * @returns an array of all children records corresponding to the filters or null
   */
  async getAll(filter?: Partial<ChildrenRow>): Promise<ChildrenRow[] | null> {
    return this.findMany(filter);
  }

  /**
   * Updates the child's barangay certificate status
   * @param id unique id of the child in the DB
   * @param has_barangay_cert boolean if child's barangay certificate is submitted.
   * @returns boolean if update is successful.
   */
  async updateBarangayCert(id: string, has_barangay_cert: boolean): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_barangay_cert: has_barangay_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's birth certificate status
   * @param id unique id of the child in the DB
   * @param has_birth_cert boolean if child's birth certificate is submitted.
   * @returns boolean if update is successful.
   */
  async updateBirthCert(id: string, has_birth_cert: boolean): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_birth_cert: has_birth_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's medical certificate status
   * @param id unique id of the child in the DB
   * @param has_med_cert boolean if child's medical certificate is submitted.
   * @returns boolean if update is successful.
   */
  async updateMedCert(id: string, has_med_cert: boolean): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { has_medical_cert: has_med_cert}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's PhilHealth ID.
   * @param id unique id of the child in the DB
   * @param philhealth_id updated philhealth id to be applied
   * @returns boolean if update is successful.
   */
  async updatePhilHealthId(id: string, philhealth_id: string): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }

    const has_philhealth = philhealth_id ? true : false

    const updates: Partial<ChildrenRow> = { philhealth_id: philhealth_id, has_philhealth: has_philhealth}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's active status
   * @param id unique id of the child in the DB
   * @param is_active boolean if child is active in the organization
   * @returns boolean if update is successful.
   */
  async updateActiveStatus(id: string, is_active: boolean): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { is_active: is_active}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's PWD ID.
   * @param id unique id of the child in the DB
   * @param pwd_id the updated PWD ID to be applied
   * @returns boolean if update is successful.
   */
  async updatePwdId(id: string, pwd_id: string): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { pwd_id: pwd_id}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates the child's disability information
   * @param id unique id of the child in the DB
   * @param disability_id unique id of disability category
   * @param disability_nature description of disability nature
   * @returns boolean if update is successful.
   */
  async updateDisabilityInfo(id: string, disability_id: number | null, disability_nature: string | null): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { 
      disability_id: disability_id,
      disability_nature: disability_nature
    }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Updates child's remarks
   * @param id unique id of the child in the DB
   * @param remarks updated remarks to be applied
   * @returns boolean if update is successful.
   */
  async updateRemarks(id: string, remarks: string): Promise<boolean>{
    const reference: Partial<ChildrenRow> = { id: id }
    const updates: Partial<ChildrenRow> = { remarks: remarks}
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes a child record using their unique id
   * @param id unique id of the child in the DB
   * @returns boolean if delete is successful.
   */
  async deleteById(id: string): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }

  /**
   * Deletes a child record using their member id.
   * @param member_id member id of child
   * @returns boolean if delete is successful.
   */
  async deleteByMemberId(member_id: string): Promise<boolean>{
    const result = await this.deleteOne({ member_id: member_id });
    return result !== null;
  }
}