export type MinifierDialect =
  | "mysql"
  | "postgresql"
  | "mariadb"
  | "sqlite"
  | "transactsql"
  | "bigquery"
  | "redshift"
  | "snowflake"
  | "oracle";

export interface MinifierDialectOption {
  value: MinifierDialect;
  label: string;
}

export const MINIFIER_DIALECTS: MinifierDialectOption[] = [
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

export interface MinifyResult {
  success: boolean;
  minifiedSQL?: string;
  originalSize?: number;
  minifiedSize?: number;
  savings?: number;
  error?: string;
}

export interface MinifyOptions {
  removeComments: boolean;
  preserveStringWhitespace: boolean;
}

export const DEFAULT_MINIFY_OPTIONS: MinifyOptions = {
  removeComments: true,
  preserveStringWhitespace: true,
};

function removeBlockComments(sql: string): string {
  // Remove /* ... */ comments, being careful not to affect strings
  let result = "";
  let inString = false;
  let stringChar = "";
  let i = 0;

  while (i < sql.length) {
    // Check for string start/end
    if (!inString && (sql[i] === "'" || sql[i] === '"')) {
      inString = true;
      stringChar = sql[i];
      result += sql[i];
      i++;
    } else if (inString && sql[i] === stringChar) {
      // Check for escaped quote
      if (i + 1 < sql.length && sql[i + 1] === stringChar) {
        result += sql[i] + sql[i + 1];
        i += 2;
      } else {
        inString = false;
        result += sql[i];
        i++;
      }
    } else if (!inString && sql[i] === "/" && sql[i + 1] === "*") {
      // Skip block comment
      i += 2;
      while (i < sql.length - 1 && !(sql[i] === "*" && sql[i + 1] === "/")) {
        i++;
      }
      i += 2; // Skip */
    } else {
      result += sql[i];
      i++;
    }
  }

  return result;
}

function removeLineComments(sql: string): string {
  // Remove -- comments, being careful not to affect strings
  let result = "";
  let inString = false;
  let stringChar = "";
  let i = 0;

  while (i < sql.length) {
    // Check for string start/end
    if (!inString && (sql[i] === "'" || sql[i] === '"')) {
      inString = true;
      stringChar = sql[i];
      result += sql[i];
      i++;
    } else if (inString && sql[i] === stringChar) {
      // Check for escaped quote
      if (i + 1 < sql.length && sql[i + 1] === stringChar) {
        result += sql[i] + sql[i + 1];
        i += 2;
      } else {
        inString = false;
        result += sql[i];
        i++;
      }
    } else if (!inString && sql[i] === "-" && sql[i + 1] === "-") {
      // Skip line comment until newline
      i += 2;
      while (i < sql.length && sql[i] !== "\n") {
        i++;
      }
      // Don't skip the newline, we'll handle whitespace later
    } else {
      result += sql[i];
      i++;
    }
  }

  return result;
}

function collapseWhitespace(sql: string): string {
  // Collapse whitespace while preserving strings
  let result = "";
  let inString = false;
  let stringChar = "";
  let lastWasSpace = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    // Check for string start/end
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      result += char;
      lastWasSpace = false;
    } else if (inString && char === stringChar) {
      // Check for escaped quote
      if (i + 1 < sql.length && sql[i + 1] === stringChar) {
        result += char + sql[i + 1];
        i++;
      } else {
        inString = false;
        result += char;
      }
      lastWasSpace = false;
    } else if (inString) {
      result += char;
      lastWasSpace = false;
    } else if (/\s/.test(char)) {
      if (!lastWasSpace) {
        result += " ";
        lastWasSpace = true;
      }
    } else {
      result += char;
      lastWasSpace = false;
    }
  }

  return result.trim();
}

function removeUnnecessarySpaces(sql: string): string {
  // Remove spaces around operators and punctuation, preserving strings
  let result = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    // Check for string start/end
    if (!inString && (char === "'" || char === '"')) {
      inString = true;
      stringChar = char;
      result += char;
    } else if (inString && char === stringChar) {
      // Check for escaped quote
      if (i + 1 < sql.length && sql[i + 1] === stringChar) {
        result += char + sql[i + 1];
        i++;
      } else {
        inString = false;
        result += char;
      }
    } else if (inString) {
      result += char;
    } else {
      // Remove space before certain characters
      if (char === " " && i + 1 < sql.length) {
        const nextChar = sql[i + 1];
        if (/[,;)\]=<>!]/.test(nextChar)) {
          continue; // Skip this space
        }
      }
      // Remove space after certain characters
      if (char === " " && i > 0) {
        const prevChar = result[result.length - 1];
        if (/[(=<>!]/.test(prevChar)) {
          continue; // Skip this space
        }
      }
      result += char;
    }
  }

  return result;
}

export function minifySQL(sql: string, options: MinifyOptions = DEFAULT_MINIFY_OPTIONS): MinifyResult {
  if (!sql.trim()) {
    return {
      success: false,
      error: "Please enter some SQL to minify",
    };
  }

  try {
    const originalSize = sql.length;
    let minified = sql;

    // Remove comments if option is enabled
    if (options.removeComments) {
      minified = removeBlockComments(minified);
      minified = removeLineComments(minified);
    }

    // Collapse all whitespace to single spaces
    minified = collapseWhitespace(minified);

    // Remove unnecessary spaces around operators
    minified = removeUnnecessarySpaces(minified);

    const minifiedSize = minified.length;
    const savings = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

    return {
      success: true,
      minifiedSQL: minified,
      originalSize,
      minifiedSize,
      savings,
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "Failed to minify SQL",
    };
  }
}

export const EXAMPLE_SQL = `-- Get active users with their order counts
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o
    ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`;
