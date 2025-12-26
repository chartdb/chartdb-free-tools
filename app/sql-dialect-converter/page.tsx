"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConverterTool } from "@/components/tools/sql-dialect-converter/converter-tool";
import { CONVERSION_PAIRS, getDialectById } from "@/lib/sql-dialect-converter";
import { ArrowRight } from "lucide-react";

export default function SQLDialectConverterPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
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
          Free SQL Dialect Converter
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Convert SQL queries between MySQL, PostgreSQL, SQL Server, SQLite, and
          MariaDB. AI-powered conversion handles syntax, data types, and
          functions.
        </p>
      </div>

      {/* Converter Tool */}
      <ConverterTool />

      {/* All Conversion Pages */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">All SQL Conversions</h2>
        <p className="text-muted-foreground mb-6">
          Jump to a specific conversion for optimized tools and documentation:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONVERSION_PAIRS.map((pair) => {
            const source = getDialectById(pair.source);
            const target = getDialectById(pair.target);
            return (
              <Link
                key={pair.slug}
                href={`/sql-dialect-converter/${pair.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border p-4 hover:border-teal-500/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{source?.shortName}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{target?.shortName}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
