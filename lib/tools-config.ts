import { Code2, Wand2, Sparkles, type LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    slug: "sql-syntax-checker",
    name: "SQL Syntax Checker",
    description:
      "Validate your SQL queries instantly. Supports MySQL, PostgreSQL, MariaDB, SQLite, SQL Server, and BigQuery. All validation happens in your browser - your SQL is never sent to any server.",
    shortDescription: "Validate SQL syntax across multiple database dialects",
    icon: Code2,
    keywords: [
      "SQL validator",
      "SQL syntax checker",
      "SQL linter",
      "validate SQL",
      "check SQL syntax",
    ],
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description:
      "Format and beautify your SQL queries instantly. Supports PostgreSQL, MySQL, MariaDB, SQLite, SQL Server, BigQuery, and more. All formatting happens in your browser - your SQL is never sent to any server.",
    shortDescription: "Beautify and format SQL queries with customizable options",
    icon: Wand2,
    keywords: [
      "SQL formatter",
      "SQL beautifier",
      "format SQL",
      "beautify SQL",
      "SQL pretty print",
    ],
  },
  {
    slug: "text-to-sql",
    name: "Text to SQL",
    description:
      "Transform natural language into SQL queries using AI. Describe what you need in plain English and get the SQL code. Supports PostgreSQL, MySQL, SQL Server, and more.",
    shortDescription: "Convert natural language to SQL queries with AI",
    icon: Sparkles,
    keywords: [
      "text to SQL",
      "natural language SQL",
      "AI SQL generator",
      "English to SQL",
      "SQL from text",
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
