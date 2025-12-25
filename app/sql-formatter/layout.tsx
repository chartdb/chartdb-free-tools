import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SQL Formatter Online | SQL Beautifier - ChartDB",
  description:
    "Free online SQL formatter and beautifier. Format your SQL queries instantly. Supports PostgreSQL, MySQL, SQLite, SQL Server & more.",
  keywords: [
    "SQL formatter",
    "SQL beautifier",
    "SQL formatter online",
    "free SQL formatter",
    "format SQL online",
    "SQL pretty print",
    "SQL code formatter",
    "beautify SQL",
    "PostgreSQL formatter",
    "MySQL formatter",
    "SQL Server formatter",
    "BigQuery formatter",
  ],
  openGraph: {
    title: "SQL Formatter Online | SQL Beautifier - ChartDB",
    description:
      "Free online SQL formatter and beautifier. Format your SQL queries instantly. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/sql-formatter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter Online | SQL Beautifier",
    description:
      "Free online SQL formatter and beautifier. Format your SQL queries instantly. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/sql-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free SQL Formatter Online",
  alternateName: ["SQL Beautifier", "SQL Formatter"],
  description:
    "Free online SQL formatter and beautifier. Format your SQL queries instantly with customizable options. Supports PostgreSQL, MySQL, SQLite, SQL Server, BigQuery & more.",
  url: "https://chartdb.io/tools/sql-formatter",
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
    "PostgreSQL formatting",
    "MySQL formatting",
    "MariaDB formatting",
    "SQLite formatting",
    "SQL Server formatting",
    "BigQuery formatting",
    "Amazon Redshift formatting",
    "Spark SQL formatting",
    "Apache Hive formatting",
    "Customizable keyword casing",
    "Multiple indentation styles",
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
      name: "What is the SQL Formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SQL Formatter is a free online tool that automatically formats and beautifies your SQL queries. It transforms messy, unformatted SQL into clean, readable code with proper indentation, line breaks, and consistent keyword casing.",
      },
    },
    {
      "@type": "Question",
      name: "What databases are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our SQL formatter supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Spark SQL, and Apache Hive.",
      },
    },
    {
      "@type": "Question",
      name: "Is my SQL data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All SQL formatting happens entirely in your browser using JavaScript. Your SQL queries are never sent to our servers or any third party.",
      },
    },
    {
      "@type": "Question",
      name: "What formatting options are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can customize keyword casing (UPPERCASE, lowercase, or preserve original), indentation style (standard, tabular left, or tabular right), and tab width (2 or 4 spaces).",
      },
    },
  ],
};

export default function SQLFormatterLayout({
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
