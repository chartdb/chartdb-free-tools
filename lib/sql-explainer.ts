export type SQLExplainerDialect =
  | "postgresql"
  | "mysql"
  | "mariadb"
  | "sqlite"
  | "transactsql"
  | "bigquery"
  | "redshift"
  | "snowflake"
  | "oracle";

export interface SQLExplainerDialectOption {
  value: SQLExplainerDialect;
  label: string;
}

export const SQL_EXPLAINER_DIALECTS: SQLExplainerDialectOption[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
  { value: "bigquery", label: "BigQuery" },
  { value: "redshift", label: "Amazon Redshift" },
  { value: "snowflake", label: "Snowflake" },
  { value: "oracle", label: "Oracle" },
];

export const EXAMPLE_QUERY = `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
  AND u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`;
