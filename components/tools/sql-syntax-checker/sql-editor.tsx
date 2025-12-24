"use client";

import { useRef, useEffect, useCallback } from "react";
import { EditorView, keymap, placeholder as placeholderExt } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { sql, PostgreSQL, MySQL, MariaSQL, SQLite, MSSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import type { SQLDialect } from "@/lib/sql-validator";

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  dialect: SQLDialect;
  placeholder?: string;
}

const dialectToSQLConfig: Record<SQLDialect, ReturnType<typeof sql>> = {
  postgresql: sql({ dialect: PostgreSQL }),
  mysql: sql({ dialect: MySQL }),
  mariadb: sql({ dialect: MariaSQL }),
  sqlite: sql({ dialect: SQLite }),
  transactsql: sql({ dialect: MSSQL }),
  bigquery: sql({ dialect: MySQL }), // BigQuery syntax is closest to MySQL
};

export function SQLEditor({
  value,
  onChange,
  dialect,
  placeholder = "Enter your SQL query here...",
}: SQLEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);

  const handleChange = useCallback(
    (update: { docChanged: boolean; state: EditorState }) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous editor if it exists
    if (editorRef.current) {
      editorRef.current.destroy();
    }

    const extensions = [
      dialectToSQLConfig[dialect],
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      syntaxHighlighting(defaultHighlightStyle),
      placeholderExt(placeholder),
      EditorView.updateListener.of(handleChange),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        },
        ".cm-content": {
          padding: "12px 0",
          minHeight: "200px",
        },
        ".cm-line": {
          padding: "0 12px",
        },
        ".cm-gutters": {
          backgroundColor: "transparent",
          border: "none",
          paddingLeft: "8px",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "transparent",
        },
        "&.cm-focused": {
          outline: "none",
        },
        ".cm-scroller": {
          overflow: "auto",
        },
      }),
      EditorView.lineWrapping,
    ];

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDarkMode) {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    editorRef.current = new EditorView({
      state,
      parent: containerRef.current,
    });

    return () => {
      editorRef.current?.destroy();
    };
    // Only re-create editor when dialect changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialect]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.state.doc.toString();
      if (currentValue !== value) {
        editorRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="min-h-[200px] w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden"
    />
  );
}
