"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getRelatedConversions,
  getReverseConversion,
  getDialectById,
  type ConversionPair,
} from "@/lib/sql-dialect-converter";

interface RelatedConversionsProps {
  currentSlug: string;
}

export function RelatedConversions({ currentSlug }: RelatedConversionsProps) {
  const reverse = getReverseConversion(currentSlug);
  const related = getRelatedConversions(currentSlug);

  if (!reverse && related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Related Conversions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {reverse && (
          <ConversionLink pair={reverse} isReverse />
        )}
        {related.map((pair) => (
          <ConversionLink key={pair.slug} pair={pair} />
        ))}
      </div>
    </section>
  );
}

function ConversionLink({
  pair,
  isReverse = false,
}: {
  pair: ConversionPair;
  isReverse?: boolean;
}) {
  const source = getDialectById(pair.source);
  const target = getDialectById(pair.target);

  return (
    <Link
      href={`/sql-dialect-converter/${pair.slug}`}
      className="group flex items-center justify-between rounded-lg border border-border p-4 hover:border-teal-500/50 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{source?.shortName}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{target?.shortName}</span>
        {isReverse && (
          <span className="text-xs text-muted-foreground">(reverse)</span>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
