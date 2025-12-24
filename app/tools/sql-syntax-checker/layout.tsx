import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free SQL Syntax Checker",
  description:
    "Free online SQL syntax checker and validator. Supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, and BigQuery. Validate your SQL queries instantly - all validation happens in your browser.",
  keywords: [
    "SQL syntax checker",
    "SQL validator",
    "validate SQL",
    "SQL linter",
    "check SQL syntax",
    "PostgreSQL validator",
    "MySQL validator",
    "free SQL tool",
  ],
  openGraph: {
    title: "Free SQL Syntax Checker | ChartDB Tools",
    description:
      "Validate your SQL queries instantly. Supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, and BigQuery.",
    url: "https://tools.chartdb.io/tools/sql-syntax-checker",
  },
  alternates: {
    canonical: "https://tools.chartdb.io/tools/sql-syntax-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Syntax Checker",
  description:
    "Free online SQL syntax checker and validator. Supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, and BigQuery.",
  url: "https://tools.chartdb.io/tools/sql-syntax-checker",
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
    "PostgreSQL syntax validation",
    "MySQL syntax validation",
    "MariaDB syntax validation",
    "SQLite syntax validation",
    "SQL Server syntax validation",
    "BigQuery syntax validation",
    "Client-side processing",
    "Privacy-focused",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What databases are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our SQL syntax checker supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), and BigQuery.",
      },
    },
    {
      "@type": "Question",
      name: "Is my SQL data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All SQL validation happens entirely in your browser using JavaScript. Your SQL queries are never sent to our servers or any third party.",
      },
    },
    {
      "@type": "Question",
      name: "What types of errors can this tool detect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool detects syntax errors such as missing keywords, incorrect clause ordering, unmatched parentheses, invalid operators, and malformed expressions.",
      },
    },
  ],
};

export default function SQLSyntaxCheckerLayout({
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
