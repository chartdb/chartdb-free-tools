import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the SQL Formatter?",
    answer:
      "The SQL Formatter is a free online tool that automatically formats and beautifies your SQL queries. It transforms messy, unformatted SQL into clean, readable code with proper indentation, line breaks, and consistent keyword casing. This makes your queries easier to read, debug, and maintain.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our SQL formatter supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Spark SQL, and Apache Hive. Each dialect has specific syntax rules, so selecting the correct database type ensures optimal formatting results.",
  },
  {
    question: "Is my SQL data secure?",
    answer:
      "Yes, absolutely. All SQL formatting happens entirely in your browser using JavaScript. Your SQL queries are never sent to our servers or any third party. Your data stays completely private on your device.",
  },
  {
    question: "What formatting options are available?",
    answer:
      "You can customize keyword casing (UPPERCASE, lowercase, or preserve original), indentation style (standard, tabular left, or tabular right), and tab width (2 or 4 spaces). These options let you match your team's coding standards or personal preferences.",
  },
  {
    question: "Can the formatter fix SQL errors?",
    answer:
      "The SQL formatter only handles formatting and beautification - it arranges whitespace, indentation, and casing. It does not fix syntax errors or validate your SQL. For syntax validation, use our SQL Syntax Checker tool.",
  },
  {
    question: "What is ChartDB?",
    answer: (
      <>
        ChartDB is a database schema visualization tool that lets you instantly visualize your database structure as entity-relationship diagrams. It supports all major databases and doesn&apos;t require direct database access. Try it free at{" "}
        <a
          href="https://chartdb.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          chartdb.io
        </a>
        .
      </>
    ),
  },
];

export function FAQSection() {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
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
