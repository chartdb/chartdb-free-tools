import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free SQL Minifier | Compress SQL Queries Online - ChartDB",
  description:
    "Free online SQL minifier. Compress SQL queries by removing whitespace and comments. Supports PostgreSQL, MySQL, SQL Server & more. Runs in your browser.",
  keywords: [
    "SQL minifier",
    "SQL compressor",
    "minify SQL",
    "compress SQL",
    "SQL optimizer",
    "reduce SQL size",
    "SQL whitespace remover",
    "online SQL minifier",
    "free SQL minifier",
    "SQL query compression",
    "PostgreSQL minifier",
    "MySQL minifier",
  ],
  openGraph: {
    title: "Free SQL Minifier | Compress SQL Queries Online - ChartDB",
    description:
      "Free online SQL minifier. Compress SQL queries by removing whitespace and comments. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/sql-minifier",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SQL Minifier | Compress SQL Queries Online",
    description:
      "Free online SQL minifier. Compress SQL queries by removing whitespace and comments. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/sql-minifier",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Minifier",
  alternateName: ["SQL Compressor", "SQL Whitespace Remover", "SQL Query Minifier"],
  description:
    "Free online SQL minifier that compresses SQL queries by removing unnecessary whitespace and comments. Supports PostgreSQL, MySQL, SQLite, SQL Server, BigQuery & more. Runs entirely in your browser.",
  url: "https://chartdb.io/tools/sql-minifier",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "ChartDB",
    url: "https://chartdb.io",
  },
  featureList: [
    "SQL query minification",
    "Whitespace removal",
    "Comment removal",
    "Multiple database dialects",
    "Size reduction statistics",
    "Browser-based processing",
    "No data transmission",
    "Copy to clipboard",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SQL minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SQL minification is the process of removing unnecessary characters from SQL code without changing its functionality. This includes removing whitespace, line breaks, comments, and extra spaces to reduce the query size.",
      },
    },
    {
      "@type": "Question",
      name: "Why would I minify my SQL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minified SQL is useful for reducing query size when transmitting SQL over networks, storing queries in configuration files, or embedding SQL in applications where space is a concern. It can also help when dealing with query length limits.",
      },
    },
    {
      "@type": "Question",
      name: "Will minification change how my query works?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, minification only removes unnecessary whitespace and comments. The actual SQL logic remains unchanged, and your query will produce the same results as before.",
      },
    },
    {
      "@type": "Question",
      name: "What databases are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our tool supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Snowflake, and Oracle.",
      },
    },
  ],
};

export default function SQLMinifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="json-ld-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
