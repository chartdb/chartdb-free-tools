import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ValidationResult } from "@/lib/sql-validator";

interface ValidationResultDisplayProps {
  result: ValidationResult | null;
}

export function ValidationResultDisplay({ result }: ValidationResultDisplayProps) {
  if (!result) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Enter SQL and click &quot;Validate SQL&quot; to check syntax
        </p>
      </div>
    );
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

  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-destructive">Syntax Error</p>
        <p className="text-sm text-foreground mt-1 break-words">
          {result.error?.message}
        </p>
        {result.error?.location && (
          <p className="text-xs text-muted-foreground mt-1">
            Line {result.error.location.line}, Column {result.error.location.column}
          </p>
        )}
      </div>
    </div>
  );
}
