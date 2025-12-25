import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free DBML to SQL Converter | Generate DDL Online - ChartDB",
  description:
    "Free online DBML to SQL converter. Transform DBML database schemas into SQL DDL statements. Supports PostgreSQL, MySQL, and SQL Server.",
  keywords: [
    "DBML to SQL",
    "DBML converter",
    "DBML to PostgreSQL",
    "DBML to MySQL",
    "DBML to SQL Server",
    "database schema converter",
    "DDL generator",
    "DBML parser",
    "free DBML tool",
    "online DBML converter",
    "database markup language",
    "schema to SQL",
  ],
  openGraph: {
    title: "Free DBML to SQL Converter | Generate DDL Online - ChartDB",
    description:
      "Free online DBML to SQL converter. Transform DBML database schemas into SQL DDL statements. Supports PostgreSQL, MySQL & more.",
    url: "https://chartdb.io/tools/dbml-to-sql",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free DBML to SQL Converter | Generate DDL Online",
    description:
      "Free online DBML to SQL converter. Transform DBML database schemas into SQL DDL statements. Supports PostgreSQL, MySQL & more.",
  },
  alternates: {
    canonical: "https://chartdb.io/tools/dbml-to-sql",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DBML to SQL Converter",
  alternateName: ["DBML Converter", "DBML to DDL", "DBML Parser"],
  description:
    "Free online DBML to SQL converter that transforms DBML database schemas into SQL DDL statements. Supports PostgreSQL, MySQL, and SQL Server. All conversion happens in your browser.",
  url: "https://chartdb.io/tools/dbml-to-sql",
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
    "DBML to SQL conversion",
    "PostgreSQL DDL generation",
    "MySQL DDL generation",
    "SQL Server DDL generation",
    "Browser-based processing",
    "No data transmission",
    "Copy to clipboard",
    "Example schema loading",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is DBML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DBML (Database Markup Language) is a simple, readable DSL (Domain Specific Language) designed to define database schemas. It was created by the team at dbdiagram.io and provides a clean, easy-to-read syntax for describing database tables, columns, relationships, and indexes.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use the DBML to SQL converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply paste your DBML code in the input editor, select your target database (PostgreSQL, MySQL, or SQL Server), and click 'Convert to SQL'. The tool will instantly generate the corresponding SQL DDL statements for your chosen database.",
      },
    },
    {
      "@type": "Question",
      name: "What SQL dialects are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our converter supports PostgreSQL, MySQL, and SQL Server (MSSQL). You can also choose to output normalized DBML if you want to validate or clean up your DBML syntax without converting to SQL.",
      },
    },
    {
      "@type": "Question",
      name: "Is my DBML data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All conversion happens entirely in your browser. Your DBML code is never sent to any server, ensuring complete privacy and security of your database schemas.",
      },
    },
  ],
};

export default function DBMLToSQLLayout({
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
