"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DBMLEditor } from "@/components/tools/dbml-to-sql/dbml-editor";
import { DialectSelector } from "@/components/tools/dbml-to-sql/dialect-selector";
import { FAQSection } from "@/components/tools/dbml-to-sql/faq-section";
import {
  convertDBMLToSQL,
  type DBMLDialect,
  EXAMPLE_DBML,
} from "@/lib/dbml-to-sql";
import { Database, Shield, ArrowRight, AlertCircle } from "lucide-react";

export default function DBMLToSQLPage() {
  const [dbml, setDbml] = useState("");
  const [sql, setSql] = useState("");
  const [dialect, setDialect] = useState<DBMLDialect>("postgresql");
  const [error, setError] = useState<string | null>(null);
  const [isConverted, setIsConverted] = useState(false);

  const handleConvert = useCallback(() => {
    const result = convertDBMLToSQL(dbml, dialect);
    if (result.success && result.sql) {
      setSql(result.sql);
      setError(null);
      setIsConverted(true);
    } else {
      setError(result.error || "Failed to convert DBML");
      setSql("");
      setIsConverted(false);
    }
  }, [dbml, dialect]);

  const handleLoadExample = useCallback(() => {
    setDbml(EXAMPLE_DBML);
    setSql("");
    setError(null);
    setIsConverted(false);
  }, []);

  const handleClear = useCallback(() => {
    setDbml("");
    setSql("");
    setError(null);
    setIsConverted(false);
  }, []);

  const handleDbmlChange = useCallback((value: string) => {
    setDbml(value);
    setError(null);
    setIsConverted(false);
    setSql("");
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            Free Tool
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Free DBML to SQL Converter</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Convert DBML schemas to SQL DDL statements. Supports PostgreSQL, MySQL, and SQL Server.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <DialectSelector value={dialect} onChange={setDialect} />
          <Button variant="outline" size="sm" onClick={handleLoadExample}>
            Load Example
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Conversion Error</p>
              <p className="text-sm text-destructive/90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DBMLEditor
            value={dbml}
            onChange={handleDbmlChange}
            placeholder="Paste your DBML schema here..."
            label="DBML Input"
            height="400px"
            language="dbml"
          />
          <DBMLEditor
            value={sql}
            onChange={setSql}
            placeholder="SQL output will appear here..."
            label={`SQL Output (${dialect === "dbml" ? "DBML" : dialect.toUpperCase()})`}
            height="400px"
            readOnly={true}
            language="sql"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleConvert}
            size="lg"
            disabled={!dbml.trim()}
          >
            <Database className="mr-2 h-4 w-4" />
            Convert to SQL
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {isConverted && (
            <span className="text-sm text-muted-foreground">
              Converted successfully!
            </span>
          )}
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data stays private</p>
            <p className="text-sm text-muted-foreground mt-1">
              All conversion happens entirely in your browser. Your DBML schemas are
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
