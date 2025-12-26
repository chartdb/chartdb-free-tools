"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/lib/sql-dialect-converter";

interface FAQSectionProps {
  faqs?: FAQ[];
  conversionSpecific?: boolean;
}

const defaultFaqs: FAQ[] = [
  {
    question: "What is the SQL Dialect Converter?",
    answer:
      "The SQL Dialect Converter is a free AI-powered tool that converts SQL queries between different database dialects. It handles syntax differences, data types, functions, and identifier quoting automatically.",
  },
  {
    question: "Which database dialects are supported?",
    answer:
      "We support conversions between MySQL, PostgreSQL, SQL Server (T-SQL), SQLite, and MariaDB. Each conversion handles the specific syntax differences between the source and target databases.",
  },
  {
    question: "What types of SQL can I convert?",
    answer:
      "The converter handles DDL statements (CREATE TABLE, ALTER TABLE, CREATE INDEX) and DML statements (SELECT, INSERT, UPDATE, DELETE). Complex features like stored procedures may require manual review.",
  },
  {
    question: "Is the conversion 100% accurate?",
    answer:
      "The AI-powered conversion handles most common patterns accurately. However, database-specific features that don't have direct equivalents may require manual adjustment. Always review and test converted SQL before using in production.",
  },
  {
    question: "Is my SQL data secure?",
    answer:
      "Your SQL is processed by AI to generate conversions. We don't store your queries. For sensitive schemas, avoid including actual data values in your SQL.",
  },
  {
    question: "What is ChartDB?",
    answer:
      "ChartDB is a database schema visualization tool that lets you instantly visualize your database structure as entity-relationship diagrams. After converting your schema, you can visualize it in ChartDB.",
  },
];

export function FAQSection({ faqs, conversionSpecific = false }: FAQSectionProps) {
  const displayFaqs = faqs && faqs.length > 0
    ? [...faqs, ...defaultFaqs.slice(3)]
    : defaultFaqs;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {displayFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
