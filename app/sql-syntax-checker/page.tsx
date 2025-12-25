"use client";

import { useState, useCallback, useRef } from "react";
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
import { Play, Shield, Sparkles, X } from "lucide-react";

export default function SQLSyntaxCheckerPage() {
  const [sql, setSQL] = useState("");
  const [dialect, setDialect] = useState<SQLDialect>("postgresql");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isFixingWithAI, setIsFixingWithAI] = useState(false);
  const [aiExplanation, setAIExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleValidate = useCallback(() => {
    const validationResult = validateSQL(sql, dialect);
    setResult(validationResult);
  }, [sql, dialect]);

  const handleLoadValidExample = useCallback(() => {
    setSQL(EXAMPLE_QUERIES[dialect]);
    setResult(null);
    setShowExplanation(false);
  }, [dialect]);

  const handleLoadJoinErrorExample = useCallback(() => {
    setSQL(`SELECT u.id, u.name, o.total
FROM users u
LEFT JOIN orders o u.id = o.user_id
WHERE u.active = true`);
    setResult(null);
    setShowExplanation(false);
  }, []);

  const handleLoadKeywordErrorExample = useCallback(() => {
    setSQL(`SELEC id, name, email
FROM users
WHER status = 'active'
ORDER BY created_at`);
    setResult(null);
    setShowExplanation(false);
  }, []);

  const handleClear = useCallback(() => {
    setSQL("");
    setResult(null);
    setShowExplanation(false);
    setAIExplanation("");
  }, []);

  const handleCloseExplanation = useCallback(() => {
    setShowExplanation(false);
    setAIExplanation("");
  }, []);

  const handleSQLChange = useCallback((newSQL: string) => {
    setSQL(newSQL);
    if (result) {
      setResult(null);
    }
    // Don't close explanation when SQL changes during AI streaming
    if (showExplanation && !isFixingWithAI) {
      handleCloseExplanation();
    }
  }, [result, showExplanation, isFixingWithAI, handleCloseExplanation]);

  const handleDialectChange = useCallback((newDialect: SQLDialect) => {
    setDialect(newDialect);
    setResult(null);
  }, []);

  const handleFixWithAI = useCallback(async () => {
    if (!sql.trim() || !result?.error) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // Clear error, show loading message, prepare for streaming
    setResult(null);
    setSQL("-- Loading fix...");
    setIsFixingWithAI(true);
    setAIExplanation("");
    setShowExplanation(true);

    try {
      const response = await fetch("https://chartdb-free-tools.vercel.app/tools/api/fix-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql,
          dialect,
          error: result.error.message,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI fix");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullResponse = "";
      let isInSQLBlock = false;
      let sqlContent = "";
      let explanationContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        fullResponse += text;

        // Parse the response to extract SQL and explanation
        // Format: <<<SQL>>>\n[sql]\n<<<END_SQL>>>\n[explanation]

        if (!isInSQLBlock && fullResponse.includes("<<<SQL>>>")) {
          isInSQLBlock = true;
        }

        if (isInSQLBlock && !fullResponse.includes("<<<END_SQL>>>")) {
          // We're in the SQL block, extract and stream SQL to editor
          const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
          sqlContent = fullResponse.substring(sqlStart).trim();
          setSQL(sqlContent);
        } else if (fullResponse.includes("<<<END_SQL>>>")) {
          // SQL block is complete, now we're in explanation
          const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
          const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
          sqlContent = fullResponse.substring(sqlStart, sqlEnd).trim();
          setSQL(sqlContent);

          // Get explanation (everything after <<<END_SQL>>>)
          const expStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
          explanationContent = fullResponse.substring(expStart).trim();
          setAIExplanation(explanationContent);
        }
      }

      // Final parse after stream completes
      if (fullResponse.includes("<<<SQL>>>") && fullResponse.includes("<<<END_SQL>>>")) {
        const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
        const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
        sqlContent = fullResponse.substring(sqlStart, sqlEnd).trim();
        setSQL(sqlContent);

        const expStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
        explanationContent = fullResponse.substring(expStart).trim();
        setAIExplanation(explanationContent);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error fixing with AI:", err);
        setAIExplanation("Sorry, there was an error processing your request. Please try again.");
      }
    } finally {
      setIsFixingWithAI(false);
    }
  }, [sql, dialect, result]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            Free Tool
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Free SQL Syntax Checker</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Validate your SQL queries instantly. Supports multiple database dialects.
        </p>
      </div>

      {/* Editor Section */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <DialectSelector value={dialect} onChange={handleDialectChange} />
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={handleLoadValidExample}>
              Valid Query
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadJoinErrorExample}>
              Bad JOIN
            </Button>
            <Button variant="outline" size="sm" onClick={handleLoadKeywordErrorExample}>
              Typo in Keyword
            </Button>
          </div>
        </div>

        {/* Error Result - Above Editor */}
        <ValidationResultDisplay
          result={result}
          sql={sql}
          dialect={dialect}
          onFixWithAI={handleFixWithAI}
          isFixingWithAI={isFixingWithAI}
        />

        {/* SQL Editor */}
        <SQLEditor
          value={sql}
          onChange={handleSQLChange}
          dialect={dialect}
          placeholder="Enter your SQL query here..."
          validationResult={result}
          onClear={handleClear}
          onFixWithAI={handleFixWithAI}
          isFixingWithAI={isFixingWithAI}
        />

        {/* Validate Button */}
        <Button
          onClick={handleValidate}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!sql.trim() || isFixingWithAI}
        >
          <Play className="mr-2 h-4 w-4" />
          Validate SQL
        </Button>

        {/* AI Explanation Display */}
        {showExplanation && (
          <div className="rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {isFixingWithAI ? "AI is fixing your query..." : "AI Fix Applied"}
                  </p>
                  {aiExplanation ? (
                    <p className="text-sm text-foreground/80 mt-1">{aiExplanation}</p>
                  ) : isFixingWithAI ? (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                      Generating fix...
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                onClick={handleCloseExplanation}
                className="text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
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
