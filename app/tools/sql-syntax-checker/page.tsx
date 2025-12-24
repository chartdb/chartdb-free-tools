"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SQLEditor } from "@/components/tools/sql-syntax-checker/sql-editor";
import { DialectSelector } from "@/components/tools/sql-syntax-checker/dialect-selector";
import { ValidationResultDisplay } from "@/components/tools/sql-syntax-checker/validation-result";
import { FAQSection } from "@/components/tools/sql-syntax-checker/faq-section";
import {
  validateSQL,
  type SQLDialect,
  type ValidationResult,
  EXAMPLE_QUERIES,
} from "@/lib/sql-validator";
import { Play, FileCode, Trash2, Shield } from "lucide-react";

export default function SQLSyntaxCheckerPage() {
  const [sql, setSQL] = useState("");
  const [dialect, setDialect] = useState<SQLDialect>("postgresql");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    const validationResult = validateSQL(sql, dialect);
    setResult(validationResult);
  }, [sql, dialect]);

  const handleLoadExample = useCallback(() => {
    setSQL(EXAMPLE_QUERIES[dialect]);
    setResult(null);
  }, [dialect]);

  const handleClear = useCallback(() => {
    setSQL("");
    setResult(null);
  }, []);

  const handleDialectChange = useCallback((newDialect: SQLDialect) => {
    setDialect(newDialect);
    setResult(null);
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
        <h1 className="text-3xl font-bold tracking-tight">SQL Syntax Checker</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Validate your SQL queries instantly. Supports multiple database dialects.
        </p>
      </div>

      {/* Editor Section */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DialectSelector value={dialect} onChange={handleDialectChange} />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadExample}>
              <FileCode className="mr-2 h-4 w-4" />
              Load Example
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* SQL Editor */}
        <SQLEditor
          value={sql}
          onChange={setSQL}
          dialect={dialect}
          placeholder="Enter your SQL query here..."
        />

        {/* Validate Button */}
        <Button onClick={handleValidate} className="w-full sm:w-auto" size="lg">
          <Play className="mr-2 h-4 w-4" />
          Validate SQL
        </Button>

        {/* Results */}
        <ValidationResultDisplay result={result} />

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data stays private</p>
            <p className="text-sm text-muted-foreground mt-1">
              All validation happens entirely in your browser. Your SQL queries are
              never sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <h2 className="text-xl font-semibold">Need to visualize your database schema?</h2>
        <p className="mt-2 text-muted-foreground">
          ChartDB instantly creates beautiful ERD diagrams from your database. No direct
          database access required.
        </p>
        <Button asChild className="mt-4">
          <a href="https://chartdb.io" target="_blank" rel="noopener noreferrer">
            Try ChartDB Free
          </a>
        </Button>
      </section>
    </div>
  );
}
