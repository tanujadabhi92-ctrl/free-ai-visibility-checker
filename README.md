# AEO Grader — Answer Engine Optimization Tool

A Next.js web app that analyzes your brand's visibility in AI answer engines.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Perplexity API key
#    Edit .env.local and paste your key:
#    PERPLEXITY_API_KEY=pplx-your-key-here

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com → Import project
3. **Add Environment Variable:**
   - Key: `PERPLEXITY_API_KEY`
   - Value: `pplx-your-key-here`
4. Click Deploy

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-prompts/route.ts   # Generates AI search queries
│   │   └── analyze/route.ts            # Queries + analyzes each prompt
│   ├── layout.tsx
│   ├── page.tsx                        # Main UI
│   └── globals.css
├── lib/
│   └── perplexity.ts                   # Server-side API helper (reads key from env)
├── .env.local                          # YOUR API KEY GOES HERE
└── package.json
```
