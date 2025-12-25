import OpenAI from "openai";
import { NextRequest } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
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
    const { sql, dialect, error } = await request.json();

    if (!sql || !dialect) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const systemPrompt = `You are an expert SQL developer. Your task is to fix SQL syntax errors and explain what was wrong.

IMPORTANT: You MUST follow this exact format:
1. First, output ONLY the corrected SQL query between <<<SQL>>> and <<<END_SQL>>> markers
2. The corrected SQL MUST start with a single-line comment (using --) that briefly describes what was fixed
3. Then, output a brief explanation of what was wrong and what you fixed

Format your response EXACTLY like this:
<<<SQL>>>
-- Fixed: [very brief description of fix, e.g. "typo WHER -> WHERE"]
[The corrected SQL query here]
<<<END_SQL>>>

[Your explanation here - 1-2 sentences about what was wrong and what you fixed]

Be concise. The SQL dialect is ${dialect}.`;

    const userPrompt = `Please fix this ${dialect} SQL query that has a syntax error:

\`\`\`sql
${sql}
\`\`\`

${error ? `The error reported is: "${error}"` : ""}`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      max_tokens: 1000,
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
    console.error("Error fixing SQL:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
