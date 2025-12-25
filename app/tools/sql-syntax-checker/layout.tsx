import type { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  title: "SQL Syntax Checker Online | SQL Validator - ChartDB",
  description:
    "Free online SQL syntax checker and validator. Quickly check your SQL queries for syntax errors and identify issues. Supports PostgreSQL, MySQL, SQLite, SQL Server & BigQuery.",
  keywords: [
    "SQL syntax checker",
    "SQL validator",
    "SQL syntax checker online",
    "free SQL validator",
    "validate SQL online",
    "SQL query checker",
    "SQL linter",
    "check SQL syntax",
    "PostgreSQL validator",
    "MySQL validator",
    "SQL Server validator",
    "BigQuery validator",
  ],
  openGraph: {
    title: "SQL Syntax Checker Online | SQL Validator - ChartDB",
    description:
      "Free online SQL syntax checker and validator. Quickly check your SQL queries for syntax errors. Supports PostgreSQL, MySQL & more.",
    url: "https://tools.chartdb.io/tools/sql-syntax-checker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Syntax Checker Online | SQL Validator",
    description:
      "Free online SQL syntax checker and validator. Quickly check your SQL queries for syntax errors. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://tools.chartdb.io/tools/sql-syntax-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free SQL Syntax Checker Online",
  alternateName: ["SQL Validator", "SQL Syntax Checker"],
  description:
    "Free online SQL syntax checker and validator. Quickly check your SQL queries for syntax errors and identify issues. Supports PostgreSQL, MySQL, SQLite, SQL Server & BigQuery.",
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
    "AI-powered query fixing",
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
      name: "What is the SQL Validator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SQL Validator is a free online tool that checks your SQL queries for syntax errors before you run them against your database. It instantly identifies issues like missing keywords, mismatched parentheses, and incorrect clause ordering, helping you catch mistakes early and save debugging time.",
      },
    },
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
