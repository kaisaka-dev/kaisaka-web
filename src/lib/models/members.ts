import { supabase } from '$lib/types/client.js';
import TableManager from '../types/manager.js';
import { Caregivers, Members as Member } from '../types/tableTypes.js';


export class MembersModel extends TableManager<Member>('caregivers') {
  public static instance: MembersModel = new MembersModel();

  public async get_caregiver(id: number): Promise<Member | null>{
    return this.findOne({id: id})
  }

  public async get_caregivers(): Promise<Member[]>{
    return this.findMany()
  }
}