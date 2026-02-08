// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callPerplexity, cleanJSON } from "@/lib/perplexity";

export async function POST(req: NextRequest) {
  try {
    const { prompt, brand, competitors } = await req.json();

    if (!prompt || !brand) {
      return NextResponse.json(
        { error: "prompt and brand are required" },
        { status: 400 }
      );
    }

    // Step 1: Get AI answer for the query
    const answer = await callPerplexity(
      [{ role: "user", content: prompt }],
      0.1
    );

    // Step 2: Analyze the response for brand visibility
    const analysisPrompt = `Analyze this AI response text:
---
${answer.slice(0, 3000)}
---

Target Brand: ${brand}
Competitors: ${(competitors || []).join(", ")}

Return a JSON object with these exact keys:
{
  "brand_mentioned": true,
  "brand_cited": false,
  "competitors_mentioned": ["Competitor A", "Competitor B"],
  "sentiment": "positive",
  "summary": "Short summary of the answer."
}

If the Target Brand is not found, set "brand_mentioned" to false.
"brand_cited" means there is a citation [1] or link attached specifically to the brand name.
Sentiment options: "positive", "neutral", "negative", "mixed".
Output ONLY valid JSON.`;

    const analysisRaw = await callPerplexity(
      [{ role: "user", content: analysisPrompt }],
      0.1
    );

    const cleaned = cleanJSON(analysisRaw);
    const analysis = JSON.parse(cleaned);

    return NextResponse.json({
      prompt,
      summary: analysis.summary || "No summary",
      brand_mentioned: !!analysis.brand_mentioned,
      brand_cited: !!analysis.brand_cited,
      competitors_mentioned: analysis.competitors_mentioned || [],
      sentiment: analysis.sentiment || "neutral",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("analyze error:", message);

    return NextResponse.json({
      prompt: "",
      summary: `Analysis failed: ${message}`,
      brand_mentioned: false,
      brand_cited: false,
      competitors_mentioned: [],
      sentiment: "neutral",
    });
  }
}
