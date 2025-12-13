"use server";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const systemPrompt = `
You are an expert text parser. 
Your ONLY output must be a VALID JSON OBJECT with exactly the following shape:

{
  "title": string | null,
  "sections": [
    {
      "id": string,
      "type": "paragraph" | "list" | "step_list" | "quote" | "code" | "note",
      "text": string | null,
      "items": string[] | null
    }
  ]
}

Rules:
- Do NOT include any explanation.
- Do NOT include markdown.
- Do NOT include backticks.
- Do NOT say \"Here is the JSON\".
- Return ONLY valid JSON.
`;

    const userPrompt = `
Parse the following text and return the JSON structure:

${text}
`;

    const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0
      })
    });

    const data = await llmRes.json();
    console.log("LLM RESPONSE RAW:", data);

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "LLM error" },
        { status: 500 }
      );
    }

    const jsonText = data.choices?.[0]?.message?.content;
    if (!jsonText) {
      return NextResponse.json({ error: "No content in response" }, { status: 500 });
    }

    let ast;
    try {
      ast = JSON.parse(jsonText);
    } catch (err) {
      console.log("BAD JSON:", jsonText);
      return NextResponse.json({ error: "Invalid JSON from LLM" }, { status: 500 });
    }

    return NextResponse.json({ ast });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
