import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *activity*. 
 * 
 * Made for the `activity` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type ActivityRow = tableRow<"activity">

export class ActivityModel extends TableManager<"activity">('activity') {
  public static instance: ActivityModel = new ActivityModel();

  /**
   * Inserts a new activity
   * @param name activity name
   * @param type activity type
   * @param target_activity_id id of the target activity
   * @param date_and_time_conducted when the activity was conducted
   * @param completion_staus completion status of the activity
   * @param indicators activity indicators
   * @param outcome activity outcome
   * @param remarks additional remarks
   * @returns created activity record or null
   */
  async insertActivity(
    name: string, 
    type: string, 
    target_activity_id: number,
    date_and_time_conducted: string,
    completion_staus?: string | null,
    indicators?: string | null,
    outcome?: string | null,
    remarks?: string | null
  ): Promise<ActivityRow | null>{
    const new_activity : Partial<ActivityRow> = { 
      name, 
      type, 
      target_activity_id,
      date_and_time_conducted,
      completion_staus,
      indicators,
      outcome,
      remarks
    }
    const data  = await this.insertOne(new_activity)

    return data
  }

  /**
   * Finds an activity by its unique id
   * @param id the unique id of the activity
   * @returns the activity instance with said unique id
   */
  async findById(id: number): Promise<ActivityRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds activities by name
   * @param name activity name
   * @returns array of activities with the given name
   */
  async findByName(name: string): Promise<ActivityRow[] | null>{
    return this.findMany({ name: name })
  }

  /**
   * Finds activities by type
   * @param type activity type
   * @returns array of activities with the given type
   */
  async findByType(type: string): Promise<ActivityRow[] | null>{
    return this.findMany({ type: type })
  }

  /**
   * Finds activities by target activity id
   * @param target_activity_id the unique id of the target activity
   * @returns array of activities with the given target activity id
   */
  async findByTargetActivityId(target_activity_id: number): Promise<ActivityRow[] | null>{
    return this.findMany({ target_activity_id: target_activity_id })
  }

  /**
   * Update activity record's name
   * @param id the unique id of the activity in the DB
   * @param name the updated name to be applied
   * @returns boolean if update is successful or not
   */
  async updateName(id: number, name: string): Promise<boolean>{
    const reference: Partial<ActivityRow> = { id: id }
    const updates: Partial<ActivityRow> = { name: name }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update activity record's completion status
   * @param id the unique id of the activity in the DB
   * @param completion_staus the updated completion status to be applied
   * @returns boolean if update is successful or not
   */
  async updateCompletionStatus(id: number, completion_staus: string | null): Promise<boolean>{
    const reference: Partial<ActivityRow> = { id: id }
    const updates: Partial<ActivityRow> = { completion_staus: completion_staus }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update activity record's outcome
   * @param id the unique id of the activity in the DB
   * @param outcome the updated outcome to be applied
   * @returns boolean if update is successful or not
   */
  async updateOutcome(id: number, outcome: string | null): Promise<boolean>{
    const reference: Partial<ActivityRow> = { id: id }
    const updates: Partial<ActivityRow> = { outcome: outcome }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes an activity record given its id
   * @param id the unique id of the activity in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }
}