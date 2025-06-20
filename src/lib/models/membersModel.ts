import TableManager, { type tableRow } from '../types/manager.js';

type MembersRow = tableRow<"members">

export class membersModel extends TableManager<"members">('members') {
  public static instance: membersModel = new membersModel();
  
  /**
   * Finds members by first name
   * @param first_name 
   * @returns array of members or null
   */
  async findByFirstName(first_name: string): Promise<MembersRow[] | null> {
    return this.findMany({ first_name });
  }

  /**
   * Finds members by last name
   * @param last_name 
   * @returns array of members or null
   */
  async findByLastName(last_name: string): Promise<MembersRow[] | null> {
    return this.findMany({ last_name });
  }

  /**
   * Finds members by birthdate
   * @param birthday 
   * @returns array of members or null
   */
  async findByBirthday(birthday: string): Promise<MembersRow[] | null> {
    return this.findMany({ birthday });
  }

  /**
   * Inserts a new member record
   * @param memberData Partial member data (id is auto-generated)
   * @returns created member record or null
   */
  async insertMember(memberData: Omit<MembersRow, 'id'>): Promise<MembersRow | null> {
    const data = await this.insertOne(memberData);
    return data;
  }

  /**
   * Updates member's basic information
   * @param id member ID (UUID)
   * @param updates partial member data to update
   * @returns updated member record or null
   */
  async updateMemberInfo(
    id: string, 
    updates: Partial<Pick<MembersRow, 
      'first_name' | 'middle_name' | 'last_name' | 'birthday' | 'sex'
    >>
  ): Promise<boolean> {
    const references: Partial<MembersRow> = { id };
    const data = await this.updateOne(references, updates);
    return data;
  }

  /**
   * Updates member's address reference
   * @param id member ID (UUID)
   * @param address_id new address ID (UUID)
   * @returns updated member record or null
   */
  async updateAddress(id: string, address_id: string): Promise<boolean> {
    const references: Partial<MembersRow> = { id };
    const updates: Partial<MembersRow> = { address_id };
    const data = await this.updateOne(references, updates);
    return data;
  }

  /**
   * Updates admission date
   * @param id member ID (UUID)
   * @param admission_date new admission date
   * @returns updated member record or null
   */
  async updateAdmissionDate(id: string, admission_date: string): Promise<boolean> {
    const references: Partial<MembersRow> = { id };
    const updates: Partial<MembersRow> = { admission_date };
    const data = await this.updateOne(references, updates);
    return data;
  }
}
