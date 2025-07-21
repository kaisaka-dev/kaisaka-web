import { supabase } from "./supabase.js";
import type { Database } from "./supabase-types.js";

// All the names in the database
export type tableNames = keyof Database['public']['Tables'] 
export type enumNames = keyof Database['public']['Enums']
export type viewNames = keyof Database['public']['Views']


// A generic row from Table T being object-like
export type tableRow<T extends tableNames> 
= Database['public']['Tables'][T]['Row'] & Record<string, unknown>

export type tableInsert<T extends tableNames>
= Database['public']['Tables'][T]['Insert']

export type tableUpdate<T extends tableNames>
= Database['public']['Tables'][T]['Update']

export type viewRow<T extends viewNames>
= Database['public']['Views'][T]['Row'] & Record<string, unknown>

// Database query type for Table T
export interface QueryConfigurationBuilder{
  where?: Partial<tableRow<tableNames>>;
  eq?: Record<string, string | number | boolean>;
  neq?: Record<string, string | number | boolean>;
  gt?: Record<string, string | number>;
  gte?: Record<string, string | number>;
  lt?: Record<string, string | number>;
  lte?: Record<string, string | number>;
  like?: Record<string, string>;
  ilike?: Record<string, string>;
  in?: Record<string, (string | number)[]>;
  is?: Record<string, boolean | null>;
  isNot?: Record<string, boolean | null>;
  order?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
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

    protected async findOne(match: Partial<Row>, config: Omit<QueryConfigurationBuilder, 'where' | 'limit'> = {}): Promise<Row | null> {
      let query = this.getQuery()
        .match(match)
        
      query = this.applyFilters(query, config);
      
      const {data, error} = await query.single();

      if (error) return null;

      return data as Row;
    }

    protected async findMany(match: Partial<Row> = {}, config: Omit<QueryConfigurationBuilder, 'where'> = {}): Promise<Row[]|null>{
      let query = this.getQuery()
        .match(match);
      
        query = this.applyFilters(query, config);


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
      config: QueryConfigurationBuilder = {}
    ): Promise<R[] | null> {
  
      let query = this.getQueryWithJoin(selectClause)
      
      query = this.applyFilters(query, config);

      const {data, error} = await query

      if (error) return null;

      return data as R[];
    }

    public async findOneWithJoin<R = Record<string, unknown>>(
      selectClause: string,
      config: QueryConfigurationBuilder = {}
    ): Promise<R | null> {
      let query = this.getQueryWithJoin(selectClause)
      
      query = this.applyFilters(query, config);

      const {data, error} = await query.single()
      if (error) return null;
      return data as R;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private applyFilters(query: any, config: QueryConfigurationBuilder) {
      if (config.where) {
        query = query.match(config.where);
      }
      
      if (config.eq) {
        Object.entries(config.eq).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (config.neq) {
        Object.entries(config.neq).forEach(([key, value]) => {
          query = query.neq(key, value);
        });
      }
      
      if (config.gt) {
        Object.entries(config.gt).forEach(([key, value]) => {
          query = query.gt(key, value);
        });
      }
      
      if (config.gte) {
        Object.entries(config.gte).forEach(([key, value]) => {
          query = query.gte(key, value);
        });
      }
      
      if (config.lt) {
        Object.entries(config.lt).forEach(([key, value]) => {
          query = query.lt(key, value);
        });
      }
      
      if (config.lte) {
        Object.entries(config.lte).forEach(([key, value]) => {
          query = query.lte(key, value);
        });
      }
      
      if (config.like) {
        Object.entries(config.like).forEach(([key, value]) => {
          query = query.like(key, value);
        });
      }
      
      if (config.ilike) {
        Object.entries(config.ilike).forEach(([key, value]) => {
          query = query.ilike(key, value);
        });
      }
      
      if (config.in) {
        Object.entries(config.in).forEach(([key, value]) => {
          query = query.in(key, value);
        });
      }
      
      if (config.is) {
        Object.entries(config.is).forEach(([key, value]) => {
          query = query.is(key, value);
        });
      }

      if (config.isNot) {
        Object.entries(config.isNot).forEach(([key, value]) => {
          query = query.is(key, value)
        })
      }
      
      if (config.order) {
        config.order.forEach(orderConfig => {
          query = query.order(orderConfig.column, { ascending: orderConfig.ascending ?? true });
        });
      }
      
      if (config.limit) {
        query = query.limit(config.limit);
      }
      
      if (config.offset) {
        query = query.range(config.offset, config.offset + (config.limit || 1000) - 1);
      }
      
      return query;
    }

    public async findWithJoinAndCount<R = Record<string, unknown>>(
      selectClause: string,
      config: QueryConfigurationBuilder = {}
    ): Promise<{ data: R[] | null; count: number }> {
      let query = supabase.from(this.table).select(selectClause, { count: 'exact' });

      query = this.applyFilters(query, config);

      const {data, error, count} = await query;
      if (error) {
        console.error('Join with count query error:', error);
        return { data: null, count: 0 };
      }
      return { data: data as R[], count: count || 0 };
    }
  
  }


  return TableManager;
}