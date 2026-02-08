// lib/perplexity.ts
// API key is read from server environment — never exposed to frontend

export function getApiKey(): string {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) {
    throw new Error(
      "PERPLEXITY_API_KEY is not configured. Add it to your .env.local file or Vercel Environment Variables."
    );
  }
  return key;
}

export async function callPerplexity(
  messages: { role: string; content: string }[],
  temperature = 0.1,
  model = "sonar-pro"
): Promise<string> {
  const apiKey = getApiKey();

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Perplexity API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export function cleanJSON(raw: string): string {
  let content = raw.trim();
  if (content.includes("```json")) {
    content = content.split("```json")[1].split("```")[0].trim();
  } else if (content.includes("```")) {
    content = content.split("```")[1].split("```")[0].trim();
  }
  return content;
}
