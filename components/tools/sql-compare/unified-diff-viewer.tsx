"use client";

import { type Change } from "diff";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface UnifiedDiffViewerProps {
  changes: Change[];
  originalSQL: string;
  modifiedSQL: string;
}

export function UnifiedDiffViewer({ changes, originalSQL, modifiedSQL }: UnifiedDiffViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    // Copy the modified SQL
    try {
      await navigator.clipboard.writeText(modifiedSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [modifiedSQL]);

  if (changes.length === 0) {
    return null;
  }

  // Check if there are any actual changes
  const hasChanges = changes.some((change) => change.added || change.removed);

  if (!hasChanges) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground">
        No differences found. Both queries are identical.
      </div>
    );
  }

  // Build unified diff lines with line numbers
  const diffLines: Array<{
    type: "added" | "removed" | "unchanged";
    content: string;
    oldLineNum?: number;
    newLineNum?: number;
  }> = [];

  let oldLineNum = 1;
  let newLineNum = 1;

  changes.forEach((change) => {
    const lines = change.value.split("\n");
    // Remove last empty element if the string ends with newline
    if (lines[lines.length - 1] === "") {
      lines.pop();
    }

    lines.forEach((line) => {
      if (change.added) {
        diffLines.push({
          type: "added",
          content: line,
          newLineNum: newLineNum++,
        });
      } else if (change.removed) {
        diffLines.push({
          type: "removed",
          content: line,
          oldLineNum: oldLineNum++,
        });
      } else {
        diffLines.push({
          type: "unchanged",
          content: line,
          oldLineNum: oldLineNum++,
          newLineNum: newLineNum++,
        });
      }
    });
  });

  return (
    <div className="rounded-lg border border-input bg-background overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">Unified Diff</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
              Added
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50" />
              Removed
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            title="Copy modified SQL"
            className="h-7 w-7"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      <div className="font-mono text-sm overflow-x-auto max-h-[400px] overflow-y-auto">
        {diffLines.map((line, index) => (
          <div
            key={index}
            className={cn(
              "flex border-b border-border/30 last:border-b-0",
              line.type === "added" && "bg-green-500/10",
              line.type === "removed" && "bg-red-500/10"
            )}
          >
            {/* Line numbers */}
            <div className="flex-shrink-0 flex text-xs text-muted-foreground/60 select-none border-r border-border/50 bg-muted/30">
              <span className="w-10 px-2 py-0.5 text-right border-r border-border/30">
                {line.oldLineNum ?? ""}
              </span>
              <span className="w-10 px-2 py-0.5 text-right">
                {line.newLineNum ?? ""}
              </span>
            </div>
            {/* Prefix */}
            <span
              className={cn(
                "w-6 flex-shrink-0 text-center py-0.5 select-none",
                line.type === "added" && "text-green-600 dark:text-green-400 bg-green-500/20",
                line.type === "removed" && "text-red-600 dark:text-red-400 bg-red-500/20"
              )}
            >
              {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
            </span>
            {/* Content */}
            <span
              className={cn(
                "flex-1 px-2 py-0.5 whitespace-pre-wrap break-all",
                line.type === "added" && "text-green-700 dark:text-green-300",
                line.type === "removed" && "text-red-700 dark:text-red-300 line-through"
              )}
            >
              {line.content || " "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
