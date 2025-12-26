import OpenAI from "openai";
import { NextRequest } from "next/server";

const allowedOrigins = [
  "https://chartdb-free-tools.vercel.app",
  "https://chartdb.io",
  "https://www.chartdb.io",
  "https://app.chartdb.io",
  "http://localhost:3000",
];

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { sql, sourceDialect, targetDialect } = await request.json();

    if (!sql || !sourceDialect || !targetDialect) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const dialectNames: Record<string, string> = {
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      sqlserver: "SQL Server (T-SQL)",
      sqlite: "SQLite",
      mariadb: "MariaDB",
    };

    const sourceName = dialectNames[sourceDialect] || sourceDialect;
    const targetName = dialectNames[targetDialect] || targetDialect;

    const systemPrompt = `You are an expert SQL developer specializing in database migrations. Your task is to convert SQL from ${sourceName} to ${targetName}.

IMPORTANT: You MUST follow this exact format:
1. Output the converted SQL between <<<SQL>>> and <<<END_SQL>>> markers
2. Then output a brief summary of the key changes made

Format your response EXACTLY like this:
<<<SQL>>>
[The converted SQL code here]
<<<END_SQL>>>

## Conversion Summary
[Brief bullet points of key changes made, e.g.:]
- Changed AUTO_INCREMENT to SERIAL
- Converted backticks to double quotes
- Mapped TINYINT(1) to BOOLEAN

Conversion Rules for ${sourceName} to ${targetName}:

${getConversionRules(sourceDialect, targetDialect)}

Additional Guidelines:
- Preserve all table and column names exactly
- Maintain the same constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL)
- Convert data types appropriately for the target database
- Handle identifier quoting correctly for the target dialect
- Keep comments if present
- Format the output SQL cleanly with proper indentation
- If something cannot be directly converted, add a SQL comment explaining the issue`;

    const userPrompt = `Convert this ${sourceName} SQL to ${targetName}:

\`\`\`sql
${sql}
\`\`\`

Provide the converted SQL and a summary of the changes made.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 3000,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error converting SQL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}

function getConversionRules(source: string, target: string): string {
  const rules: Record<string, Record<string, string>> = {
    mysql: {
      postgresql: `
