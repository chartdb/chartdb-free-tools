"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is DBML?",
    answer:
      "DBML (Database Markup Language) is a simple, readable DSL (Domain Specific Language) designed to define database schemas. It was created by the team at dbdiagram.io and provides a clean, easy-to-read syntax for describing database tables, columns, relationships, and indexes.",
  },
  {
    question: "How do I use the DBML to SQL converter?",
    answer:
      "Simply paste your DBML code in the input editor, select your target database (PostgreSQL, MySQL, or SQL Server), and click 'Convert to SQL'. The tool will instantly generate the corresponding SQL DDL statements for your chosen database.",
  },
  {
    question: "What SQL dialects are supported?",
    answer:
      "Our converter supports PostgreSQL, MySQL, and SQL Server (MSSQL). You can also choose to output normalized DBML if you want to validate or clean up your DBML syntax without converting to SQL.",
  },
  {
    question: "Is my DBML data secure?",
    answer:
      "Yes! All conversion happens entirely in your browser. Your DBML code is never sent to any server, ensuring complete privacy and security of your database schemas.",
  },
  {
    question: "What DBML features are supported?",
    answer:
      "The converter supports all standard DBML features including: Tables with columns, Primary keys and foreign keys, Indexes (unique, composite), Default values, Column constraints (not null, unique), Relationships (one-to-one, one-to-many, many-to-many), Enums, Table groups, and Notes/comments.",
  },
  {
    question: "Can I convert SQL back to DBML?",
    answer:
      "This tool specifically converts DBML to SQL. For converting SQL to DBML, you can use ChartDB which allows you to import your existing database and export the schema in various formats.",
  },
];

export function FAQSection() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
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
