import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the SQL Validator?",
    answer:
      "The SQL Validator is a free online tool that checks your SQL queries for syntax errors before you run them against your database. It instantly identifies issues like missing keywords, mismatched parentheses, and incorrect clause ordering, helping you catch mistakes early and save debugging time.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Our SQL syntax checker supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), and BigQuery. Each dialect has its own syntax rules, so make sure to select the correct database type before validating your query.",
  },
  {
    question: "Is my SQL data secure?",
    answer:
      "Yes, absolutely. All SQL validation happens entirely in your browser using JavaScript. Your SQL queries are never sent to our servers or any third party. Your data stays completely private on your device.",
  },
  {
    question: "What types of errors can this tool detect?",
    answer:
      "This tool detects syntax errors such as missing keywords, incorrect clause ordering, unmatched parentheses, invalid operators, and malformed expressions. It cannot verify whether tables, columns, or other database objects actually exist in your database - that requires a connection to your actual database.",
  },
  {
    question: "Can I use this tool offline?",
    answer:
      "Once the page is loaded, the validation works entirely in your browser without requiring an internet connection. However, you'll need to be online initially to load the page.",
  },
  {
    question: "Why might valid SQL still show as an error?",
    answer:
      "Some database-specific syntax or newer features might not be fully supported by our parser. If you're confident your SQL is correct for your specific database version, it should still work when executed. Also make sure you've selected the correct dialect for your database.",
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
