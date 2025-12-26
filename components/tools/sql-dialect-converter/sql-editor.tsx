"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { type ConverterDialect } from "@/lib/sql-dialect-converter";
import { DbLogo } from "@/components/ui/db-logo";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Check } from "lucide-react";

interface SQLEditorProps {
  value: string;
  onChange?: (value: string) => void;
  dialect: ConverterDialect;
  placeholder?: string;
  label: string;
  readOnly?: boolean;
  height?: string;
}

const dialectToMonacoLanguage: Record<ConverterDialect, string> = {
  postgresql: "pgsql",
  mysql: "mysql",
  mariadb: "mysql",
  sqlite: "sql",
  sqlserver: "sql",
};

export function SQLEditor({
  value,
  onChange,
  dialect,
  placeholder = "Enter SQL here...",
  label,
  readOnly = false,
  height = "250px",
}: SQLEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [copied, setCopied] = useState(false);
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
    onChange?.("");
  }, [onChange]);

  const handleEditorMount: OnMount = useCallback(
    (editorInstance, monacoInstance) => {
      editorRef.current = editorInstance;
      monacoRef.current = monacoInstance;

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

      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      monacoInstance.editor.setTheme(isDarkMode ? "sql-dark" : "sql-light");
    },
    []
  );

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

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange?.(newValue || "");
    },
    [onChange]
  );

  return (
    <div className="relative w-full rounded-lg border border-input bg-background overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <DbLogo dialect={dialect} />
        </div>
        <div className="flex items-center gap-1">
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
          {!readOnly && (
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
          )}
        </div>
      </div>
      {!value && !readOnly && (
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
          fontSize: 14,
          fontFamily:
            "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 16,
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
          padding: { top: 12, bottom: 12 },
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
          readOnly,
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
        loading={
          <div
            className="flex items-center justify-center text-muted-foreground bg-muted/30"
            style={{ height }}
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading editor...</span>
            </div>
          </div>
        }
      />
    </div>
  );
}
