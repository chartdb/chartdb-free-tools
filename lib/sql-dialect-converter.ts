export type ConverterDialect =
  | "mysql"
  | "postgresql"
  | "sqlserver"
  | "sqlite"
  | "mariadb";

export interface DialectInfo {
  id: ConverterDialect;
  name: string;
  shortName: string;
  logo: string;
}

export const DIALECTS: DialectInfo[] = [
  { id: "mysql", name: "MySQL", shortName: "MySQL", logo: "/tools/db-logos/mysql.png" },
  { id: "postgresql", name: "PostgreSQL", shortName: "PostgreSQL", logo: "/tools/db-logos/postgresql.png" },
  { id: "sqlserver", name: "SQL Server", shortName: "SQL Server", logo: "/tools/db-logos/sqlserver.png" },
  { id: "sqlite", name: "SQLite", shortName: "SQLite", logo: "/tools/db-logos/sqlite.png" },
  { id: "mariadb", name: "MariaDB", shortName: "MariaDB", logo: "/tools/db-logos/mariadb.png" },
];

export interface FAQ {
  question: string;
  answer: string;
}

export interface ConversionPair {
  slug: string;
  source: ConverterDialect;
  target: ConverterDialect;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  differences: string[];
  faqs: FAQ[];
}

export const CONVERSION_PAIRS: ConversionPair[] = [
  {
    slug: "mysql-to-postgresql",
    source: "mysql",
    target: "postgresql",
    title: "MySQL to PostgreSQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert MySQL queries to PostgreSQL syntax instantly. Free online tool handles AUTO_INCREMENT to SERIAL, backticks to double quotes, data type mapping, and more.",
    h1: "Free MySQL to PostgreSQL Converter",
    keywords: [
      "mysql to postgresql",
      "mysql to postgres",
      "convert mysql to postgresql",
      "mysql postgresql migration",
      "mysql to pg converter",
    ],
    differences: [
      "AUTO_INCREMENT → SERIAL/BIGSERIAL",
      "Backticks (`) → Double quotes (\")",
      "TINYINT(1) → BOOLEAN",
      "DATETIME → TIMESTAMP",
      "IFNULL() → COALESCE()",
      "LIMIT offset, count → LIMIT count OFFSET offset",
    ],
    faqs: [
      {
        question: "What are the main differences between MySQL and PostgreSQL syntax?",
        answer:
          "Key differences include: MySQL uses backticks for identifiers while PostgreSQL uses double quotes, AUTO_INCREMENT becomes SERIAL, TINYINT(1) maps to BOOLEAN, and function names differ (IFNULL vs COALESCE, NOW() vs CURRENT_TIMESTAMP).",
      },
      {
        question: "How do I convert AUTO_INCREMENT to PostgreSQL?",
        answer:
          "MySQL's AUTO_INCREMENT is converted to PostgreSQL's SERIAL (for INT) or BIGSERIAL (for BIGINT) data type, which automatically creates a sequence.",
      },
      {
        question: "Does this tool handle stored procedures?",
        answer:
          "The converter handles DDL (CREATE TABLE) and DML (SELECT, INSERT, UPDATE, DELETE) statements. Stored procedures may require manual review due to significant syntax differences.",
      },
    ],
  },
  {
    slug: "postgresql-to-mysql",
    source: "postgresql",
    target: "mysql",
    title: "PostgreSQL to MySQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert PostgreSQL queries to MySQL syntax instantly. Free online tool handles SERIAL to AUTO_INCREMENT, double quotes to backticks, and data type mapping.",
    h1: "Free PostgreSQL to MySQL Converter",
    keywords: [
      "postgresql to mysql",
      "postgres to mysql",
      "convert postgresql to mysql",
      "postgresql mysql migration",
      "pg to mysql converter",
    ],
    differences: [
      "SERIAL/BIGSERIAL → INT AUTO_INCREMENT",
      "Double quotes (\") → Backticks (`)",
      "BOOLEAN → TINYINT(1)",
      "TIMESTAMP → DATETIME",
      "COALESCE() → IFNULL() (for 2 args)",
      ":: type casting → CAST()",
    ],
    faqs: [
      {
        question: "How do I convert SERIAL columns to MySQL?",
        answer:
          "PostgreSQL's SERIAL type is converted to INT AUTO_INCREMENT in MySQL. BIGSERIAL becomes BIGINT AUTO_INCREMENT.",
      },
      {
        question: "What happens to PostgreSQL arrays in MySQL?",
        answer:
          "MySQL doesn't support array types natively. Arrays are typically converted to JSON columns or require schema redesign with junction tables.",
      },
      {
        question: "Are PostgreSQL-specific features supported?",
        answer:
          "Features like JSONB, array types, and custom types may require manual adjustment as MySQL handles these differently or doesn't support them.",
      },
    ],
  },
  {
    slug: "mysql-to-sqlserver",
    source: "mysql",
    target: "sqlserver",
    title: "MySQL to SQL Server Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert MySQL queries to SQL Server (T-SQL) syntax instantly. Free online tool handles AUTO_INCREMENT to IDENTITY, backticks to brackets, and data type mapping.",
    h1: "Free MySQL to SQL Server Converter",
    keywords: [
      "mysql to sql server",
      "mysql to mssql",
      "convert mysql to sql server",
      "mysql sqlserver migration",
      "mysql to t-sql converter",
    ],
    differences: [
      "AUTO_INCREMENT → IDENTITY(1,1)",
      "Backticks (`) → Square brackets ([])",
      "LIMIT → TOP or OFFSET FETCH",
      "TINYINT(1) → BIT",
      "TEXT → VARCHAR(MAX)",
      "NOW() → GETDATE()",
    ],
    faqs: [
      {
        question: "How is AUTO_INCREMENT converted to SQL Server?",
        answer:
          "MySQL's AUTO_INCREMENT is converted to SQL Server's IDENTITY(1,1) property, which auto-generates sequential values starting at 1 with increment of 1.",
      },
      {
        question: "How do I convert LIMIT clauses?",
        answer:
          "MySQL's LIMIT is converted to SQL Server's TOP clause for simple limits, or OFFSET/FETCH NEXT for pagination with offsets.",
      },
      {
        question: "What about MySQL's ENUM type?",
        answer:
          "SQL Server doesn't have ENUM. It's typically converted to a VARCHAR with a CHECK constraint or a separate lookup table.",
      },
    ],
  },
  {
    slug: "sqlserver-to-mysql",
    source: "sqlserver",
    target: "mysql",
    title: "SQL Server to MySQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert SQL Server (T-SQL) queries to MySQL syntax instantly. Free online tool handles IDENTITY to AUTO_INCREMENT, brackets to backticks, and data type mapping.",
    h1: "Free SQL Server to MySQL Converter",
    keywords: [
      "sql server to mysql",
      "mssql to mysql",
      "convert sql server to mysql",
      "sqlserver mysql migration",
      "t-sql to mysql converter",
    ],
    differences: [
      "IDENTITY(1,1) → AUTO_INCREMENT",
      "Square brackets ([]) → Backticks (`)",
      "TOP → LIMIT",
      "BIT → TINYINT(1)",
      "VARCHAR(MAX) → LONGTEXT",
      "GETDATE() → NOW()",
    ],
    faqs: [
      {
        question: "How is IDENTITY converted to MySQL?",
        answer:
          "SQL Server's IDENTITY(1,1) is converted to MySQL's AUTO_INCREMENT. The seed and increment values are handled by MySQL's auto_increment_increment setting.",
      },
      {
        question: "What happens to SQL Server's TOP clause?",
        answer:
          "TOP N is converted to LIMIT N in MySQL. TOP N PERCENT requires calculation and conversion to LIMIT.",
      },
      {
        question: "How are SQL Server schemas handled?",
        answer:
          "MySQL doesn't have schemas in the same way. Schema references like [dbo].[table] are typically removed or converted to database prefixes.",
      },
    ],
  },
  {
    slug: "sqlserver-to-postgresql",
    source: "sqlserver",
    target: "postgresql",
    title: "SQL Server to PostgreSQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert SQL Server (T-SQL) queries to PostgreSQL syntax instantly. Free online tool handles IDENTITY to SERIAL, brackets to double quotes, and data type mapping.",
    h1: "Free SQL Server to PostgreSQL Converter",
    keywords: [
      "sql server to postgresql",
      "mssql to postgresql",
      "mssql to postgres",
      "convert sql server to postgresql",
      "t-sql to postgresql converter",
    ],
    differences: [
      "IDENTITY(1,1) → SERIAL/BIGSERIAL",
      "Square brackets ([]) → Double quotes (\")",
      "TOP → LIMIT",
      "BIT → BOOLEAN",
      "NVARCHAR → VARCHAR",
      "GETDATE() → CURRENT_TIMESTAMP",
    ],
    faqs: [
      {
        question: "How is IDENTITY converted to PostgreSQL?",
        answer:
          "SQL Server's IDENTITY is converted to PostgreSQL's SERIAL (for INT) or BIGSERIAL (for BIGINT), or the newer GENERATED AS IDENTITY syntax.",
      },
      {
        question: "What about SQL Server's NVARCHAR?",
        answer:
          "PostgreSQL uses VARCHAR which is already Unicode-capable, so NVARCHAR(n) simply becomes VARCHAR(n).",
      },
      {
        question: "How are T-SQL specific functions handled?",
        answer:
          "T-SQL functions like GETDATE(), ISNULL(), and CONVERT() are mapped to PostgreSQL equivalents like CURRENT_TIMESTAMP, COALESCE(), and CAST().",
      },
    ],
  },
  {
    slug: "postgresql-to-sqlserver",
    source: "postgresql",
    target: "sqlserver",
    title: "PostgreSQL to SQL Server Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert PostgreSQL queries to SQL Server (T-SQL) syntax instantly. Free online tool handles SERIAL to IDENTITY, double quotes to brackets, and data type mapping.",
    h1: "Free PostgreSQL to SQL Server Converter",
    keywords: [
      "postgresql to sql server",
      "postgres to sql server",
      "postgresql to mssql",
      "convert postgresql to sql server",
      "postgresql to t-sql converter",
    ],
    differences: [
      "SERIAL/BIGSERIAL → IDENTITY(1,1)",
      "Double quotes (\") → Square brackets ([])",
      "LIMIT → TOP or OFFSET FETCH",
      "BOOLEAN → BIT",
      "TEXT → VARCHAR(MAX)",
      "CURRENT_TIMESTAMP → GETDATE()",
    ],
    faqs: [
      {
        question: "How is SERIAL converted to SQL Server?",
        answer:
          "PostgreSQL's SERIAL becomes INT IDENTITY(1,1) in SQL Server. BIGSERIAL becomes BIGINT IDENTITY(1,1).",
      },
      {
        question: "What about PostgreSQL's JSONB type?",
        answer:
          "SQL Server 2016+ supports JSON but stores it as NVARCHAR(MAX). JSON functions differ significantly between the databases.",
      },
      {
        question: "How is LIMIT/OFFSET converted?",
        answer:
          "PostgreSQL's LIMIT becomes TOP in simple cases, or OFFSET/FETCH NEXT for pagination in SQL Server 2012+.",
      },
    ],
  },
  {
    slug: "sqlite-to-postgresql",
    source: "sqlite",
    target: "postgresql",
    title: "SQLite to PostgreSQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert SQLite queries to PostgreSQL syntax instantly. Free online tool handles AUTOINCREMENT to SERIAL, data type mapping, and syntax differences.",
    h1: "Free SQLite to PostgreSQL Converter",
    keywords: [
      "sqlite to postgresql",
      "sqlite to postgres",
      "convert sqlite to postgresql",
      "sqlite postgresql migration",
      "sqlite to pg converter",
    ],
    differences: [
      "INTEGER PRIMARY KEY → SERIAL PRIMARY KEY",
      "AUTOINCREMENT → SERIAL",
      "TEXT → VARCHAR/TEXT",
      "No type enforcement → Strict typing",
      "|| for concat (same)",
      "datetime('now') → CURRENT_TIMESTAMP",
    ],
    faqs: [
      {
        question: "How is SQLite's AUTOINCREMENT handled?",
        answer:
          "SQLite's INTEGER PRIMARY KEY AUTOINCREMENT becomes SERIAL PRIMARY KEY in PostgreSQL, which creates an auto-incrementing sequence.",
      },
      {
        question: "What about SQLite's dynamic typing?",
        answer:
          "SQLite is dynamically typed while PostgreSQL is strictly typed. The converter maps SQLite affinities (TEXT, INTEGER, REAL, BLOB) to appropriate PostgreSQL types.",
      },
      {
        question: "Are SQLite's date functions converted?",
        answer:
          "Yes, SQLite functions like datetime('now') are converted to PostgreSQL equivalents like CURRENT_TIMESTAMP or NOW().",
      },
    ],
  },
  {
    slug: "sqlite-to-mysql",
    source: "sqlite",
    target: "mysql",
    title: "SQLite to MySQL Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert SQLite queries to MySQL syntax instantly. Free online tool handles AUTOINCREMENT to AUTO_INCREMENT, data type mapping, and syntax differences.",
    h1: "Free SQLite to MySQL Converter",
    keywords: [
      "sqlite to mysql",
      "convert sqlite to mysql",
      "sqlite mysql migration",
      "sqlite to mysql converter",
    ],
    differences: [
      "INTEGER PRIMARY KEY → INT AUTO_INCREMENT",
      "AUTOINCREMENT → AUTO_INCREMENT",
      "No quotes → Backticks (`)",
      "TEXT → VARCHAR/TEXT",
      "datetime('now') → NOW()",
      "GLOB → LIKE (with wildcards)",
    ],
    faqs: [
      {
        question: "How is AUTOINCREMENT converted to MySQL?",
        answer:
          "SQLite's INTEGER PRIMARY KEY AUTOINCREMENT becomes INT PRIMARY KEY AUTO_INCREMENT in MySQL.",
      },
      {
        question: "What about SQLite's flexible typing?",
        answer:
          "SQLite allows any type in any column, while MySQL enforces types. The converter maps to appropriate MySQL types based on the declared affinity.",
      },
      {
        question: "Are foreign keys handled?",
        answer:
          "Yes, foreign key constraints are converted. Note that MySQL with InnoDB enforces foreign keys, while SQLite requires PRAGMA foreign_keys = ON.",
      },
    ],
  },
  {
    slug: "mysql-to-sqlite",
    source: "mysql",
    target: "sqlite",
    title: "MySQL to SQLite Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert MySQL queries to SQLite syntax instantly. Free online tool handles AUTO_INCREMENT to AUTOINCREMENT, data type mapping, and syntax differences.",
    h1: "Free MySQL to SQLite Converter",
    keywords: [
      "mysql to sqlite",
      "convert mysql to sqlite",
      "mysql sqlite migration",
      "mysql to sqlite converter",
    ],
    differences: [
      "AUTO_INCREMENT → INTEGER PRIMARY KEY",
      "Backticks (`) → Double quotes or none",
      "INT/BIGINT → INTEGER",
      "VARCHAR(n) → TEXT",
      "NOW() → datetime('now')",
      "ENGINE=InnoDB → (removed)",
    ],
    faqs: [
      {
        question: "How is AUTO_INCREMENT converted to SQLite?",
        answer:
          "MySQL's AUTO_INCREMENT becomes INTEGER PRIMARY KEY in SQLite, which auto-increments by default. AUTOINCREMENT keyword is optional and changes behavior slightly.",
      },
      {
        question: "What happens to MySQL-specific features?",
        answer:
          "MySQL features like ENGINE, CHARSET, and COLLATE clauses are removed as SQLite doesn't support them. Stored procedures and triggers have different syntax.",
      },
      {
        question: "Are indexes preserved?",
        answer:
          "Yes, index definitions are converted to SQLite syntax. Note that SQLite handles indexes somewhat differently, especially for unique constraints.",
      },
    ],
  },
  {
    slug: "postgresql-to-sqlite",
    source: "postgresql",
    target: "sqlite",
    title: "PostgreSQL to SQLite Converter | Free SQL Migration Tool - ChartDB",
    description:
      "Convert PostgreSQL queries to SQLite syntax instantly. Free online tool handles SERIAL to INTEGER PRIMARY KEY, data type mapping, and syntax differences.",
    h1: "Free PostgreSQL to SQLite Converter",
    keywords: [
      "postgresql to sqlite",
      "postgres to sqlite",
      "convert postgresql to sqlite",
      "postgresql sqlite migration",
      "pg to sqlite converter",
    ],
    differences: [
      "SERIAL → INTEGER PRIMARY KEY",
      "Double quotes (\") → None or double quotes",
      "BOOLEAN → INTEGER (0/1)",
      "VARCHAR(n) → TEXT",
      "CURRENT_TIMESTAMP → datetime('now')",
      "Schemas → (removed)",
    ],
    faqs: [
      {
        question: "How is SERIAL converted to SQLite?",
        answer:
          "PostgreSQL's SERIAL becomes INTEGER PRIMARY KEY in SQLite. The sequence is handled automatically by SQLite's rowid mechanism.",
      },
      {
        question: "What about PostgreSQL arrays and JSON?",
        answer:
          "SQLite doesn't support array types. Arrays can be stored as JSON text. SQLite has JSON functions starting from version 3.38.0.",
      },
      {
        question: "Are PostgreSQL schemas handled?",
        answer:
          "SQLite doesn't have schemas. Schema-qualified names like 'public.table' are simplified to just the table name.",
      },
    ],
  },
];

