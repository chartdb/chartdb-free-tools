import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SQL minification?",
    answer:
      "SQL minification is the process of removing unnecessary characters from SQL code without changing its functionality. This includes removing whitespace, line breaks, comments, and extra spaces to reduce the query size.",
  },
  {
    question: "Why would I minify my SQL?",
    answer:
      "Minified SQL is useful for reducing query size when transmitting SQL over networks, storing queries in configuration files, or embedding SQL in applications where space is a concern. It can also help when dealing with query length limits.",
  },
  {
    question: "Will minification change how my query works?",
    answer:
      "No, minification only removes unnecessary whitespace and comments. The actual SQL logic remains unchanged, and your query will produce the same results as before.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our tool supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Snowflake, and Oracle. The minification works the same across all dialects.",
  },
  {
    question: "Is my SQL data secure?",
    answer:
      "Yes, all minification happens entirely in your browser. Your SQL code is never sent to any server. We don't store or log any of your queries.",
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
