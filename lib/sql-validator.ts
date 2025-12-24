import { Parser } from "node-sql-parser";

export type SQLDialect =
  | "mysql"
  | "postgresql"
  | "mariadb"
  | "sqlite"
  | "transactsql"
  | "bigquery";

export interface SQLDialectOption {
  value: SQLDialect;
  label: string;
}

export const SQL_DIALECTS: SQLDialectOption[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
  { value: "bigquery", label: "BigQuery" },
];

export interface ValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    location?: {
      line: number;
      column: number;
    };
  };
}

export function validateSQL(sql: string, dialect: SQLDialect): ValidationResult {
  if (!sql.trim()) {
    return {
      isValid: false,
      error: {
        message: "Please enter some SQL to validate",
      },
    };
  }

  const parser = new Parser();

  try {
    // Map our dialect names to node-sql-parser options
    const parserDialect = dialect === "postgresql" ? "postgresql" : dialect;

    parser.astify(sql, { database: parserDialect });

    return { isValid: true };
  } catch (err) {
    const error = err as Error;
    const message = error.message;

    // Try to extract line and column from error message
    // node-sql-parser errors often include position info
    const locationMatch = message.match(/at line (\d+), column (\d+)/i);

    let location: { line: number; column: number } | undefined;
    if (locationMatch) {
      location = {
        line: parseInt(locationMatch[1], 10),
        column: parseInt(locationMatch[2], 10),
      };
    }

    // Clean up the error message for display
    let cleanMessage = message
      .replace(/^Syntax error:/i, "")
      .replace(/at line \d+, column \d+/i, "")
      .trim();

    if (!cleanMessage) {
      cleanMessage = "Syntax error in SQL statement";
    }

    return {
      isValid: false,
      error: {
        message: cleanMessage,
        location,
      },
    };
  }
}

export const EXAMPLE_QUERIES: Record<SQLDialect, string> = {
  postgresql: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`,

  mysql: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`,

  mariadb: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`,

  sqlite: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= datetime('now', '-30 days')
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`,

  transactsql: `SELECT TOP 10
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATEADD(day, -30, GETDATE())
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC;`,

  bigquery: `SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`,
};
