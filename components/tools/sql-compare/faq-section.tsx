import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the SQL Compare tool?",
    answer:
      "The SQL Compare tool is a free online utility that helps you quickly compare two SQL queries side by side. It analyzes and highlights the differences between your queries, showing what has been added, removed, or modified.",
  },
  {
    question: "How do I use SQL Compare?",
    answer:
      "Simply paste your original SQL query in the left editor and the modified query in the right editor. Click 'Compare Queries' to see the differences highlighted. Added lines are shown in green, removed lines in red.",
  },
  {
    question: "What are the benefits of comparing SQL queries?",
    answer:
      "Comparing SQL queries helps you identify changes between different versions of your code, review modifications before deployment, debug query issues, and understand how queries have evolved over time. It's especially useful for code reviews and troubleshooting.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our tool supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Snowflake, and Oracle. The comparison works the same across all dialects.",
  },
  {
    question: "Is my SQL data secure?",
    answer:
      "Yes, all comparison happens entirely in your browser. Your SQL code is never sent to any server. We don't store or log any of your queries.",
  },
  {
    question: "What is ChartDB?",
    answer: (
      <>
        ChartDB is a database schema visualization tool that lets you instantly
        visualize your database structure as entity-relationship diagrams. It
        supports all major databases and doesn&apos;t require direct database access.
        Try it free at{" "}
        <a
          href="https://chartdb.io"
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
