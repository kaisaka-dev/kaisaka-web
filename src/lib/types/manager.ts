

// https://svatasimara.medium.com/domain-driven-design-part-5-repository-d5ad32b2e06f

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { supabase } from "./client.js";

export type filterBuilder = PostgrestFilterBuilder<any, any, any> 

export type filterFunction = (query: filterBuilder) => filterBuilder

/**
 * 
 * @param table table name to be managed
 * @returns A Table Manager class
 */
export default function TableManager<T>(table: string){
  class TableManager<T> {
    private table = table;
    
    protected get_query(): filterBuilder {
      return supabase.from(this.table).select('*');
    }

    protected insert_query(object: any): filterBuilder {
      return supabase.from(this.table).insert(object);
    }

    protected update_query(object: any): filterBuilder {
      return supabase.from(this.table).update(object);
    }

    protected async find_many(match: Partial<T> = {}): Promise<T[]|null>{
      const {data, error} = await this.get_query()
        .match(match);

      if (error) return null;

      return data as T[];
    }

    protected async find_one(match: Partial<T>): Promise<T | null> {
      const {data, error} = await this.get_query()
        .match(match)
        .single();

      if (error) return null;

      return data as T;
    }

    protected build(filterFn: filterFunction): filterBuilder {
      return filterFn ? filterFn(this.get_query()): this.get_query();
    }

    protected async find_one_with_filter(filter: filterFunction): Promise<T|null>{
      let query = this.get_query();
      
      query = filter(query);

      const { data, error } = await query.single();

      if (error) return null;

      return data as T;
    }

    protected async delete_one(match: Partial<T>): Promise<T | null> {
      const { data, error } = await supabase
        .from(this.table)
        .delete()
        .match(match)
        .select()
        .single();
      if (error) return null;
      return data as T;
    }

    // Insert many
    protected async insert_many(objects: Partial<T>[]): Promise<boolean> {
      const { error } = await this.insert_query(objects);

      return !error;
    }

    // Insert one
    protected async insert_one(object: Partial<T>): Promise<string | null> {
      const { data, error } = await this.insert_query(object)

      if (error || !data) return null;
      return (data as any).id;
    }

    protected async update_one(match: Partial<T>, updates: Partial<T>) {
      const { error } = await this.update_query(updates).match(match).limit(1);

      return !error
    }

    protected async count(){
      const { data, error } = await supabase
        .from(this.table)
        .select('*', { count: 'exact', head: true});
      
      if (error) throw new Error(error.message)

      return data ?? 0;
    }
  }

  return TableManager<T>;
}