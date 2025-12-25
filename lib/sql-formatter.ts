import { format, type SqlLanguage } from "sql-formatter";

export type FormatterDialect =
  | "mysql"
  | "postgresql"
  | "mariadb"
  | "sqlite"
  | "transactsql"
  | "bigquery"
  | "redshift"
  | "spark"
  | "hive";

export type KeywordCase = "preserve" | "upper" | "lower";
export type IndentStyle = "standard" | "tabularLeft" | "tabularRight";

export interface FormatterDialectOption {
  value: FormatterDialect;
  label: string;
}

export const FORMATTER_DIALECTS: FormatterDialectOption[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
  { value: "bigquery", label: "BigQuery" },
  { value: "redshift", label: "Amazon Redshift" },
  { value: "spark", label: "Spark SQL" },
  { value: "hive", label: "Apache Hive" },
];

export interface KeywordCaseOption {
  value: KeywordCase;
  label: string;
}

export const KEYWORD_CASE_OPTIONS: KeywordCaseOption[] = [
  { value: "upper", label: "UPPERCASE" },
  { value: "lower", label: "lowercase" },
  { value: "preserve", label: "Preserve" },
];

export interface IndentStyleOption {
  value: IndentStyle;
  label: string;
}

export const INDENT_STYLE_OPTIONS: IndentStyleOption[] = [
  { value: "standard", label: "Standard" },
  { value: "tabularLeft", label: "Tabular Left" },
  { value: "tabularRight", label: "Tabular Right" },
];

export interface FormatterOptions {
  dialect: FormatterDialect;
  keywordCase: KeywordCase;
  indentStyle: IndentStyle;
  tabWidth: number;
  useTabs: boolean;
  linesBetweenQueries: number;
}

export const DEFAULT_FORMATTER_OPTIONS: FormatterOptions = {
  dialect: "postgresql",
  keywordCase: "upper",
  indentStyle: "standard",
  tabWidth: 2,
  useTabs: false,
  linesBetweenQueries: 2,
};

// Map our dialect names to sql-formatter language names
const dialectMap: Record<FormatterDialect, SqlLanguage> = {
  mysql: "mysql",
  postgresql: "postgresql",
  mariadb: "mariadb",
  sqlite: "sqlite",
  transactsql: "transactsql",
  bigquery: "bigquery",
  redshift: "redshift",
  spark: "spark",
  hive: "hive",
};

export interface FormatResult {
  success: boolean;
  formattedSQL?: string;
  error?: string;
}

export function formatSQL(sql: string, options: FormatterOptions): FormatResult {
  if (!sql.trim()) {
    return {
      success: false,
      error: "Please enter some SQL to format",
    };
  }

  try {
    const formattedSQL = format(sql, {
      language: dialectMap[options.dialect],
      keywordCase: options.keywordCase,
      indentStyle: options.indentStyle,
      tabWidth: options.tabWidth,
      useTabs: options.useTabs,
      linesBetweenQueries: options.linesBetweenQueries,
    });

    return {
      success: true,
      formattedSQL,
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "Failed to format SQL",
    };
  }
}

export const EXAMPLE_UNFORMATTED_SQL = `select u.id,u.name,u.email,count(o.id) as order_count from users u left join orders o on u.id=o.user_id where u.status='active' and u.created_at>='2024-01-01' group by u.id,u.name,u.email having count(o.id)>0 order by order_count desc limit 10`;
