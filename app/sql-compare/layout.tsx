import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free SQL Compare | Diff SQL Queries Online - ChartDB",
  description:
    "Free online SQL comparison tool. Compare two SQL queries side by side and see differences instantly. Supports PostgreSQL, MySQL, SQL Server & more.",
  keywords: [
    "SQL compare",
    "SQL diff",
    "compare SQL queries",
    "SQL difference",
    "SQL comparison tool",
    "diff SQL online",
    "SQL query compare",
    "free SQL compare",
    "online SQL diff",
    "compare database queries",
    "PostgreSQL compare",
    "MySQL compare",
  ],
  openGraph: {
    title: "Free SQL Compare | Diff SQL Queries Online - ChartDB",
    description:
      "Free online SQL comparison tool. Compare two SQL queries side by side and see differences instantly. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/sql-compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SQL Compare | Diff SQL Queries Online",
    description:
      "Free online SQL comparison tool. Compare two SQL queries side by side and see differences instantly. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/sql-compare",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SQL Compare",
  alternateName: ["SQL Diff", "SQL Query Compare", "SQL Comparison Tool"],
  description:
    "Free online SQL comparison tool that compares two SQL queries side by side. Instantly see additions, deletions, and modifications. Supports PostgreSQL, MySQL, SQLite, SQL Server, BigQuery & more.",
  url: "https://chartdb.io/tools/sql-compare",
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
    "Side-by-side SQL comparison",
    "Line-by-line diff highlighting",
    "Addition and deletion detection",
    "Multiple database dialects",
    "Browser-based processing",
    "No data transmission",
    "Copy to clipboard",
    "Swap queries",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the SQL Compare tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SQL Compare tool is a free online utility that helps you quickly compare two SQL queries side by side. It analyzes and highlights the differences between your queries, showing what has been added, removed, or modified.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use SQL Compare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste your original SQL query in the left editor and the modified query in the right editor. Click 'Compare Queries' to see the differences highlighted. Added lines are shown in green, removed lines in red.",
      },
    },
    {
      "@type": "Question",
      name: "What are the benefits of comparing SQL queries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comparing SQL queries helps you identify changes between different versions of your code, review modifications before deployment, debug query issues, and understand how queries have evolved over time.",
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

export default function SQLCompareLayout({
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
