import { Code2, Wand2, Sparkles, Minimize2, GitCompare, Database, BookOpen, type LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  keywords: string[];
  isAIPowered?: boolean;
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
    isAIPowered: true,
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
    isAIPowered: true,
  },
  {
    slug: "sql-minifier",
    name: "SQL Minifier",
    description:
      "Compress your SQL queries by removing whitespace and comments. Reduce query size instantly. All minification happens in your browser - your SQL is never sent to any server.",
    shortDescription: "Compress SQL queries by removing whitespace",
    icon: Minimize2,
    keywords: [
      "SQL minifier",
      "SQL compressor",
      "minify SQL",
      "compress SQL",
      "SQL size reducer",
    ],
  },
  {
    slug: "sql-compare",
    name: "SQL Compare",
    description:
      "Compare two SQL queries side by side and see differences instantly. Highlight additions, deletions, and modifications. All comparison happens in your browser - your SQL is never sent to any server.",
    shortDescription: "Compare SQL queries and see differences",
    icon: GitCompare,
    keywords: [
      "SQL compare",
      "SQL diff",
      "compare SQL",
      "SQL difference",
      "diff SQL queries",
    ],
  },
  {
    slug: "dbml-to-sql",
    name: "DBML to SQL",
    description:
      "Convert DBML database schemas to SQL DDL statements. Supports PostgreSQL, MySQL, and SQL Server. All conversion happens in your browser - your DBML is never sent to any server.",
    shortDescription: "Convert DBML schemas to SQL DDL",
    icon: Database,
    keywords: [
      "DBML to SQL",
      "DBML converter",
      "DBML to PostgreSQL",
      "DBML to MySQL",
      "database schema converter",
    ],
  },
  {
    slug: "sql-query-explainer",
    name: "SQL Query Explainer",
    description:
      "Understand any SQL query in plain English. AI-powered tool that breaks down complex queries step by step, explaining JOINs, WHERE conditions, aggregations, and more. Perfect for learning SQL or reviewing unfamiliar code.",
    shortDescription: "Explain SQL queries in plain English with AI",
    icon: BookOpen,
    keywords: [
      "SQL query explainer",
      "explain SQL",
      "SQL explanation",
      "understand SQL",
      "SQL analyzer",
      "learn SQL",
    ],
    isAIPowered: true,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
