import { supabase } from "./supabase.js";
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
interface QueryConfig<T extends tableNames> {
  where?: Partial<tableRow<T>>;
  eq?: Record<string, string | number>;
  gt?: Record<string, number>;
  lt?: Record<string, number>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}

/**
 * 
 * @param table table name to be managed
 * @returns A Table Manager class
 */
export default function TableManager<T extends tableNames>(table: T){
  type Row = tableRow<T>;
  class TableManager {
    private table = table;
    
    protected getQuery() {
      return supabase.from(this.table).select('*');
    }

    protected insertQuery(object: Partial<Row> | Partial<Row>[]){
      return supabase.from(this.table).insert(object);
    }

    protected updateQuery(object: Partial<Row>){
      return supabase.from(this.table).update(object);
    }

    protected async findOne(match: Partial<Row>, config: Omit<QueryConfig<T>, 'where' | 'limit'> = {}): Promise<Row | null> {
      let query = this.getQuery()
        .match(match)
        

      if (config.eq) {
        Object.entries(config.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (config.gt) {
        Object.entries(config.gt).forEach(([key, value]) => {
          query = query.gt(key, value);
        });
      }
      
      if (config.order) {
        query = query.order(config.order.column, { ascending: config.order.ascending ?? true });
      }
      
      const {data, error} = await query.single();

      if (error) return null;

      return data as Row;
    }

    protected async findMany(match: Partial<Row> = {}, config: Omit<QueryConfig<T>, 'where'> = {}): Promise<Row[]|null>{
      let query = this.getQuery()
        .match(match);
      
      if (config.eq) {
        Object.entries(config.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (config.gt) {
        Object.entries(config.gt).forEach(([key, value]) => {
          query = query.gt(key, value);
        });
      }
      
      if (config.order) {
        query = query.order(config.order.column, { ascending: config.order.ascending ?? true });
      }
      
      if (config.limit) {
        query = query.limit(config.limit);
      }

      const {data, error} = await query

      if (error) return null;

      return data as Row[];
    }

    protected async insertOne(object: Partial<Row>): Promise<Row | null> {
      const { data, error } = await this.insertQuery(object).select().single()

      if (error || !data) return null;

      return data as Row;
    }

    protected async insertMany(objects: Partial<Row>[]): Promise<Row[] | null> {
      const { error, data } = await this.insertQuery(objects).select();

      if (error || !data) return null;

      return data as Row[];
    }

    protected async updateOne(match: Partial<Row>, updates: Partial<Row>) {
      const { error } = await this.updateQuery(updates).match(match);

      if (error) {
       console.error('updateOne error:', error);
       }

      return !error
    }

    protected async deleteOne(match: Partial<Row>): Promise<Row | null> {
      const { data, error } = await supabase
        .from(this.table)
        .delete()
        .match(match)
        .select()
        .single();
      if (error) return null;
      return data as Row;
    }

    protected async count(){
      const { data, error } = await supabase
        .from(this.table)
        .select('*', { count: 'exact', head: true});
      
      if (error) throw new Error(error.message)

      return data ?? 0;
    }
  
    protected getQueryWithJoin(select: string = '*') {
      return supabase.from(this.table).select(select);
    }

    public async findWithJoin<R = Record<string, unknown>>(
      selectClause: string,
      config: QueryConfig<T> = {}
    ): Promise<R[] | null> {
  
      let query = this.getQueryWithJoin(selectClause)
      
      if (config.where) {
        query = query.match(config.where);
      }
      
      if (config.eq) {
        Object.entries(config.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (config.gt) {
        Object.entries(config.gt).forEach(([key, value]) => {
          query = query.gt(key, value);
        });
      }
      
      if (config.order) {
        query = query.order(config.order.column, { ascending: config.order.ascending ?? true });
      }
      
      if (config.limit) {
        query = query.limit(config.limit);
      }

      const {data, error} = await query

      if (error) return null;

      return data as R[];
    }

    public async findOneWithJoin<R = Record<string, unknown>>(
      selectClause: string,
      config: QueryConfig<T> = {}
    ): Promise<R | null> {
      let query = this.getQueryWithJoin(selectClause)
      
      if (config.where) {
        query = query.match(config.where);
      }
      
      if (config.eq) {
        Object.entries(config.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (config.gt) {
        Object.entries(config.gt).forEach(([key, value]) => {
          query = query.gt(key, value);
        });
      }
      
      if (config.order) {
        query = query.order(config.order.column, { ascending: config.order.ascending ?? true });
      }
      
      if (config.limit) {
        query = query.limit(config.limit);
      }

      const {data, error} = await query.single()
      if (error) return null;
      return data as R;
    }
  }

  return TableManager;
}