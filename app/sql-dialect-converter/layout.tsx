import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SQL Dialect Converter | Convert SQL Between Databases - ChartDB",
  description:
    "Free AI-powered SQL dialect converter. Convert SQL between MySQL, PostgreSQL, SQL Server, SQLite, and MariaDB instantly. Handles syntax, data types, and functions.",
  keywords: [
    "SQL converter",
    "SQL dialect converter",
    "convert SQL",
    "MySQL to PostgreSQL",
    "PostgreSQL to MySQL",
    "SQL migration tool",
    "database migration",
    "SQL syntax converter",
    "convert SQL online",
    "SQL translation",
  ],
  openGraph: {
    title: "SQL Dialect Converter | Convert SQL Between Databases - ChartDB",
    description:
      "Free AI-powered SQL dialect converter. Convert SQL between MySQL, PostgreSQL, SQL Server, SQLite instantly.",
    url: "https://chartdb.io/tools/sql-dialect-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Dialect Converter | Convert SQL Between Databases",
    description:
      "Free AI-powered SQL dialect converter. Convert SQL between MySQL, PostgreSQL, SQL Server, SQLite instantly.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/sql-dialect-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Dialect Converter",
  alternateName: [
    "SQL Converter",
    "Database SQL Converter",
    "SQL Migration Tool",
  ],
  description:
    "Free AI-powered SQL dialect converter. Convert SQL queries and DDL between MySQL, PostgreSQL, SQL Server, SQLite, and MariaDB. Handles data types, functions, and syntax differences.",
  url: "https://chartdb.io/tools/sql-dialect-converter",
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
    "MySQL to PostgreSQL conversion",
    "PostgreSQL to MySQL conversion",
    "SQL Server to MySQL conversion",
    "SQLite to PostgreSQL conversion",
    "Data type mapping",
    "Function conversion",
    "Identifier quoting",
    "AI-powered accuracy",
  ],
};

export default function SQLDialectConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="json-ld-converter"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
