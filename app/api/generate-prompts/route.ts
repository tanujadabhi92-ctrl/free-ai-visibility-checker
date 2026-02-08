// app/api/generate-prompts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callPerplexity, cleanJSON } from "@/lib/perplexity";

export async function POST(req: NextRequest) {
  try {
    const { niche, location, numPrompts } = await req.json();

    if (!niche) {
      return NextResponse.json(
        { error: "Niche/industry is required" },
        { status: 400 }
      );
    }

    const content = await callPerplexity(
      [
        {
          role: "system",
          content:
            "You are a helpful assistant. Output ONLY a valid JSON array of strings.",
        },
        {
          role: "user",
          content: `Generate ${numPrompts || 5} realistic search queries that potential customers would ask an AI Answer Engine about ${niche} in ${location || "worldwide"}.
Focus on: Comparisons, best options, safety regulations, buying advice, pricing, and brand recommendations.
Output format: ["question 1", "question 2", "question 3"]
Do not output markdown code blocks. Just the raw JSON array.`,
        },
      ],
      0.7
    );

    const cleaned = cleanJSON(content);
    const prompts = JSON.parse(cleaned);

    if (!Array.isArray(prompts)) {
      throw new Error("Response was not a JSON array");
    }

    return NextResponse.json({ prompts });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("generate-prompts error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
