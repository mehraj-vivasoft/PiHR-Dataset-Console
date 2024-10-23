import { TableSchemaFromDB } from "../models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TableSchemaAdapter(data: any): TableSchemaFromDB {
    console.log(data);
    console.log(data.columns);
    console.log(data.primary_keys);
    return {
      table_name: data.table_name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columns: data.columns?.map((column: any) => ({
        name: column.name,
        type: column.type,
      })),
      primary_keys: data.primary_keys,
      foreign_keys: data.foreign_keys,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      indexes: data.indexes?.map((index: any) => ({
        name: index.name,
        columns: index.columns,
      })),
    };
  }