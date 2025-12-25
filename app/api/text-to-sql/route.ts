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
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { prompt, schema, dialect } = await request.json();

    if (!prompt || !dialect) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const systemPrompt = `You are an expert SQL developer. Your task is to convert natural language descriptions into SQL queries.

IMPORTANT: You MUST follow this exact format:
1. First, output ONLY the SQL query between <<<SQL>>> and <<<END_SQL>>> markers
2. Then, output a brief explanation of the query

Format your response EXACTLY like this:
<<<SQL>>>
[The SQL query here]
<<<END_SQL>>>

[Brief explanation of what the query does - 1-2 sentences]

Rules:
- Generate valid ${dialect} SQL syntax
- Use proper ${dialect}-specific functions and syntax
- If a schema is provided, use the exact table and column names from it
- If no schema is provided, use reasonable table and column names based on the request
- Write clean, readable SQL with proper formatting
- Be concise in your explanation`;

    const userPrompt = `Convert this natural language request to a ${dialect} SQL query:

"${prompt}"

${schema ? `Database schema:\n\`\`\`sql\n${schema}\n\`\`\`` : "No schema provided - use reasonable table and column names."}`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 1500,
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
    console.error("Error generating SQL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
