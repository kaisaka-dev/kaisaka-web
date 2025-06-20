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

  async findByName(name: string): Promise<CaregiverRow[] | null> {
    return this.findMany({ name })
  }

}