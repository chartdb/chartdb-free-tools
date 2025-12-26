import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SQL Query Explainer | Explain SQL in Plain English - ChartDB",
  description:
    "Free AI-powered SQL query explainer. Understand what any SQL query does in plain English. Step-by-step breakdowns for PostgreSQL, MySQL, SQL Server & more.",
  keywords: [
    "SQL query explainer",
    "explain SQL query",
    "SQL explanation",
    "what does this SQL do",
    "understand SQL query",
    "SQL query analyzer",
    "explain SQL online",
    "SQL query breakdown",
    "SQL query interpreter",
    "learn SQL",
    "SQL for beginners",
    "SQL query reader",
  ],
  openGraph: {
    title: "SQL Query Explainer | Explain SQL in Plain English - ChartDB",
    description:
      "Free AI-powered SQL query explainer. Understand what any SQL query does in plain English. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/sql-query-explainer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Query Explainer | Explain SQL in Plain English",
    description:
      "Free AI-powered SQL query explainer. Understand what any SQL query does in plain English. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/sql-query-explainer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Query Explainer",
  alternateName: [
    "SQL Explainer",
    "Explain SQL Query",
    "SQL Query Analyzer",
    "SQL to English",
  ],
  description:
    "Free AI-powered SQL query explainer. Paste any SQL query and get a plain English explanation of what it does, step by step. Supports PostgreSQL, MySQL, SQLite, SQL Server, BigQuery & more.",
  url: "https://chartdb.io/tools/sql-query-explainer",
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
    "Plain English SQL explanations",
    "Step-by-step query breakdown",
    "Table and column identification",
    "JOIN explanation",
    "Aggregation explanation",
    "Subquery and CTE breakdown",
    "Multiple database dialects",
    "AI-powered analysis",
    "Real-time streaming response",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the SQL Query Explainer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SQL Query Explainer is a free AI-powered tool that analyzes any SQL query and explains what it does in plain English. Simply paste your SQL, and the tool breaks down each part of the query step by step.",
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
      name: "Can it explain complex queries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The AI can explain complex SQL including JOINs, subqueries, CTEs (Common Table Expressions), window functions, aggregations, and more. The more complex the query, the more detailed the breakdown.",
      },
    },
    {
      "@type": "Question",
      name: "Is this tool good for learning SQL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! The SQL Query Explainer is designed with beginners in mind. It uses simple language and explains SQL concepts as it goes. It's perfect for students, junior developers, or anyone looking to understand unfamiliar SQL code.",
      },
    },
    {
      "@type": "Question",
      name: "Is my SQL query stored or shared?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your SQL queries are processed by AI to generate explanations. We don't store or log your queries on our servers.",
      },
    },
  ],
};

export default function SQLQueryExplainerLayout({
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