- AUTO_INCREMENT → SERIAL (for INT) or BIGSERIAL (for BIGINT)
- Backticks (\`) → Double quotes (") for identifiers
- TINYINT(1) → BOOLEAN
- DATETIME → TIMESTAMP
- INT(n) → INTEGER (remove display width)
- DOUBLE → DOUBLE PRECISION
- BLOB → BYTEA
- TEXT types remain TEXT
- IFNULL() → COALESCE()
- NOW() → CURRENT_TIMESTAMP or NOW()
- LIMIT offset, count → LIMIT count OFFSET offset
- ENGINE=InnoDB, CHARSET, COLLATE → Remove (not supported)
- ENUM → VARCHAR with CHECK constraint or custom TYPE
- UNSIGNED → Add CHECK constraint (col >= 0)
- ON UPDATE CURRENT_TIMESTAMP → Use trigger instead`,
      sqlserver: `
- AUTO_INCREMENT → IDENTITY(1,1)
- Backticks (\`) → Square brackets ([]) for identifiers
- TINYINT(1) → BIT
- DATETIME → DATETIME or DATETIME2
- TEXT → VARCHAR(MAX)
- LONGTEXT → VARCHAR(MAX)
- DOUBLE → FLOAT
- BLOB → VARBINARY(MAX)
- NOW() → GETDATE()
- IFNULL() → ISNULL()
- LIMIT n → TOP n (simple cases) or OFFSET/FETCH
- LIMIT offset, n → OFFSET offset ROWS FETCH NEXT n ROWS ONLY
- ENGINE, CHARSET, COLLATE → Remove
- ENUM → VARCHAR with CHECK constraint
- UNSIGNED → CHECK constraint`,
      sqlite: `
- AUTO_INCREMENT → INTEGER PRIMARY KEY (AUTOINCREMENT optional)
- Backticks (\`) → Double quotes (") or remove
- All INT types → INTEGER
- VARCHAR(n), TEXT → TEXT
- DATETIME → TEXT (stored as ISO8601)
- DECIMAL → REAL
- BLOB → BLOB
- NOW() → datetime('now')
- ENGINE, CHARSET, COLLATE → Remove
- ENUM → TEXT with CHECK constraint
- Named indexes stay the same`,
    },
    postgresql: {
      mysql: `
- SERIAL → INT AUTO_INCREMENT
- BIGSERIAL → BIGINT AUTO_INCREMENT
- Double quotes (") → Backticks (\`) for identifiers
- BOOLEAN → TINYINT(1)
- TIMESTAMP → DATETIME
- DOUBLE PRECISION → DOUBLE
- BYTEA → BLOB
- TEXT → TEXT or LONGTEXT
- COALESCE() → IFNULL() (for 2 args)
- CURRENT_TIMESTAMP → NOW()
- :: type cast → CAST(x AS type)
- LIMIT count OFFSET offset → LIMIT offset, count
- ARRAY types → JSON or redesign
- JSONB → JSON
- Custom types → VARCHAR or ENUM
- CREATE INDEX CONCURRENTLY → CREATE INDEX`,
      sqlserver: `
- SERIAL → INT IDENTITY(1,1)
- BIGSERIAL → BIGINT IDENTITY(1,1)
- Double quotes (") → Square brackets ([])
- BOOLEAN → BIT
- TEXT → VARCHAR(MAX)
- TIMESTAMP → DATETIME2
- BYTEA → VARBINARY(MAX)
- COALESCE() stays COALESCE()
- CURRENT_TIMESTAMP → GETDATE() or CURRENT_TIMESTAMP
- LIMIT n → TOP n or OFFSET/FETCH
- :: type cast → CAST(x AS type)
- Arrays → JSON or redesign
- JSONB → NVARCHAR(MAX) with JSON functions`,
      sqlite: `
- SERIAL → INTEGER PRIMARY KEY
- BIGSERIAL → INTEGER PRIMARY KEY
- Double quotes remain or remove
- BOOLEAN → INTEGER (0/1)
- TIMESTAMP → TEXT
- All numeric types → INTEGER or REAL
- VARCHAR → TEXT
- BYTEA → BLOB
- CURRENT_TIMESTAMP → datetime('now')
- Schema prefixes (public.) → Remove
- Arrays → JSON text
- Custom types → TEXT`,
    },
    sqlserver: {
      mysql: `
- IDENTITY(1,1) → AUTO_INCREMENT
- Square brackets ([]) → Backticks (\`)
- BIT → TINYINT(1)
- DATETIME2 → DATETIME
- VARCHAR(MAX) → LONGTEXT
- NVARCHAR → VARCHAR (MySQL is UTF8)
- VARBINARY(MAX) → LONGBLOB
- GETDATE() → NOW()
- ISNULL() → IFNULL()
- TOP n → LIMIT n
- OFFSET/FETCH → LIMIT offset, count
- [dbo]. schema prefix → Remove
- UNIQUEIDENTIFIER → CHAR(36)`,
      postgresql: `
- IDENTITY(1,1) → SERIAL or GENERATED AS IDENTITY
- Square brackets ([]) → Double quotes (")
- BIT → BOOLEAN
- DATETIME2 → TIMESTAMP
- VARCHAR(MAX) → TEXT
- NVARCHAR → VARCHAR
- VARBINARY(MAX) → BYTEA
- GETDATE() → CURRENT_TIMESTAMP
- ISNULL() → COALESCE()
- TOP n → LIMIT n
- OFFSET/FETCH → LIMIT/OFFSET
- [dbo]. schema prefix → public. or remove
- UNIQUEIDENTIFIER → UUID`,
    },
    sqlite: {
      mysql: `
- INTEGER PRIMARY KEY → INT AUTO_INCREMENT PRIMARY KEY
- AUTOINCREMENT → AUTO_INCREMENT
- TEXT → VARCHAR(255) or TEXT
- REAL → DOUBLE
- BLOB → BLOB
- datetime('now') → NOW()
- No type → appropriate MySQL type
- Flexible typing → Strict typing`,
      postgresql: `
- INTEGER PRIMARY KEY → SERIAL PRIMARY KEY
- AUTOINCREMENT → SERIAL
- TEXT → VARCHAR or TEXT
- REAL → DOUBLE PRECISION
- BLOB → BYTEA
- datetime('now') → CURRENT_TIMESTAMP
- Flexible typing → Strict typing`,
    },
  };

  return rules[source]?.[target] || "Convert syntax appropriately for the target database.";
}
