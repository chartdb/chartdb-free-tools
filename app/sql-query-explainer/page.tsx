"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SQLEditor } from "@/components/tools/sql-query-explainer/sql-editor";
import { DialectSelector } from "@/components/tools/sql-query-explainer/dialect-selector";
import { ExplanationDisplay } from "@/components/tools/sql-query-explainer/explanation-display";
import { FAQSection } from "@/components/tools/sql-query-explainer/faq-section";
import { type SQLExplainerDialect, EXAMPLE_QUERY } from "@/lib/sql-explainer";
import { BookOpen, AlertCircle, Sparkles } from "lucide-react";

function getApiUrl(endpoint: string): string {
  return `https://chartdb-free-tools.vercel.app/tools/api/${endpoint}`;
}

export default function SQLQueryExplainerPage() {
  const [sql, setSQL] = useState("");
  const [dialect, setDialect] = useState<SQLExplainerDialect>("postgresql");
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleExplain = useCallback(async () => {
    if (!sql.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsExplaining(true);
    setExplanation("");
    setError(null);

    try {
      const response = await fetch(getApiUrl("explain-sql"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql, dialect }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to explain SQL");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        fullResponse += text;

        // Parse the response to extract explanation
        if (fullResponse.includes("<<<EXPLANATION>>>")) {
          if (fullResponse.includes("<<<END_EXPLANATION>>>")) {
            const start = fullResponse.indexOf("<<<EXPLANATION>>>") + 17;
            const end = fullResponse.indexOf("<<<END_EXPLANATION>>>");
            setExplanation(fullResponse.substring(start, end).trim());
          } else {
            const start = fullResponse.indexOf("<<<EXPLANATION>>>") + 17;
            setExplanation(fullResponse.substring(start).trim());
          }
        }
      }

      // Final parse
      if (
        fullResponse.includes("<<<EXPLANATION>>>") &&
        fullResponse.includes("<<<END_EXPLANATION>>>")
      ) {
        const start = fullResponse.indexOf("<<<EXPLANATION>>>") + 17;
        const end = fullResponse.indexOf("<<<END_EXPLANATION>>>");
        setExplanation(fullResponse.substring(start, end).trim());
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error explaining SQL:", err);
        setError("Failed to explain SQL. Please try again.");
      }
    } finally {
      setIsExplaining(false);
    }
  }, [sql, dialect]);

  const handleLoadExample = useCallback(() => {
    setSQL(EXAMPLE_QUERY);
    setExplanation("");
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setSQL("");
    setExplanation("");
    setError(null);
  }, []);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            Free Tool
          </Badge>
          <Badge className="text-xs bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">
            AI-Powered
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Free SQL Query Explainer
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Paste any SQL query and get a clear, step-by-step explanation in plain
          English.
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
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Error</p>
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
        />

        {/* Explain Button */}
        <Button
          onClick={handleExplain}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!sql.trim() || isExplaining}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          {isExplaining ? "Explaining..." : "Explain Query"}
        </Button>

        {/* Explanation Display */}
        {(explanation || isExplaining) && (
          <ExplanationDisplay explanation={explanation} isLoading={isExplaining} />
        )}

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Powered by AI</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your SQL queries are processed by AI to generate explanations. We
              don&apos;t store your queries.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="mt-12 rounded-lg border border-teal-500/20 bg-teal-50 dark:bg-teal-950/20 p-6 text-center">
        <h2 className="text-xl font-semibold">
          Want to visualize the database schema?
        </h2>
        <p className="mt-2 text-muted-foreground">
          ChartDB instantly creates beautiful ERD diagrams from your database.
          See how your tables connect visually.
        </p>
        <Button asChild className="mt-4">
          <a href="https://app.chartdb.io">Open in ChartDB</a>
        </Button>
      </section>
    </div>
  );
}
