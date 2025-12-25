"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialectSelector } from "@/components/tools/text-to-sql/dialect-selector";
import { FAQSection } from "@/components/tools/text-to-sql/faq-section";
import {
  type TextToSQLDialect,
  EXAMPLE_PROMPT,
  EXAMPLE_SCHEMA,
} from "@/lib/text-to-sql";
import { Sparkles, Copy, Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function TextToSQLPage() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState("");
  const [dialect, setDialect] = useState<TextToSQLDialect>("postgresql");
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setGeneratedSQL("");
    setExplanation("");
    setError(null);

    try {
      const response = await fetch("https://chartdb-free-tools.vercel.app/tools/api/text-to-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, schema, dialect }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to generate SQL");
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

        // Parse the response to extract SQL and explanation
        if (fullResponse.includes("<<<SQL>>>")) {
          if (fullResponse.includes("<<<END_SQL>>>")) {
            const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
            const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
            const sqlContent = fullResponse.substring(sqlStart, sqlEnd).trim();
            setGeneratedSQL(sqlContent);

            const expStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
            const explanationContent = fullResponse.substring(expStart).trim();
            setExplanation(explanationContent);
          } else {
            const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
            const sqlContent = fullResponse.substring(sqlStart).trim();
            setGeneratedSQL(sqlContent);
          }
        }
      }

      // Final parse
      if (fullResponse.includes("<<<SQL>>>") && fullResponse.includes("<<<END_SQL>>>")) {
        const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
        const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
        setGeneratedSQL(fullResponse.substring(sqlStart, sqlEnd).trim());

        const expStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
        setExplanation(fullResponse.substring(expStart).trim());
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error generating SQL:", err);
        setError("Failed to generate SQL. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, schema, dialect]);

  const handleLoadExample = useCallback(() => {
    setPrompt(EXAMPLE_PROMPT);
    setSchema(EXAMPLE_SCHEMA);
    setShowSchema(true);
    setGeneratedSQL("");
    setExplanation("");
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setPrompt("");
    setSchema("");
    setGeneratedSQL("");
    setExplanation("");
    setError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!generatedSQL) return;
    try {
      await navigator.clipboard.writeText(generatedSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [generatedSQL]);

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
        <h1 className="text-3xl font-bold tracking-tight">Free Text to SQL AI Converter</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Transform natural language into SQL queries using AI. Describe what you need in plain English.
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

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe what you want to query</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Get all users who signed up in the last 30 days and have made at least one purchase..."
            className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {/* Schema Toggle */}
        <button
          onClick={() => setShowSchema(!showSchema)}
          className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          {showSchema ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showSchema ? "Hide schema" : "Add database schema (optional)"}
        </button>

        {/* Schema Input */}
        {showSchema && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Database Schema</label>
            <textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              placeholder="Paste your CREATE TABLE statements here for more accurate results..."
              className="w-full min-h-[150px] p-3 rounded-lg border border-input bg-background text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground">
              Providing your schema helps generate more accurate queries with correct table and column names.
            </p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!prompt.trim() || isGenerating}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate SQL"}
        </Button>

        {/* Generated SQL Output */}
        {(generatedSQL || isGenerating) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated SQL</label>
              {generatedSQL && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="relative rounded-lg border border-input bg-muted/30 p-4 font-mono text-sm overflow-x-auto">
              {isGenerating && !generatedSQL ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Generating SQL...
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{generatedSQL}</pre>
              )}
            </div>
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="rounded-lg border border-purple-500/30 bg-purple-50 dark:bg-purple-950/20 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  AI Explanation
                </p>
                <p className="text-sm text-foreground/80 mt-1">{explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Powered by AI</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your prompts are processed by AI to generate SQL. We don&apos;t store your queries.
              Always review generated SQL before running on production databases.
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
