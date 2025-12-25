import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Text to SQL AI Converter | Natural Language to SQL - ChartDB",
  description:
    "Free AI-powered text to SQL converter. Transform natural language into SQL queries instantly. Supports PostgreSQL, MySQL, SQL Server & more.",
  keywords: [
    "text to SQL",
    "natural language to SQL",
    "AI SQL generator",
    "English to SQL",
    "SQL query generator",
    "text to SQL converter",
    "AI to SQL",
    "natural language SQL",
    "SQL from text",
    "generate SQL query",
    "PostgreSQL generator",
    "MySQL generator",
  ],
  openGraph: {
    title: "Text to SQL AI Converter | Natural Language to SQL - ChartDB",
    description:
      "Free AI-powered text to SQL converter. Transform natural language into SQL queries instantly. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/text-to-sql",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to SQL AI Converter | Natural Language to SQL",
    description:
      "Free AI-powered text to SQL converter. Transform natural language into SQL queries instantly. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/text-to-sql",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Text to SQL AI Converter",
  alternateName: ["Natural Language to SQL", "AI SQL Generator", "English to SQL"],
  description:
    "Free AI-powered text to SQL converter. Transform natural language descriptions into SQL queries instantly. Supports PostgreSQL, MySQL, SQLite, SQL Server, BigQuery & more.",
  url: "https://chartdb.io/tools/text-to-sql",
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
    "Natural language to SQL conversion",
    "PostgreSQL query generation",
    "MySQL query generation",
    "SQL Server query generation",
    "BigQuery query generation",
    "Schema-aware query generation",
    "Complex query support (JOINs, subqueries)",
    "Multiple database dialects",
    "AI-powered generation",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Text to SQL Converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Text to SQL Converter is a free AI-powered tool that transforms natural language descriptions into SQL queries. Simply describe what data you want to retrieve or manipulate, and the tool generates the corresponding SQL code for your chosen database.",
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
    {
      "@type": "Question",
      name: "Do I need to provide a database schema?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Providing a schema is optional but recommended. When you include your table definitions, the AI uses your exact table and column names for more accurate queries.",
      },
    },
    {
      "@type": "Question",
      name: "Can it handle complex queries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the AI can generate complex SQL including JOINs, subqueries, aggregations, window functions, CTEs, and more.",
      },
    },
  ],
};

export default function TextToSQLLayout({
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
