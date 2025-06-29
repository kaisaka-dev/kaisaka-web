import TableManager, { type tableRow } from '../types/manager.js';

/**
 * A model concerning about CRUD operations on *service_objective*. 
 * 
 * Made for the `service_objective` API. 
 * 
 * **Reference**: Database Model `src/lib/models/db.md`
 */
type ServiceObjectiveRow = tableRow<"service_objective">

export class ServiceObjectiveModel extends TableManager<"service_objective">('service_objective') {
  public static instance: ServiceObjectiveModel = new ServiceObjectiveModel();

  /**
   * Inserts a new service objective
   * @param annual_program_id id of the annual program
   * @param service_category_id id of the service category
   * @param objective_description description of the objective
   * @returns created service objective record or null
   */
  async insertServiceObjective(
    annual_program_id: number,
    service_category_id: number,
    objective_description: string
  ): Promise<ServiceObjectiveRow | null>{
    const new_service_objective : Partial<ServiceObjectiveRow> = { 
      annual_program_id,
      service_category_id,
      objective_description
    }
    const data  = await this.insertOne(new_service_objective)

    return data
  }

  /**
   * Finds a service objective by its unique id
   * @param id the unique id of the service objective
   * @returns the service objective instance with said unique id
   */
  async findById(id: number): Promise<ServiceObjectiveRow | null>{
    return this.findOne({ id: id })
  }

  /**
   * Finds service objectives by annual program id
   * @param annual_program_id the unique id of the annual program
   * @returns array of service objectives for the given annual program
   */
  async findByAnnualProgramId(annual_program_id: number): Promise<ServiceObjectiveRow[] | null>{
    return this.findMany({ annual_program_id: annual_program_id })
  }

  /**
   * Finds service objectives by service category id
   * @param service_category_id the unique id of the service category
   * @returns array of service objectives for the given service category
   */
  async findByServiceCategoryId(service_category_id: number): Promise<ServiceObjectiveRow[] | null>{
    return this.findMany({ service_category_id: service_category_id })
  }

  /**
   * Finds service objectives by objective description (partial match)
   * @param description_keyword keyword to search in objective description
   * @returns array of service objectives matching the description keyword
   */
  async findByDescriptionKeyword(description_keyword: string): Promise<ServiceObjectiveRow[] | null>{
    // Note: This would require a custom query for partial text matching
    // For now, returning exact matches
    return this.findMany({ objective_description: description_keyword })
  }

  /**
   * Update service objective record's description
   * @param id the unique id of the service objective in the DB
   * @param objective_description the updated description to be applied
   * @returns boolean if update is successful or not
   */
  async updateObjectiveDescription(id: number, objective_description: string): Promise<boolean>{
    const reference: Partial<ServiceObjectiveRow> = { id: id }
    const updates: Partial<ServiceObjectiveRow> = { objective_description: objective_description }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update service objective record's service category
   * @param id the unique id of the service objective in the DB
   * @param service_category_id the updated service category id to be applied
   * @returns boolean if update is successful or not
   */
  async updateServiceCategoryId(id: number, service_category_id: number): Promise<boolean>{
    const reference: Partial<ServiceObjectiveRow> = { id: id }
    const updates: Partial<ServiceObjectiveRow> = { service_category_id: service_category_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Update service objective record's annual program
   * @param id the unique id of the service objective in the DB
   * @param annual_program_id the updated annual program id to be applied
   * @returns boolean if update is successful or not
   */
  async updateAnnualProgramId(id: number, annual_program_id: number): Promise<boolean>{
    const reference: Partial<ServiceObjectiveRow> = { id: id }
    const updates: Partial<ServiceObjectiveRow> = { annual_program_id: annual_program_id }
    const data = await this.updateOne(reference, updates)

    return data
  }

  /**
   * Deletes a service objective record given its id
   * @param id the unique id of the service objective in the DB
   * @returns boolean if delete is successful or not
   */
  async deleteById(id: number): Promise<boolean>{
    const result = await this.deleteOne({ id: id });
    return result !== null;
  }
}