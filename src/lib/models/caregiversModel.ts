import TableManager, { type tableRow } from '../types/manager.js';




type CaregiverRow = tableRow<"caregivers">
export class CaregiversModel extends TableManager<"caregivers">('caregivers') {
  public static instance: CaregiversModel = new CaregiversModel();

  async findByName(name: string): Promise<CaregiverRow[] | null> {
    return this.findMany({name})
  }
}

