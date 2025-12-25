"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { CompareDialect } from "@/lib/sql-compare";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Check, Pencil } from "lucide-react";
import { type Change } from "diff";

interface SQLDiffEditorProps {
  value: string;
  onChange: (value: string) => void;
  dialect: CompareDialect;
  placeholder?: string;
  label?: string;
  height?: string;
  diffChanges?: Change[];
  diffSide?: "original" | "modified";
  isComparing?: boolean;
  onEdit?: () => void;
}

const dialectToMonacoLanguage: Record<CompareDialect, string> = {
  postgresql: "pgsql",
  mysql: "mysql",
  mariadb: "mysql",
  sqlite: "sql",
  transactsql: "sql",
  bigquery: "sql",
  redshift: "sql",
  snowflake: "sql",
  oracle: "sql",
};

export function SQLDiffEditor({
  value,
  onChange,
  dialect,
  placeholder = "Enter your SQL query here...",
  label = "SQL query",
  height = "250px",
  diffChanges,
  diffSide,
  isComparing = false,
  onEdit,
}: SQLDiffEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monaco = useMonaco();

  const handleCopy = useCallback(async () => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value]);

  const handleClear = useCallback(() => {
    onChange("");
    onEdit?.();
  }, [onChange, onEdit]);

  const handleEditorMount: OnMount = useCallback((editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
    decorationsRef.current = editorInstance.createDecorationsCollection([]);

    // Define custom themes
    monacoInstance.editor.defineTheme("sql-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "0000FF", fontStyle: "bold" },
        { token: "string", foreground: "A31515" },
        { token: "string.sql", foreground: "A31515" },
        { token: "comment", foreground: "008000" },
        { token: "number", foreground: "098658" },
        { token: "operator", foreground: "000000" },
        { token: "identifier", foreground: "001080" },
        { token: "predefined", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#1f2937",
        "editor.lineHighlightBackground": "#f8fafc00",
        "editor.lineHighlightBorder": "#e2e8f0",
        "editorLineNumber.foreground": "#9ca3af",
        "editorLineNumber.activeForeground": "#374151",
        "editorCursor.foreground": "#1e293b",
        "editor.selectionBackground": "#dbeafe",
        "editorGutter.background": "#f9fafb",
      },
    });

    monacoInstance.editor.defineTheme("sql-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
        { token: "string", foreground: "CE9178" },
        { token: "string.sql", foreground: "CE9178" },
        { token: "comment", foreground: "6A9955" },
        { token: "number", foreground: "B5CEA8" },
        { token: "operator", foreground: "D4D4D4" },
        { token: "identifier", foreground: "9CDCFE" },
        { token: "predefined", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#111827",
        "editor.foreground": "#e5e7eb",
        "editor.lineHighlightBackground": "#1f293700",
        "editor.lineHighlightBorder": "#374151",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#f3f4f6",
        "editor.selectionBackground": "#3b82f650",
        "editorGutter.background": "#0f172a",
      },
    });

    // Set initial theme
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    monacoInstance.editor.setTheme(isDarkMode ? "sql-dark" : "sql-light");

    setIsEditorReady(true);
  }, []);

  // Update theme when dark mode changes
  useEffect(() => {
    if (!monaco) return;

    const updateTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      monaco.editor.setTheme(isDarkMode ? "sql-dark" : "sql-light");
    };

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, [monaco]);

  // Apply diff decorations
  useEffect(() => {
    if (!editorRef.current || !decorationsRef.current || !monacoRef.current || !isEditorReady) return;

    const monacoInstance = monacoRef.current;

    if (!isComparing || !diffChanges || !diffSide) {
      decorationsRef.current.set([]);
      return;
    }

    const decorations: editor.IModelDeltaDecoration[] = [];
    let lineNumber = 1;

    diffChanges.forEach((change) => {
      const lines = change.value.split("\n");
      // Remove last empty element if the string ends with newline
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      const lineCount = lines.length;

      if (diffSide === "original") {
        // Original side: highlight removed lines (red)
        if (change.removed) {
          for (let i = 0; i < lineCount; i++) {
            decorations.push({
              range: new monacoInstance.Range(lineNumber + i, 1, lineNumber + i, 1),
              options: {
                isWholeLine: true,
                className: "diff-line-removed",
                linesDecorationsClassName: "diff-gutter-removed",
              },
            });
          }
          lineNumber += lineCount;
        } else if (!change.added) {
          // Unchanged lines
          lineNumber += lineCount;
        }
        // Skip added lines for original side
      } else {
        // Modified side: highlight added lines (green)
        if (change.added) {
          for (let i = 0; i < lineCount; i++) {
            decorations.push({
              range: new monacoInstance.Range(lineNumber + i, 1, lineNumber + i, 1),
              options: {
                isWholeLine: true,
                className: "diff-line-added",
                linesDecorationsClassName: "diff-gutter-added",
              },
            });
          }
          lineNumber += lineCount;
        } else if (!change.removed) {
          // Unchanged lines
          lineNumber += lineCount;
        }
        // Skip removed lines for modified side
      }
    });

    decorationsRef.current.set(decorations);
  }, [diffChanges, diffSide, isComparing, isEditorReady]);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue || "");
      onEdit?.();
    },
    [onChange, onEdit]
  );

  return (
    <div className="relative w-full rounded-lg border border-input bg-background overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          {isComparing && onEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              title="Edit query"
              className="h-7 w-7"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            disabled={!value.trim()}
            title="Copy to clipboard"
            className="h-7 w-7"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            disabled={!value.trim()}
            title="Clear editor"
            className="h-7 w-7"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      {/* Placeholder overlay */}
      {!value && (
        <div className="absolute top-[58px] left-14 text-muted-foreground/60 pointer-events-none z-10 font-mono text-sm">
          {placeholder}
        </div>
      )}
      <Editor
        height={height}
        language={dialectToMonacoLanguage[dialect]}
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 12,
          lineNumbersMinChars: 3,
          renderLineHighlight: "none",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          contextmenu: true,
          automaticLayout: true,
          wordWrap: "on",
          padding: { top: 8, bottom: 8 },
          tabSize: 2,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          renderWhitespace: "none",
          bracketPairColorization: { enabled: true },
          matchBrackets: "always",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          formatOnPaste: true,
          readOnly: false,
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center text-muted-foreground bg-muted/30" style={{ height }}>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading editor...</span>
            </div>
          </div>
        }
      />
      <style jsx global>{`
        .diff-line-added {
          background-color: rgba(34, 197, 94, 0.15) !important;
        }
        .diff-line-removed {
          background-color: rgba(239, 68, 68, 0.15) !important;
        }
        .diff-gutter-added {
          background-color: rgba(34, 197, 94, 0.4) !important;
          width: 4px !important;
          margin-left: 3px;
        }
        .diff-gutter-removed {
          background-color: rgba(239, 68, 68, 0.4) !important;
          width: 4px !important;
          margin-left: 3px;
        }
      `}</style>
    </div>
  );
}
