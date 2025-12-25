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

export const EXAMPLE_ORIGINAL_SQL = `SELECT
    u.id,
    u.name,
    u.email
FROM users u
WHERE u.status = 'active'
ORDER BY u.name;`;

export const EXAMPLE_MODIFIED_SQL = `SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= '2024-01-01'
ORDER BY u.created_at DESC;`;
