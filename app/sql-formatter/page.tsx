"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SQLEditor } from "@/components/tools/sql-formatter/sql-editor";
import { DialectSelector } from "@/components/tools/sql-formatter/dialect-selector";
import { FormatterOptions } from "@/components/tools/sql-formatter/formatter-options";
import { FAQSection } from "@/components/tools/sql-formatter/faq-section";
import {
  formatSQL,
  type FormatterDialect,
  type KeywordCase,
  type IndentStyle,
  DEFAULT_FORMATTER_OPTIONS,
  EXAMPLE_UNFORMATTED_SQL,
} from "@/lib/sql-formatter";
import { Wand2, Shield, AlertCircle } from "lucide-react";

export default function SQLFormatterPage() {
  const [sql, setSQL] = useState("");
  const [dialect, setDialect] = useState<FormatterDialect>(DEFAULT_FORMATTER_OPTIONS.dialect);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>(DEFAULT_FORMATTER_OPTIONS.keywordCase);
  const [indentStyle, setIndentStyle] = useState<IndentStyle>(DEFAULT_FORMATTER_OPTIONS.indentStyle);
  const [tabWidth, setTabWidth] = useState(DEFAULT_FORMATTER_OPTIONS.tabWidth);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleFormat = useCallback(() => {
    const result = formatSQL(sql, {
      dialect,
      keywordCase,
      indentStyle,
      tabWidth,
      useTabs: false,
      linesBetweenQueries: 2,
    });

    if (result.success && result.formattedSQL) {
      setSQL(result.formattedSQL);
      setError(null);
    } else {
      setError(result.error || "Failed to format SQL");
    }
  }, [sql, dialect, keywordCase, indentStyle, tabWidth]);

  const handleLoadExample = useCallback(() => {
    setSQL(EXAMPLE_UNFORMATTED_SQL[dialect]);
    setError(null);
  }, [dialect]);

  const handleClear = useCallback(() => {
    setSQL("");
    setError(null);
  }, []);

  const handleDialectChange = useCallback((newDialect: FormatterDialect) => {
    setDialect(newDialect);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            Free Tool
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Free SQL Formatter</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Beautify and format your SQL queries instantly. Supports multiple database dialects.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <DialectSelector value={dialect} onChange={handleDialectChange} />
            <Button variant="outline" size="sm" onClick={handleLoadExample}>
              Load Example
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm text-primary hover:underline font-medium"
          >
            {showAdvancedOptions ? "Hide advanced options" : "Show advanced options"}
          </button>
        </div>

        {/* Formatter Options */}
        {showAdvancedOptions && (
          <FormatterOptions
            keywordCase={keywordCase}
            indentStyle={indentStyle}
            tabWidth={tabWidth}
            onKeywordCaseChange={setKeywordCase}
            onIndentStyleChange={setIndentStyle}
            onTabWidthChange={setTabWidth}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Formatting Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* SQL Editor */}
        <SQLEditor
          value={sql}
          onChange={setSQL}
          dialect={dialect}
          placeholder="Paste your SQL query here..."
          label="SQL query to format"
        />

        {/* Format Button */}
        <Button
          onClick={handleFormat}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!sql.trim()}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Format SQL
        </Button>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data stays private</p>
            <p className="text-sm text-muted-foreground mt-1">
              All formatting happens entirely in your browser. Your SQL queries are
              never sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="mt-12 rounded-lg border border-teal-500/20 bg-teal-50 dark:bg-teal-950/20 p-6 text-center">
        <h2 className="text-xl font-semibold">Need to visualize your database schema?</h2>
        <p className="mt-2 text-muted-foreground">
          ChartDB instantly creates beautiful ERD diagrams from your database. No direct
          database access required.
        </p>
        <Button asChild className="mt-4">
          <a href="https://app.chartdb.io">
            Try ChartDB Free
          </a>
        </Button>
      </section>
    </div>
  );
}