export function getConversionBySlug(slug: string): ConversionPair | undefined {
  return CONVERSION_PAIRS.find((pair) => pair.slug === slug);
}

export function getDialectById(id: ConverterDialect): DialectInfo | undefined {
  return DIALECTS.find((d) => d.id === id);
}

export function getRelatedConversions(slug: string): ConversionPair[] {
  const current = getConversionBySlug(slug);
  if (!current) return [];

  return CONVERSION_PAIRS.filter(
    (pair) =>
      pair.slug !== slug &&
      (pair.source === current.source ||
        pair.target === current.target ||
        pair.source === current.target ||
        pair.target === current.source)
  ).slice(0, 4);
}

export function getReverseConversion(slug: string): ConversionPair | undefined {
  const current = getConversionBySlug(slug);
  if (!current) return undefined;

  return CONVERSION_PAIRS.find(
    (pair) => pair.source === current.target && pair.target === current.source
  );
}

export const EXAMPLE_SQL: Record<ConverterDialect, string> = {
  mysql: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT NOW(),
  INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2),
  status ENUM('pending', 'completed', 'cancelled'),
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,

  postgresql: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,

  sqlserver: `CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active BIT DEFAULT 1,
  created_at DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_email ON users(email);

CREATE TABLE orders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,

  sqlite: `CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_email ON users(email);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total REAL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,

  mariadb: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT NOW(),
  INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2),
  status ENUM('pending', 'completed', 'cancelled'),
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,
};
