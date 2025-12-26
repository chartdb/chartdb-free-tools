"use client";

import { BookOpen } from "lucide-react";

interface ExplanationDisplayProps {
  explanation: string;
  isLoading: boolean;
}

function formatMarkdown(text: string): string {
  return (
    text
      // Headers
      .replace(
        /^## (.+)$/gm,
        '<h3 class="font-semibold text-base mt-4 mb-2 text-foreground">$1</h3>'
      )
      .replace(
        /^### (.+)$/gm,
        '<h4 class="font-medium text-sm mt-3 mb-1 text-foreground">$1</h4>'
      )
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-purple-600 dark:text-purple-400">$1</code>'
      )
      // Numbered lists
      .replace(
        /^(\d+)\. (.+)$/gm,
        '<div class="ml-4 mb-1"><span class="font-medium text-purple-600 dark:text-purple-400">$1.</span> $2</div>'
      )
      // Bullet lists
      .replace(
        /^- (.+)$/gm,
        '<div class="ml-4 mb-1 flex gap-2"><span class="text-purple-500">-</span><span>$1</span></div>'
      )
      // Double line breaks to paragraphs
      .replace(/\n\n/g, '</p><p class="mt-3">')
      // Single line breaks
      .replace(/\n/g, "<br/>")
  );
}

export function ExplanationDisplay({
  explanation,
  isLoading,
}: ExplanationDisplayProps) {
  return (
    <div className="rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 p-6">
      <div className="flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-4">
            {isLoading ? "Analyzing your query..." : "Query Explanation"}
          </p>

          {isLoading && !explanation ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              <span>Generating explanation...</span>
            </div>
          ) : (
            <div
              className="text-sm text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(explanation),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
