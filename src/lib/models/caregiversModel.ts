import { supabase } from '$lib/types/client.js';
import TableManager from '../types/manager.js';
import { Caregivers } from '../types/tableTypes.js';


export class CaregiversModel extends TableManager<Caregivers>('caregivers') {
  public static instance: CaregiversModel = new CaregiversModel();

  public async get_caregiver(id: number): Promise<Caregivers | null>{
    return this.find_one({id: id})
  }
}