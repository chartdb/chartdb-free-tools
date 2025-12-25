import { Code2, Wand2, type LucideIcon } from "lucide-react";

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
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
