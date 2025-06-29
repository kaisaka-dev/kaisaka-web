import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *attendance_log*. 
 * 
 * Made for the `attendance_log` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type AttendanceLogRow = tableRow<"attendance_log">

export class AttendanceLogModel extends TableManager<"attendance_log">('attendance_log') {
  public static instance: AttendanceLogModel = new AttendanceLogModel();

  /**
   * Inserts a new attendance log entry
   * @param conducted_activity_id id of the conducted activity
   * @param participant_id id of the participant
   * @param is_late whether the participant was late
   * @param participant_type type of participant (caregiver or child)
   * @param individual_intervention_plan whether individual intervention plan applies
   * @param transition_graduation_plan whether transition graduation plan applies
   * @param remarks additional remarks
   * @returns created attendance log record or null
   */
  async insertAttendanceLog(
    conducted_activity_id: number,
    participant_id: string,
    is_late: boolean = false,
    participant_type?: string | null,
    individual_intervention_plan?: boolean | null,
    transition_graduation_plan?: boolean | null,
    remarks?: string | null
  ): Promise<AttendanceLogRow | null>{
    const new_attendance_log : Partial<AttendanceLogRow> = { 
      conducted_activity_id,
      participant_id,
      is_late,
      participant_type,
      individual_intervention_plan,
      transition_graduation_plan,
      remarks
    }
    const data  = await this.insertOne(new_attendance_log)

    return data
  }

  /**
   * Finds an attendance log by its unique id
   * @param id the unique id of the attendance log
   * @returns the attendance log instance with said unique id
   */
  async findById(id: number): Promise<AttendanceLogRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds attendance logs by conducted activity id
   * @param conducted_activity_id the unique id of the conducted activity
   * @returns array of attendance logs for the given activity
   */
  async findByConductedActivityId(conducted_activity_id: number): Promise<AttendanceLogRow[] | null>{
    return this.findMany({ conducted_activity_id: conducted_activity_id })
  }

  /**
   * Finds attendance logs by participant id
   * @param participant_id the unique id of the participant
   * @returns array of attendance logs for the given participant
   */
  async findByParticipantId(participant_id: string): Promise<AttendanceLogRow[] | null>{
    return this.findMany({ participant_id: participant_id })
  }

  /**
   * Finds attendance logs by participant type
   * @param participant_type the type of participant
   * @returns array of attendance logs for the given participant type
   */
  async findByParticipantType(participant_type: string): Promise<AttendanceLogRow[] | null>{
    return this.findMany({ participant_type: participant_type })
  }

  /**
   * Finds attendance logs for late participants
   * @returns array of attendance logs where participants were late
   */
  async findLateAttendances(): Promise<AttendanceLogRow[] | null>{
    return this.findMany({ is_late: true })
  }

  /**
   * Update attendance log record's late status
   * @param id the unique id of the attendance log in the DB
   * @param is_late the updated late status to be applied
   * @returns boolean if update is successful or not
   */
  async updateLateStatus(id: number, is_late: boolean): Promise<boolean>{
    const reference: Partial<AttendanceLogRow> = { id: id }
    const updates: Partial<AttendanceLogRow> = { is_late: is_late }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update attendance log record's remarks
   * @param id the unique id of the attendance log in the DB
   * @param remarks the updated remarks to be applied
   * @returns boolean if update is successful or not
   */
  async updateRemarks(id: number, remarks: string | null): Promise<boolean>{
    const reference: Partial<AttendanceLogRow> = { id: id }
    const updates: Partial<AttendanceLogRow> = { remarks: remarks }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes an attendance log record given its id
   * @param id the unique id of the attendance log in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }
}