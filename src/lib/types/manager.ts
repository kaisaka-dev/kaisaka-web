import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { supabase } from "./client.js";
import type { Database } from "./supabase-types.js";

// All the names in the database
export type tableNames = keyof Database['public']['Tables'] 


// A generic row from Table T being object-like
export type tableRow<T extends tableNames> 
= Database['public']['Tables'][T]['Row'] & Record<string, unknown>

export type tableInsert<T extends tableNames>
= Database['public']['Tables'][T]['Insert']

export type tableUpdate<T extends tableNames>
= Database['public']['Tables'][T]['Update']

// Database query type for Table T
export type tableQuery<T extends tableNames> = PostgrestFilterBuilder<
  Database['public'], 
  tableRow<T>, 
  tableRow<T>
> 

// A function that modifies said tableQuery
export type filterFunction<
  T extends tableNames
> = (query: tableQuery<T>) => tableQuery<T>

/**
 * 
 * @param table table name to be managed
 * @returns A Table Manager class
 */
export default function TableManager<T extends tableNames>(table: string){
  type Row = tableRow<T>;

  type Query = tableQuery<T>;

  class TableManager<T> {
    private table = table;
  
    
    protected getQuery() {
      return supabase.from(this.table).select('*');
    }

    protected insertQuery(object: Partial<Query> | Partial<Query>[]){
      return supabase.from(this.table).insert(object);
    }

    protected updateQuery(object: Partial<Query>){
      return supabase.from(this.table).update(object);
    }

    protected async findOne(match: Partial<Row>): Promise<Row | null> {
      const {data, error} = await this.getQuery()
        .match(match)
        .single();

      if (error) return null;

      return data as Row;
    }

    protected async findMany(match: Partial<Row> = {}): Promise<Row[]|null>{
      const {data, error} = await this.getQuery()
        .match(match);

      if (error) return null;

      return data as Row[];
    }

 

    protected async insertOne(object: Partial<T>): Promise<string | null> {
      const { data, error } = await this.insertQuery(object)

      if (error || !data) return null;

      return data;
    }

    protected async insertMany(objects: Partial<T>[]): Promise<string | null> {
      const { error, data } = await this.insertQuery(objects);

      if (error || !data) return null;

      return data;
    }

    protected async updateOne(match: Partial<T>, updates: Partial<T>) {
      const { error } = await this.updateQuery(updates).match(match).limit(1);

      return !error
    }

    protected async deleteOne(match: Partial<Row>): Promise<T | null> {
      const { data, error } = await supabase
        .from(this.table)
        .delete()
        .match(match)
        .select()
        .single();
      if (error) return null;
      return data as T;
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