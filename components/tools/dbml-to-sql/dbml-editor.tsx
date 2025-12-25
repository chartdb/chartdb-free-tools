"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Editor, { OnMount, useMonaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Check } from "lucide-react";

interface DBMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  height?: string;
  readOnly?: boolean;
  language?: "dbml" | "sql";
}

export function DBMLEditor({
  value,
  onChange,
  placeholder = "Enter your DBML here...",
  label = "DBML",
  height = "350px",
  readOnly = false,
  language = "dbml",
}: DBMLEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
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
    onChange("");
  }, [onChange]);

  const handleEditorMount: OnMount = useCallback((editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;

    // Register DBML language if not already registered
    if (!monacoInstance.languages.getLanguages().some((lang: { id: string }) => lang.id === "dbml")) {
      monacoInstance.languages.register({ id: "dbml" });
      monacoInstance.languages.setMonarchTokensProvider("dbml", {
        keywords: [
          "Table", "table", "Ref", "ref", "Enum", "enum", "TableGroup", "tablegroup",
          "Project", "project", "Note", "note", "as", "pk", "primary", "key",
          "unique", "not", "null", "default", "increment", "indexes"
        ],
        typeKeywords: [
          "int", "integer", "bigint", "smallint", "tinyint",
          "varchar", "char", "text", "nvarchar", "nchar",
          "decimal", "numeric", "float", "double", "real",
          "date", "datetime", "timestamp", "time",
          "boolean", "bool", "blob", "binary", "uuid"
        ],
        operators: ["-", "<", ">", "<>", "-"],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", "@string_double"],
            [/'/, "string", "@string_single"],
            [/`/, "string", "@string_backtick"],
            [/\[/, "delimiter.bracket", "@bracket"],
            [/\{/, "delimiter.curly", "@curly"],
            [/[a-zA-Z_]\w*/, {
              cases: {
                "@keywords": "keyword",
                "@typeKeywords": "type",
                "@default": "identifier"
              }
            }],
            [/[{}()\[\]]/, "@brackets"],
            [/@symbols/, {
              cases: {
                "@operators": "operator",
                "@default": ""
              }
            }],
            [/\d+/, "number"],
          ],
          comment: [
            [/[^\/*]+/, "comment"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"]
          ],
          string_double: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, "string", "@pop"]
          ],
          string_single: [
            [/[^\\']+/, "string"],
            [/\\./, "string.escape"],
            [/'/, "string", "@pop"]
          ],
          string_backtick: [
            [/[^\\`]+/, "string"],
            [/\\./, "string.escape"],
            [/`/, "string", "@pop"]
          ],
          bracket: [
            [/[^\]]+/, "annotation"],
            [/\]/, "delimiter.bracket", "@pop"]
          ],
          curly: [
            [/[^}]+/, ""],
            [/}/, "delimiter.curly", "@pop"]
          ],
        },
      });
    }

    // Define custom themes
    monacoInstance.editor.defineTheme("dbml-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "0000FF", fontStyle: "bold" },
        { token: "type", foreground: "267F99" },
        { token: "string", foreground: "A31515" },
        { token: "comment", foreground: "008000" },
        { token: "number", foreground: "098658" },
        { token: "identifier", foreground: "001080" },
        { token: "annotation", foreground: "795E26" },
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

    monacoInstance.editor.defineTheme("dbml-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
        { token: "type", foreground: "4EC9B0" },
        { token: "string", foreground: "CE9178" },
        { token: "comment", foreground: "6A9955" },
        { token: "number", foreground: "B5CEA8" },
        { token: "identifier", foreground: "9CDCFE" },
        { token: "annotation", foreground: "DCDCAA" },
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
    monacoInstance.editor.setTheme(isDarkMode ? "dbml-dark" : "dbml-light");
  }, []);

  // Update theme when dark mode changes
  useEffect(() => {
    if (!monaco) return;

    const updateTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      monaco.editor.setTheme(isDarkMode ? "dbml-dark" : "dbml-light");
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
      onChange(newValue || "");
    },
    [onChange]
  );

  return (
    <div className="relative w-full rounded-lg border border-input bg-background overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
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
      {/* Placeholder overlay */}
      {!value && (
        <div className="absolute top-[58px] left-14 text-muted-foreground/60 pointer-events-none z-10 font-mono text-sm">
          {placeholder}
        </div>
      )}
      <Editor
        height={height}
        language={language === "sql" ? "sql" : "dbml"}
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
          readOnly,
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
    </div>
  );
}
