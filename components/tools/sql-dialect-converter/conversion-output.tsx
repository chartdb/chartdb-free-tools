"use client";

import { ArrowRightLeft } from "lucide-react";

interface ConversionOutputProps {
  summary: string;
  isLoading: boolean;
}

function formatMarkdown(text: string): string {
  return (
    text
      .replace(
        /^## (.+)$/gm,
        '<h3 class="font-semibold text-base mt-4 mb-2 text-foreground">$1</h3>'
      )
      .replace(
        /^### (.+)$/gm,
        '<h4 class="font-medium text-sm mt-3 mb-1 text-foreground">$1</h4>'
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-teal-600 dark:text-teal-400">$1</code>'
      )
      .replace(
        /^- (.+)$/gm,
        '<div class="ml-4 mb-1 flex gap-2"><span class="text-teal-500">-</span><span>$1</span></div>'
      )
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, "<br/>")
  );
}

export function ConversionOutput({
  summary,
  isLoading,
}: ConversionOutputProps) {
  if (!summary && !isLoading) return null;

  return (
    <div className="rounded-lg border border-teal-500/30 bg-teal-50 dark:bg-teal-950/20 p-6">
      <div className="flex items-start gap-3">
        <ArrowRightLeft className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-4">
            {isLoading ? "Converting..." : "Conversion Summary"}
          </p>

          {isLoading && !summary ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
              <span>Analyzing and converting SQL...</span>
            </div>
          ) : (
            <div
              className="text-sm text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(summary),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
