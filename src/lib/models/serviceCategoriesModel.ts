import TableManager, { type tableRow } from '../types/manager.js';


type ServiceCategoriesRow = tableRow<"service_categories">

export class ServiceCategoriesModel extends TableManager<"service_categories">('service_categories') {
  public static instance: ServiceCategoriesModel = new ServiceCategoriesModel();
  
  async insertServiceCategory(name: string){
    const service_category : Partial<ServiceCategoriesRow> = { name: name }
    const data  = await this.insertOne(service_category)

    return data
  }

  async getAll(){
    return this.findMany()
  }

  async findById(id: number){
    return this.findOne({ id:id })
  }
  async findByName(name: string){
    return this.findMany({ name: name })
  }

  async updateName(id: number, name: string){
    const reference: Partial<ServiceCategoriesRow> = { id: id }
    const updates: Partial<ServiceCategoriesRow> = { name: name}
    const data = await this.updateOne(reference, updates)

    return data
  }
}