import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConverterTool } from "@/components/tools/sql-dialect-converter/converter-tool";
import {
  CONVERSION_PAIRS,
  getConversionBySlug,
} from "@/lib/sql-dialect-converter";

interface PageProps {
  params: Promise<{ conversion: string }>;
}

export function generateStaticParams() {
  return CONVERSION_PAIRS.map((pair) => ({
    conversion: pair.slug,
  }));
}

export default async function ConversionPage({ params }: PageProps) {
  const { conversion } = await params;
  const pair = getConversionBySlug(conversion);

  if (!pair) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold tracking-tight">{pair.h1}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{pair.description}</p>
      </div>

      {/* Converter Tool */}
      <ConverterTool
        initialSource={pair.source}
        initialTarget={pair.target}
        conversionPair={pair}
        showRelated
      />
    </div>
  );
}
