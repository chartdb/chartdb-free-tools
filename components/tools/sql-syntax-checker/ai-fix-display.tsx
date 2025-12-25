"use client";

import { useEffect, useRef } from "react";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AIFixDisplayProps {
  content: string;
  isStreaming: boolean;
  onClose: () => void;
  onApplyFix?: (fixedSQL: string) => void;
}

// Extract SQL code block from the AI response
function extractSQLFromResponse(content: string): string | null {
  const sqlMatch = content.match(/```sql\n([\s\S]*?)```/);
  if (sqlMatch) {
    return sqlMatch[1].trim();
  }
  return null;
}

export function AIFixDisplay({ content, isStreaming, onClose, onApplyFix }: AIFixDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (contentRef.current && isStreaming) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  const fixedSQL = extractSQLFromResponse(content);

  const handleCopy = async () => {
    if (fixedSQL) {
      await navigator.clipboard.writeText(fixedSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    if (fixedSQL && onApplyFix) {
      onApplyFix(fixedSQL);
      onClose();
    }
  };

  // Format the content with proper styling
  const formatContent = (text: string) => {
    // Split by code blocks and format
    const parts = text.split(/(```sql[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```sql")) {
        const code = part.replace(/```sql\n?/, "").replace(/```$/, "");
        return (
          <pre
            key={index}
            className="bg-slate-900 text-slate-100 p-3 rounded-md my-2 overflow-x-auto text-sm font-mono"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Format markdown bold
      const formattedPart = part.split(/(\*\*.*?\*\*)/g).map((segment, i) => {
        if (segment.startsWith("**") && segment.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {segment.slice(2, -2)}
            </strong>
          );
        }
        return segment;
      });

      return <span key={index}>{formattedPart}</span>;
    });
  };

  return (
    <div className="rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-purple-100 dark:bg-purple-900/30 border-b border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI Fix & Explanation</span>
          {isStreaming && (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-xs text-purple-600 dark:text-purple-400">Generating...</span>
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="h-6 w-6 text-purple-600 hover:text-purple-800 dark:text-purple-400"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="p-4 max-h-[300px] overflow-y-auto text-sm text-foreground/90 whitespace-pre-wrap"
      >
        {content ? formatContent(content) : (
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
            <span>Analyzing your query...</span>
          </div>
        )}
        {isStreaming && <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5" />}
      </div>

      {/* Actions */}
      {!isStreaming && fixedSQL && (
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-500/20">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy Fixed SQL
              </>
            )}
          </Button>
          {onApplyFix && (
            <Button
              size="sm"
              onClick={handleApply}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              Apply Fix to Editor
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
