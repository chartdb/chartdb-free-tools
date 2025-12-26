import { diffLines, Change } from "diff";

export type CompareDialect =
  | "mysql"
  | "postgresql"
  | "mariadb"
  | "sqlite"
  | "transactsql"
  | "bigquery"
  | "redshift"
  | "snowflake"
  | "oracle";

export interface CompareDialectOption {
  value: CompareDialect;
  label: string;
}

export const COMPARE_DIALECTS: CompareDialectOption[] = [
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

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineNumber?: number;
}

export interface CompareResult {
  changes: Change[];
  additions: number;
  deletions: number;
  unchanged: number;
  hasChanges: boolean;
}

export function compareSQL(original: string, modified: string): CompareResult {
  const changes = diffLines(original, modified);

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  changes.forEach((change) => {
    const lineCount = change.value.split("\n").filter((line) => line !== "").length;
    if (change.added) {
      additions += lineCount;
    } else if (change.removed) {
      deletions += lineCount;
    } else {
      unchanged += lineCount;
    }
  });

  return {
    changes,
    additions,
    deletions,
    unchanged,
    hasChanges: additions > 0 || deletions > 0,
  };
}

export const EXAMPLE_ORIGINAL_SQL: Record<CompareDialect, string> = {
  postgresql: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  mysql: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  mariadb: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  sqlite: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  transactsql: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  bigquery: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  redshift: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  snowflake: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
  oracle: `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`,
};

export const EXAMPLE_MODIFIED_SQL: Record<CompareDialect, string> = {
  postgresql: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY u.created_at DESC;`,
  mysql: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY u.created_at DESC;`,
  mariadb: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY u.created_at DESC;`,
  sqlite: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= date('now', '-30 days')
ORDER BY u.created_at DESC;`,
  transactsql: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= DATEADD(day, -30, GETDATE())
ORDER BY u.created_at DESC;`,
  bigquery: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY u.created_at DESC;`,
  redshift: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= GETDATE() - INTERVAL '30 days'
ORDER BY u.created_at DESC;`,
  snowflake: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= DATEADD(day, -30, CURRENT_DATE())
ORDER BY u.created_at DESC;`,
  oracle: `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= SYSDATE - 30
ORDER BY u.created_at DESC;`,
};
