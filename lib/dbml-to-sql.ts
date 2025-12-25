import { Parser, ModelExporter } from "@dbml/core";

export type DBMLDialect =
  | "mysql"
  | "postgresql"
  | "mssql"
  | "dbml";

// Map our dialect names to DBML library's export format names
type DBMLExportFormat = "mysql" | "postgres" | "mssql" | "dbml";

const dialectToExportFormat: Record<DBMLDialect, DBMLExportFormat> = {
  mysql: "mysql",
  postgresql: "postgres",
  mssql: "mssql",
  dbml: "dbml",
};

export interface DBMLDialectOption {
  value: DBMLDialect;
  label: string;
}

export const DBML_DIALECTS: DBMLDialectOption[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mssql", label: "SQL Server" },
  { value: "dbml", label: "DBML (no conversion)" },
];

export interface ConvertResult {
  success: boolean;
  sql?: string;
  error?: string;
}

export function convertDBMLToSQL(dbml: string, dialect: DBMLDialect): ConvertResult {
  if (!dbml.trim()) {
    return {
      success: false,
      error: "Please enter some DBML to convert",
    };
  }

  try {
    const parser = new Parser();
    const database = parser.parse(dbml, "dbml");
    const exportFormat = dialectToExportFormat[dialect];

    if (dialect === "dbml") {
      // Just return the parsed and re-exported DBML (normalized)
      const exportedDBML = ModelExporter.export(database, "dbml", false);
      return {
        success: true,
        sql: exportedDBML,
      };
    }

    const sql = ModelExporter.export(database, exportFormat, false);

    return {
      success: true,
      sql,
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "Failed to convert DBML",
    };
  }
}

export const EXAMPLE_DBML = `// Simple e-commerce database schema

Table users {
  id int [pk, increment]
  username varchar(255) [unique, not null]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  created_at timestamp [default: \`now()\`]
  status varchar(20) [default: 'active']
}

Table products {
  id int [pk, increment]
  name varchar(255) [not null]
  description text
  price decimal(10,2) [not null]
  stock int [default: 0]
  created_at timestamp [default: \`now()\`]
}

Table orders {
  id int [pk, increment]
  user_id int [not null]
  status varchar(50) [default: 'pending']
  total decimal(10,2)
  created_at timestamp [default: \`now()\`]
}

Table order_items {
  id int [pk, increment]
  order_id int [not null]
  product_id int [not null]
  quantity int [not null]
  price decimal(10,2) [not null]
}

// Relationships
Ref: orders.user_id > users.id
Ref: order_items.order_id > orders.id
Ref: order_items.product_id > products.id`;
