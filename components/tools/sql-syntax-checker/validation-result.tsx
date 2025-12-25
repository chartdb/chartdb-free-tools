import { CheckCircle2, Info, Sparkles } from "lucide-react";
import type { ValidationResult, SQLDialect } from "@/lib/sql-validator";

interface ValidationResultDisplayProps {
  result: ValidationResult | null;
  sql?: string;
  dialect?: SQLDialect;
  onFixWithAI?: () => void;
  isFixingWithAI?: boolean;
}

// Extract the token at or near the error location from the SQL
function getTokenAtLocation(sql: string, line: number, column: number): string | null {
  const lines = sql.split('\n');
  if (line < 1 || line > lines.length) return null;

  const lineContent = lines[line - 1];

  // If column is at or past the end of the line, look backward for the last token
  if (column > lineContent.length) {
    const lastTokenMatch = lineContent.match(/(\S+)\s*$/);
    if (lastTokenMatch) {
      return lastTokenMatch[1].replace(/[,;)]+$/, '') || lastTokenMatch[1];
    }
    return null;
  }

  // Find the token starting at or near the column
  const restOfLine = lineContent.substring(Math.max(0, column - 1));
  const tokenMatch = restOfLine.match(/^(\S+)/);

  if (tokenMatch) {
    // Clean up the token (remove trailing punctuation except SQL operators)
    return tokenMatch[1].replace(/[,;)]+$/, '') || tokenMatch[1];
  }

  // If no token at position, look backward
  const beforeColumn = lineContent.substring(0, column - 1);
  const prevTokenMatch = beforeColumn.match(/(\S+)\s*$/);
  if (prevTokenMatch) {
    return prevTokenMatch[1].replace(/[,;)]+$/, '') || prevTokenMatch[1];
  }

  return null;
}

// Create a humanized error message
function humanizeErrorMessage(error: { message: string; location?: { line: number; column: number } } | undefined, sql?: string): string {
  if (!error) return "Unknown syntax error";

  const message = error.message;
  const location = error.location;

  // If the original message already contains "at or near", use it directly
  if (message.includes("at or near")) {
    return message;
  }

  // Handle "end of input found" - common PEG.js error
  if (message.includes("end of input found")) {
    // Try to get the last token from SQL
    if (sql && location) {
      const token = getTokenAtLocation(sql, location.line, location.column);
      if (token) {
        return `unexpected end of input near '${token}'`;
      }
    }
    return "unexpected end of input";
  }

  // Try to extract token from SQL first - this gives us the full token
  if (location && sql) {
    const token = getTokenAtLocation(sql, location.line, location.column);
    if (token) {
      return `syntax error at or near '${token}'`;
    }
  }

  // Fall back to parsing the error message for a token
  const expectedButFound = message.match(/expected .+ but ["']?(\w+)["']? found/i);
  if (expectedButFound) {
    const foundToken = expectedButFound[1];
    return `syntax error at or near '${foundToken}'`;
  }

  // Fall back to a simplified message
  return "syntax error in query";
}

export function ValidationResultDisplay({ result, sql, onFixWithAI, isFixingWithAI }: ValidationResultDisplayProps) {
  // Don't show anything when there's no result yet
  if (!result) {
    return null;
  }

  if (result.isValid) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <div>
          <p className="text-sm font-medium text-success">Valid SQL syntax</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your SQL query is syntactically correct
          </p>
        </div>
      </div>
    );
  }

  const location = result.error?.location;
  const humanizedMessage = humanizeErrorMessage(result.error, sql);
  const errorDetails = location
    ? `Error at line ${location.line}, column ${location.column}. Details: ${humanizedMessage}`
    : humanizedMessage;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive flex-shrink-0 mt-0.5">
          <Info className="h-3 w-3 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Query syntax is invalid</p>
          <p className="text-sm text-foreground/80 mt-1 break-words">
            {errorDetails}
          </p>
          {onFixWithAI && (
            <button
              onClick={onFixWithAI}
              disabled={isFixingWithAI}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isFixingWithAI ? "Fixing..." : "Fix and explain query using AI"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
