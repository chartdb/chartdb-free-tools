"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SQLDiffEditor } from "@/components/tools/sql-compare/sql-diff-editor";
import { UnifiedDiffViewer } from "@/components/tools/sql-compare/unified-diff-viewer";
import { DialectSelector } from "@/components/tools/sql-compare/dialect-selector";
import { FAQSection } from "@/components/tools/sql-compare/faq-section";
import {
  compareSQL,
  type CompareDialect,
  type CompareResult,
  EXAMPLE_ORIGINAL_SQL,
  EXAMPLE_MODIFIED_SQL,
} from "@/lib/sql-compare";
import { GitCompare, Shield, Plus, Minus, Columns, AlignJustify } from "lucide-react";

type ViewMode = "split" | "unified";

export default function SQLComparePage() {
  const [originalSQL, setOriginalSQL] = useState("");
  const [modifiedSQL, setModifiedSQL] = useState("");
  const [dialect, setDialect] = useState<CompareDialect>("postgresql");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const handleCompare = useCallback(() => {
    if (!originalSQL.trim() && !modifiedSQL.trim()) return;
    const comparisonResult = compareSQL(originalSQL, modifiedSQL);
    setResult(comparisonResult);
    setIsComparing(true);
  }, [originalSQL, modifiedSQL]);

  const handleLoadExample = useCallback(() => {
    setOriginalSQL(EXAMPLE_ORIGINAL_SQL[dialect]);
    setModifiedSQL(EXAMPLE_MODIFIED_SQL[dialect]);
    setResult(null);
    setIsComparing(false);
  }, [dialect]);

  const handleClear = useCallback(() => {
    setOriginalSQL("");
    setModifiedSQL("");
    setResult(null);
    setIsComparing(false);
  }, []);

  const handleSwap = useCallback(() => {
    const temp = originalSQL;
    setOriginalSQL(modifiedSQL);
    setModifiedSQL(temp);
    setResult(null);
    setIsComparing(false);
  }, [originalSQL, modifiedSQL]);

  const handleEdit = useCallback(() => {
    setIsComparing(false);
    setResult(null);
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
        <h1 className="text-3xl font-bold tracking-tight">Free SQL Compare</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Compare two SQL queries side by side. Instantly see additions, deletions, and modifications.
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
            <Button variant="outline" size="sm" onClick={handleSwap}>
              Swap Queries
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "split" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="h-7 px-2"
            >
              <Columns className="h-4 w-4 mr-1" />
              Split
            </Button>
            <Button
              variant={viewMode === "unified" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("unified")}
              className="h-7 px-2"
            >
              <AlignJustify className="h-4 w-4 mr-1" />
              Unified
            </Button>
          </div>
        </div>

        {/* Stats Display */}
        {result && isComparing && (
          <div className="flex flex-wrap items-center gap-4 text-sm bg-muted/30 rounded-lg px-4 py-2">
            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <Plus className="h-4 w-4" />
              {result.additions} added
            </span>
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <Minus className="h-4 w-4" />
              {result.deletions} removed
            </span>
            <span className="text-muted-foreground">
              {result.unchanged} unchanged
            </span>
            {!result.hasChanges && (
              <span className="text-muted-foreground ml-2">
                — Both queries are identical
              </span>
            )}
          </div>
        )}

        {/* Split View - Side by Side Editors */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SQLDiffEditor
              value={originalSQL}
              onChange={setOriginalSQL}
              dialect={dialect}
              placeholder="Paste your original SQL query here..."
              label="Original Query"
              height="300px"
              diffChanges={result?.changes}
              diffSide="original"
              isComparing={isComparing}
              onEdit={handleEdit}
            />
            <SQLDiffEditor
              value={modifiedSQL}
              onChange={setModifiedSQL}
              dialect={dialect}
              placeholder="Paste your modified SQL query here..."
              label="Modified Query"
              height="300px"
              diffChanges={result?.changes}
              diffSide="modified"
              isComparing={isComparing}
              onEdit={handleEdit}
            />
          </div>
        )}

        {/* Unified View */}
        {viewMode === "unified" && (
          <>
            {isComparing && result ? (
              <UnifiedDiffViewer
                changes={result.changes}
                originalSQL={originalSQL}
                modifiedSQL={modifiedSQL}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SQLDiffEditor
                  value={originalSQL}
                  onChange={setOriginalSQL}
                  dialect={dialect}
                  placeholder="Paste your original SQL query here..."
                  label="Original Query"
                  height="300px"
                  isComparing={false}
                />
                <SQLDiffEditor
                  value={modifiedSQL}
                  onChange={setModifiedSQL}
                  dialect={dialect}
                  placeholder="Paste your modified SQL query here..."
                  label="Modified Query"
                  height="300px"
                  isComparing={false}
                />
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isComparing && viewMode === "unified" && (
            <Button variant="outline" onClick={handleEdit} size="lg">
              Edit Queries
            </Button>
          )}
          <Button
            onClick={handleCompare}
            size="lg"
            disabled={!originalSQL.trim() && !modifiedSQL.trim()}
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {isComparing ? "Re-Compare" : "Compare Queries"}
          </Button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data stays private</p>
            <p className="text-sm text-muted-foreground mt-1">
              All comparison happens entirely in your browser. Your SQL queries are
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
