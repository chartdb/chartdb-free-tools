"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { SQLDialect, ValidationResult } from "@/lib/sql-validator";

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  dialect: SQLDialect;
  placeholder?: string;
  validationResult?: ValidationResult | null;
}

const dialectToMonacoLanguage: Record<SQLDialect, string> = {
  postgresql: "pgsql",
  mysql: "mysql",
  mariadb: "mysql",
  sqlite: "sql",
  transactsql: "sql",
  bigquery: "sql",
};

export function SQLEditor({
  value,
  onChange,
  dialect,
  placeholder = "Enter your SQL query here...",
  validationResult,
}: SQLEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monaco = useMonaco();

  const handleEditorMount: OnMount = useCallback((editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
    decorationsRef.current = editorInstance.createDecorationsCollection([]);

    // Define custom themes with better colors
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

    // Set initial theme based on current mode
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

    // Watch for class changes on document
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, [monaco]);

  // Handle error highlighting
  useEffect(() => {
    if (!editorRef.current || !decorationsRef.current || !monacoRef.current || !isEditorReady) return;

    const monacoInstance = monacoRef.current;
    const model = editorRef.current.getModel();
    if (!model) return;

    // If there's an error, highlight it
    if (validationResult && !validationResult.isValid && validationResult.error) {
      // Use error location if available, otherwise default to line 1
      const errorLine = validationResult.error.location?.line || 1;
      const errorColumn = validationResult.error.location?.column || 1;
      const lineCount = model.getLineCount();
      const line = Math.min(errorLine, lineCount); // Ensure line is within bounds
      const maxColumn = model.getLineMaxColumn(line);
      const startColumn = Math.min(errorColumn, maxColumn);

      // Get the line content to find error extent
      const lineContent = model.getLineContent(line);
      // Find word at error position or use rest of line
      let endColumn = maxColumn;
      if (startColumn < lineContent.length) {
        // Find the end of the current word/token
        const restOfLine = lineContent.substring(startColumn - 1);
        const wordMatch = restOfLine.match(/^\S+/);
        if (wordMatch) {
          endColumn = startColumn + wordMatch[0].length;
        }
      }

      // Set line decoration (background highlight)
      decorationsRef.current.set([
        {
          range: new monacoInstance.Range(line, 1, line, maxColumn),
          options: {
            isWholeLine: true,
            className: "sql-error-line",
            linesDecorationsClassName: "sql-error-line-decoration",
            overviewRuler: {
              color: "#ef4444",
              position: monacoInstance.editor.OverviewRulerLane.Full,
            },
          },
        },
      ]);

      // Set markers for squiggly underline
      monacoInstance.editor.setModelMarkers(model, "sql-validator", [
        {
          severity: monacoInstance.MarkerSeverity.Error,
          startLineNumber: line,
          startColumn: startColumn,
          endLineNumber: line,
          endColumn: endColumn,
          message: validationResult.error.message,
        },
      ]);

      // Reveal the error line
      editorRef.current.revealLineInCenter(line);
    } else {
      // Clear decorations when there's no error or validation is successful
      decorationsRef.current.set([]);
      // Clear markers
      const model = editorRef.current.getModel();
      if (model) {
        monacoInstance.editor.setModelMarkers(model, "sql-validator", []);
      }
    }
  }, [validationResult, isEditorReady]);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue || "");
    },
    [onChange]
  );

  return (
    <div className="relative w-full rounded-lg border border-input bg-background overflow-hidden shadow-sm">
      {/* Placeholder overlay */}
      {!value && (
        <div className="absolute top-3 left-14 text-muted-foreground/60 pointer-events-none z-10 font-mono text-sm">
          {placeholder}
        </div>
      )}
      <Editor
        height="280px"
        language={dialectToMonacoLanguage[dialect]}
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 16,
          lineNumbersMinChars: 3,
          renderLineHighlight: "line",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          overviewRulerBorder: false,
          overviewRulerLanes: 1,
          hideCursorInOverviewRuler: false,
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
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-[280px] text-muted-foreground bg-muted/30">
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
