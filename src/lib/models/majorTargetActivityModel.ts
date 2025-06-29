import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *major_target_activity*. 
 * 
 * Made for the `major_target_activity` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type MajorTargetActivityRow = tableRow<"major_target_activity">

export class MajorTargetActivityModel extends TableManager<"major_target_activity">('major_target_activity') {
  public static instance: MajorTargetActivityModel = new MajorTargetActivityModel();

  /**
   * Inserts a new major target activity
   * @param name activity name
   * @param type activity type
   * @param service_objective_id id of the service objective
   * @param target_no_of_participants target number of participants
   * @param date_and_time_last_updated last updated timestamp
   * @param remarks additional remarks
   * @returns created major target activity record or null
   */
  async insertMajorTargetActivity(
    name: string,
    type: string,
    service_objective_id: number,
    target_no_of_participants: number,
    date_and_time_last_updated: string,
    remarks?: string | null
  ): Promise<MajorTargetActivityRow | null>{
    const new_major_target_activity : Partial<MajorTargetActivityRow> = { 
      name,
      type,
      service_objective_id,
      target_no_of_participants,
      date_and_time_last_updated,
      remarks
    }
    const data  = await this.insertOne(new_major_target_activity)

    return data
  }

  /**
   * Finds a major target activity by its unique id
   * @param id the unique id of the major target activity
   * @returns the major target activity instance with said unique id
   */
  async findById(id: number): Promise<MajorTargetActivityRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds major target activities by name
   * @param name activity name
   * @returns array of major target activities with the given name
   */
  async findByName(name: string): Promise<MajorTargetActivityRow[] | null>{
    return this.findMany({ name: name })
  }

  /**
   * Finds major target activities by type
   * @param type activity type
   * @returns array of major target activities with the given type
   */
  async findByType(type: string): Promise<MajorTargetActivityRow[] | null>{
    return this.findMany({ type: type })
  }

  /**
   * Finds major target activities by service objective id
   * @param service_objective_id the unique id of the service objective
   * @returns array of major target activities with the given service objective id
   */
  async findByServiceObjectiveId(service_objective_id: number): Promise<MajorTargetActivityRow[] | null>{
    return this.findMany({ service_objective_id: service_objective_id })
  }

  /**
   * Update major target activity record's name
   * @param id the unique id of the major target activity in the DB
   * @param name the updated name to be applied
   * @returns boolean if update is successful or not
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<MajorTargetActivityRow> = { id: id }
    const updates: Partial<MajorTargetActivityRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update major target activity record's target number of participants
   * @param id the unique id of the major target activity in the DB
   * @param target_no_of_participants the updated target number of participants
   * @returns boolean if update is successful or not
   */
  async updateTargetParticipants(id: number, target_no_of_participants: number): Promise<boolean>{
    const reference: Partial<MajorTargetActivityRow> = { id: id }
    const updates: Partial<MajorTargetActivityRow> = { target_no_of_participants: target_no_of_participants }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update major target activity record's remarks
   * @param id the unique id of the major target activity in the DB
   * @param remarks the updated remarks to be applied
   * @returns boolean if update is successful or not
   */
  async updateRemarks(id: number, remarks: string | null): Promise<boolean>{
    const reference: Partial<MajorTargetActivityRow> = { id: id }
    const updates: Partial<MajorTargetActivityRow> = { remarks: remarks }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes a major target activity record given its id
   * @param id the unique id of the major target activity in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }
}