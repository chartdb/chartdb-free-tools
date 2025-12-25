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

// Helper to calculate line and column from character position
function getLocationFromPosition(sql: string, position: number): { line: number; column: number } {
  const lines = sql.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

// Pre-validation to catch lexical errors that parsers might miss
function checkLexicalErrors(sql: string): ValidationResult | null {
  let i = 0;
  const len = sql.length;

  while (i < len) {
    const char = sql[i];

    // Check for single-quoted strings
    if (char === "'") {
      const startPos = i;
      i++; // Move past opening quote

      // Look for closing quote
      while (i < len) {
        if (sql[i] === "'") {
          if (i + 1 < len && sql[i + 1] === "'") {
            // Escaped quote (''), skip both
            i += 2;
            continue;
          }
          // Found closing quote
          break;
        }
        i++;
      }

      if (i >= len) {
        // Reached end without finding closing quote
        const location = getLocationFromPosition(sql, startPos);
        const unterminatedContent = sql.substring(startPos, Math.min(startPos + 50, len));
        return {
          isValid: false,
          error: {
            message: `Unterminated quoted string at or near '${unterminatedContent}${sql.length > startPos + 50 ? '...' : ''}'`,
            location,
          },
        };
      }
    }

    // Check for double-quoted identifiers (PostgreSQL, etc.)
    if (char === '"') {
      const startPos = i;
      i++; // Move past opening quote

      while (i < len) {
        if (sql[i] === '"') {
          if (i + 1 < len && sql[i + 1] === '"') {
            // Escaped quote (""), skip both
            i += 2;
            continue;
          }
          break;
        }
        i++;
      }

      if (i >= len) {
        const location = getLocationFromPosition(sql, startPos);
        return {
          isValid: false,
          error: {
            message: `Unterminated quoted identifier at or near '${sql.substring(startPos, Math.min(startPos + 50, len))}'`,
            location,
          },
        };
      }
    }

    // Check for block comments /* */
    if (char === '/' && i + 1 < len && sql[i + 1] === '*') {
      const startPos = i;
      i += 2; // Move past /*

      while (i < len - 1) {
        if (sql[i] === '*' && sql[i + 1] === '/') {
          i++; // Will be incremented again at end of loop
          break;
        }
        i++;
      }

      if (i >= len - 1 && !(sql[i - 1] === '*' && sql[i] === '/')) {
        const location = getLocationFromPosition(sql, startPos);
        return {
          isValid: false,
          error: {
            message: `Unterminated block comment starting at position`,
            location,
          },
        };
      }
    }

    // Skip line comments
    if (char === '-' && i + 1 < len && sql[i + 1] === '-') {
      while (i < len && sql[i] !== '\n') {
        i++;
      }
    }

    i++;
  }

  return null; // No lexical errors found
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

  // First, check for lexical errors (unterminated strings, comments, etc.)
  const lexicalError = checkLexicalErrors(sql);
  if (lexicalError) {
    return lexicalError;
  }

  const parser = new Parser();

  try {
    // Map our dialect names to node-sql-parser options
    const parserDialect = dialect === "postgresql" ? "postgresql" : dialect;

    parser.astify(sql, { database: parserDialect });

    return { isValid: true };
  } catch (err) {
    const error = err as Error & { location?: { start?: { line?: number; column?: number; offset?: number } } };
    const message = error.message;

    let location: { line: number; column: number } | undefined;

    // Method 1: Check if error has location property (some parsers provide this)
    if (error.location?.start?.line) {
      location = {
        line: error.location.start.line,
        column: error.location.start.column || 1,
      };
    }

    // Method 2: Try to extract line and column from error message
    if (!location) {
      const locationMatch = message.match(/at line (\d+),?\s*column (\d+)/i);
      if (locationMatch) {
        location = {
          line: parseInt(locationMatch[1], 10),
          column: parseInt(locationMatch[2], 10),
        };
      }
    }

    // Method 3: Try to extract position and calculate line/column
    if (!location) {
      const positionMatch = message.match(/position\s*(\d+)/i);
      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        location = getLocationFromPosition(sql, position);
      }
    }

    // Method 4: Look for "near" keyword and find it in the SQL
    if (!location) {
      const nearMatch = message.match(/near\s+["']([^"']+)["']/i);
      if (nearMatch) {
        const nearText = nearMatch[1];
        const index = sql.indexOf(nearText);
        if (index !== -1) {
          location = getLocationFromPosition(sql, index);
        }
      }
    }

    // Method 5: Look for the problematic token in quotes and find it
    if (!location) {
      const tokenMatch = message.match(/["'`]([^"'`]+)["'`]/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        const index = sql.toLowerCase().indexOf(token.toLowerCase());
        if (index !== -1) {
          location = getLocationFromPosition(sql, index);
        }
      }
    }

    // Clean up the error message for display
    let cleanMessage = message
      .replace(/^Syntax error:?\s*/i, "")
      .replace(/at line \d+,?\s*column \d+/i, "")
      .replace(/position\s*\d+/i, "")
      .trim();

    // Capitalize first letter
    if (cleanMessage) {
      cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
    }

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
