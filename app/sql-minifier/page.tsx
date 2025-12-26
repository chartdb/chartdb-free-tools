"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SQLEditor } from "@/components/tools/sql-minifier/sql-editor";
import { DialectSelector } from "@/components/tools/sql-minifier/dialect-selector";
import { FAQSection } from "@/components/tools/sql-minifier/faq-section";
import {
  minifySQL,
  type MinifierDialect,
  EXAMPLE_SQL,
} from "@/lib/sql-minifier";
import { Minimize2, Shield, AlertCircle } from "lucide-react";

export default function SQLMinifierPage() {
  const [sql, setSQL] = useState("");
  const [dialect, setDialect] = useState<MinifierDialect>("postgresql");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ originalSize: number; minifiedSize: number; savings: number } | null>(null);
  const [removeComments, setRemoveComments] = useState(true);

  const handleMinify = useCallback(() => {
    const result = minifySQL(sql, { removeComments, preserveStringWhitespace: true });

    if (result.success && result.minifiedSQL) {
      setSQL(result.minifiedSQL);
      setStats({
        originalSize: result.originalSize!,
        minifiedSize: result.minifiedSize!,
        savings: result.savings!,
      });
      setError(null);
    } else {
      setError(result.error || "Failed to minify SQL");
      setStats(null);
    }
  }, [sql, removeComments]);

  const handleLoadExample = useCallback(() => {
    setSQL(EXAMPLE_SQL[dialect]);
    setStats(null);
    setError(null);
  }, [dialect]);

  const handleClear = useCallback(() => {
    setSQL("");
    setStats(null);
    setError(null);
  }, []);

  const handleSQLChange = useCallback((newSQL: string) => {
    setSQL(newSQL);
    setStats(null);
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
        <h1 className="text-3xl font-bold tracking-tight">Free SQL Minifier</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Compress your SQL queries by removing whitespace and comments. Reduce query size instantly.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <DialectSelector value={dialect} onChange={setDialect} />
            <Button variant="outline" size="sm" onClick={handleLoadExample}>
              Load Example
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="rounded border-gray-300"
            />
            Remove comments
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Minification Error</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Display */}
        {stats && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2">
            <Minimize2 className="h-4 w-4" />
            <span>
              Compressed: {stats.originalSize} → {stats.minifiedSize} characters ({stats.savings}% smaller)
            </span>
          </div>
        )}

        {/* SQL Editor */}
        <SQLEditor
          value={sql}
          onChange={handleSQLChange}
          dialect={dialect}
          placeholder="Paste your SQL query here..."
          label="SQL query to minify"
          onClear={handleClear}
        />

        {/* Minify Button */}
        <Button
          onClick={handleMinify}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!sql.trim()}
        >
          <Minimize2 className="mr-2 h-4 w-4" />
          Minify SQL
        </Button>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data stays private</p>
            <p className="text-sm text-muted-foreground mt-1">
              All minification happens entirely in your browser. Your SQL queries are
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
