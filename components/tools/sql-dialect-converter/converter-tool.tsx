"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialectSelector } from "./dialect-selector";
import { SQLEditor } from "./sql-editor";
import { ConversionOutput } from "./conversion-output";
import { FAQSection } from "./faq-section";
import { RelatedConversions } from "./related-conversions";
import {
  type ConverterDialect,
  type ConversionPair,
  EXAMPLE_SQL,
  getDialectById,
} from "@/lib/sql-dialect-converter";
import { ArrowRightLeft, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

interface ConverterToolProps {
  initialSource?: ConverterDialect;
  initialTarget?: ConverterDialect;
  conversionPair?: ConversionPair;
  showRelated?: boolean;
}

export function ConverterTool({
  initialSource = "mysql",
  initialTarget = "postgresql",
  conversionPair,
  showRelated = false,
}: ConverterToolProps) {
  const [sourceDialect, setSourceDialect] = useState<ConverterDialect>(initialSource);
  const [targetDialect, setTargetDialect] = useState<ConverterDialect>(initialTarget);
  const [inputSQL, setInputSQL] = useState("");
  const [outputSQL, setOutputSQL] = useState("");
  const [summary, setSummary] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Update dialects when props change
  useEffect(() => {
    setSourceDialect(initialSource);
    setTargetDialect(initialTarget);
  }, [initialSource, initialTarget]);

  const handleConvert = useCallback(async () => {
    if (!inputSQL.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsConverting(true);
    setOutputSQL("");
    setSummary("");
    setError(null);

    try {
      const response = await fetch("/tools/api/convert-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: inputSQL,
          sourceDialect,
          targetDialect,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to convert SQL");
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

        // Parse the response to extract SQL and summary
        if (fullResponse.includes("<<<SQL>>>")) {
          if (fullResponse.includes("<<<END_SQL>>>")) {
            const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
            const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
            setOutputSQL(fullResponse.substring(sqlStart, sqlEnd).trim());

            const summaryStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
            setSummary(fullResponse.substring(summaryStart).trim());
          } else {
            const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
            setOutputSQL(fullResponse.substring(sqlStart).trim());
          }
        }
      }

      // Final parse
      if (
        fullResponse.includes("<<<SQL>>>") &&
        fullResponse.includes("<<<END_SQL>>>")
      ) {
        const sqlStart = fullResponse.indexOf("<<<SQL>>>") + 9;
        const sqlEnd = fullResponse.indexOf("<<<END_SQL>>>");
        setOutputSQL(fullResponse.substring(sqlStart, sqlEnd).trim());

        const summaryStart = fullResponse.indexOf("<<<END_SQL>>>") + 13;
        setSummary(fullResponse.substring(summaryStart).trim());
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error converting SQL:", err);
        setError("Failed to convert SQL. Please try again.");
      }
    } finally {
      setIsConverting(false);
    }
  }, [inputSQL, sourceDialect, targetDialect]);

  const handleLoadExample = useCallback(() => {
    setInputSQL(EXAMPLE_SQL[sourceDialect]);
    setOutputSQL("");
    setSummary("");
    setError(null);
  }, [sourceDialect]);

  const handleClear = useCallback(() => {
    setInputSQL("");
    setOutputSQL("");
    setSummary("");
    setError(null);
  }, []);

  const handleSwapDialects = useCallback(() => {
    const newSource = targetDialect;
    const newTarget = sourceDialect;
    setSourceDialect(newSource);
    setTargetDialect(newTarget);
    // If there's output, make it the new input
    if (outputSQL) {
      setInputSQL(outputSQL);
      setOutputSQL("");
      setSummary("");
    }
  }, [sourceDialect, targetDialect, outputSQL]);

  const sourceName = getDialectById(sourceDialect)?.name || sourceDialect;
  const targetName = getDialectById(targetDialect)?.name || targetDialect;

  return (
    <>
      {/* Main Content */}
      <div className="space-y-4">
        {/* Key Differences */}
        {conversionPair && conversionPair.differences.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium mb-2">Key syntax differences:</p>
            <div className="flex flex-wrap gap-2">
              {conversionPair.differences.slice(0, 4).map((diff, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {diff}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dialect Selectors */}
        <div className="flex flex-wrap items-end gap-4">
          <DialectSelector
            value={sourceDialect}
            onChange={setSourceDialect}
            label="From"
            excludeDialect={targetDialect}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapDialects}
            title="Swap dialects"
            className="mb-0.5"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <DialectSelector
            value={targetDialect}
            onChange={setTargetDialect}
            label="To"
            excludeDialect={sourceDialect}
          />
          <div className="flex gap-2 ml-auto">
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

        {/* Side by Side Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input SQL Editor */}
          <SQLEditor
            value={inputSQL}
            onChange={setInputSQL}
            dialect={sourceDialect}
            label={`${sourceName} (input)`}
            placeholder={`Paste your ${sourceName} SQL here...`}
            height="300px"
          />

          {/* Output SQL Editor */}
          <SQLEditor
            value={outputSQL}
            dialect={targetDialect}
            label={`${targetName} (output)`}
            readOnly
            height="300px"
            placeholder="Converted SQL will appear here..."
          />
        </div>

        {/* Convert Button */}
        <Button
          onClick={handleConvert}
          className="w-full sm:w-auto"
          size="lg"
          disabled={!inputSQL.trim() || isConverting}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          {isConverting ? "Converting..." : `Convert to ${targetName}`}
        </Button>

        {/* Conversion Summary */}
        <ConversionOutput summary={summary} isLoading={isConverting} />

        {/* Privacy Note */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
          <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">AI-Powered Conversion</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your SQL is processed by AI to generate accurate conversions. We
              don&apos;t store your queries. Always test converted SQL before
              using in production.
            </p>
          </div>
        </div>
      </div>

      {/* Related Conversions */}
      {showRelated && conversionPair && (
        <RelatedConversions currentSlug={conversionPair.slug} />
      )}

      {/* FAQ Section */}
      <FAQSection
        faqs={conversionPair?.faqs}
        conversionSpecific={!!conversionPair}
      />

      {/* CTA Section */}
      <section className="mt-12 rounded-lg border border-teal-500/20 bg-teal-50 dark:bg-teal-950/20 p-6 text-center">
        <h2 className="text-xl font-semibold">
          Need to visualize your database schema?
        </h2>
        <p className="mt-2 text-muted-foreground">
          ChartDB instantly creates beautiful ERD diagrams from your database.
          Visualize your converted schema in seconds.
        </p>
        <Button asChild className="mt-4">
          <a href="https://app.chartdb.io">Open in ChartDB</a>
        </Button>
      </section>
    </>
  );
}
