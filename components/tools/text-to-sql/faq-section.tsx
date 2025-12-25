import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the Text to SQL Converter?",
    answer:
      "The Text to SQL Converter is a free AI-powered tool that transforms natural language descriptions into SQL queries. Simply describe what data you want to retrieve or manipulate, and the tool generates the corresponding SQL code for your chosen database.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our tool supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Snowflake, and Oracle. Each database has unique syntax, and our AI generates queries tailored to your selected dialect.",
  },
  {
    question: "Do I need to provide a database schema?",
    answer:
      "Providing a schema is optional but recommended. When you include your table definitions (CREATE TABLE statements), the AI uses your exact table and column names for more accurate queries. Without a schema, the AI will use reasonable names based on your description.",
  },
  {
    question: "Can it handle complex queries?",
    answer:
      "Yes, the AI can generate complex SQL including JOINs, subqueries, aggregations, window functions, CTEs (Common Table Expressions), and more. The more detailed your description, the better the generated query will match your needs.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your natural language prompts are processed by OpenAI's API to generate SQL. We don't store your queries or schema information. For sensitive data, avoid including actual data values in your schema - use placeholder names instead.",
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
