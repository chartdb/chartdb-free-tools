import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import {
  CONVERSION_PAIRS,
  getConversionBySlug,
  getDialectById,
} from "@/lib/sql-dialect-converter";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ conversion: string }>;
}

export async function generateStaticParams() {
  return CONVERSION_PAIRS.map((pair) => ({
    conversion: pair.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ conversion: string }>;
}): Promise<Metadata> {
  const { conversion } = await params;
  const pair = getConversionBySlug(conversion);

  if (!pair) {
    return {
      title: "SQL Converter - ChartDB",
    };
  }

  return {
    title: pair.title,
    description: pair.description,
    keywords: pair.keywords,
    openGraph: {
      title: pair.title,
      description: pair.description,
      url: `https://chartdb.io/tools/sql-dialect-converter/${pair.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pair.h1,
      description: pair.description,
    },
    alternates: {
      canonical: `https://chartdb.io/tools/sql-dialect-converter/${pair.slug}`,
    },
  };
}

export default async function ConversionLayout({ children, params }: LayoutProps) {
  const { conversion } = await params;
  const pair = getConversionBySlug(conversion);

  if (!pair) {
    notFound();
  }

  const source = getDialectById(pair.source);
  const target = getDialectById(pair.target);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${source?.name} to ${target?.name} Converter`,
    alternateName: [
      `${pair.source} to ${pair.target} converter`,
      `Convert ${source?.name} to ${target?.name}`,
    ],
    description: pair.description,
    url: `https://chartdb.io/tools/sql-dialect-converter/${pair.slug}`,
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
      `${source?.name} to ${target?.name} SQL conversion`,
      "Data type mapping",
      "Function conversion",
      "Identifier quoting",
      "AI-powered accuracy",
      ...pair.differences.slice(0, 3),
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pair.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id="json-ld-converter"
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
