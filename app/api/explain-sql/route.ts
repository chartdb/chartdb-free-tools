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
    const { sql, dialect } = await request.json();

    if (!sql || !dialect) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const systemPrompt = `You are a friendly SQL teacher explaining queries to developers learning SQL.

IMPORTANT: You MUST follow this exact format:
1. Output the explanation between <<<EXPLANATION>>> and <<<END_EXPLANATION>>> markers
2. Structure your explanation clearly with markdown sections

Format your response EXACTLY like this:
<<<EXPLANATION>>>
## What This Query Does
[1-2 sentence high-level summary of the query's purpose]

## Step-by-Step Breakdown

1. **FROM / JOINs**: [Explain which tables are being accessed and how they're connected]
2. **WHERE Conditions**: [Explain any filtering conditions]
3. **SELECT Columns**: [Explain what data is being retrieved]
4. **GROUP BY / Aggregations**: [If applicable, explain grouping and aggregate functions]
5. **HAVING**: [If applicable, explain post-aggregation filtering]
6. **ORDER BY**: [If applicable, explain sorting]
7. **LIMIT / OFFSET**: [If applicable, explain result limiting]

## Tables & Columns Referenced
- **Table**: \`table_name\`
  - Column: \`column_name\`

## Key Concepts Used
[List any important SQL concepts like JOINs, subqueries, CTEs, window functions, etc.]
<<<END_EXPLANATION>>>

Rules:
- Use simple, beginner-friendly language
- Explain SQL keywords and concepts briefly when you use them
- If the query has complex parts (subqueries, CTEs, window functions), break them down
- Be thorough but concise - aim for clarity over brevity
- The SQL dialect is ${dialect} - mention any dialect-specific syntax if relevant
- If the query appears to have errors, still explain what it's trying to do
- Only include sections that are relevant to the query (skip empty sections)`;

    const userPrompt = `Please explain this ${dialect} SQL query in plain English:

\`\`\`sql
${sql}
\`\`\`

Explain step by step what this query does, what tables and columns it references, and any important SQL concepts it uses.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 2000,
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
    console.error("Error explaining SQL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
