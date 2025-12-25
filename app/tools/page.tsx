import { tools } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/tool-card";
import Script from "next/script";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ChartDB Tools",
  alternateName: "Free SQL Tools Online",
  url: "https://tools.chartdb.io/tools",
  description:
    "Free online SQL and database tools. SQL syntax checker, SQL validator & more. Privacy-focused - runs in your browser.",
  publisher: {
    "@type": "Organization",
    name: "ChartDB",
    url: "https://chartdb.io",
  },
};

const toolsCollectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free SQL Tools Online",
  description:
    "A collection of free, privacy-focused SQL and database tools by ChartDB.",
  url: "https://tools.chartdb.io/tools",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "SQL Syntax Checker",
        url: "https://tools.chartdb.io/tools/sql-syntax-checker",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="json-ld-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsCollectionJsonLd) }}
      />
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free SQL Tools Online
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of free, privacy-focused SQL and database tools by{" "}
            <a
              href="https://chartdb.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline font-medium"
            >
              ChartDB
            </a>
            . All tools run entirely in your browser.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {tools.length === 1 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              More tools coming soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
