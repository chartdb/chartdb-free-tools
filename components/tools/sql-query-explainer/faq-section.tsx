import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the SQL Query Explainer?",
    answer:
      "The SQL Query Explainer is a free AI-powered tool that analyzes any SQL query and explains what it does in plain English. Simply paste your SQL, and the tool breaks down each part of the query step by step, including JOINs, WHERE conditions, aggregations, and more.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our tool supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), BigQuery, Amazon Redshift, Snowflake, and Oracle. Select your database dialect for more accurate explanations of dialect-specific syntax.",
  },
  {
    question: "Can it explain complex queries?",
    answer:
      "Yes! The AI can explain complex SQL including JOINs, subqueries, CTEs (Common Table Expressions), window functions, aggregations, CASE statements, and more. The more complex the query, the more detailed the breakdown.",
  },
  {
    question: "Is this tool good for learning SQL?",
    answer:
      "Absolutely! The SQL Query Explainer is designed with beginners in mind. It uses simple language and explains SQL concepts as it goes. It's perfect for students, junior developers, or anyone looking to understand unfamiliar SQL code.",
  },
  {
    question: "Is my SQL query stored or shared?",
    answer:
      "Your SQL queries are processed by AI to generate explanations. We don't store or log your queries on our servers. For sensitive data, avoid including actual data values in your queries - the tool focuses on query structure, not data content.",
  },
  {
    question: "What is ChartDB?",
    answer: (
      <>
        ChartDB is a database schema visualization tool that lets you instantly
        visualize your database structure as entity-relationship diagrams. After
        understanding your query, you can visualize the tables in ChartDB. Try
        it free at{" "}
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
