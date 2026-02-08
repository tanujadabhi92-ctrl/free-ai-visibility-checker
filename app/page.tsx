"use client";

import { useState, useRef } from "react";

interface Config {
  brand: string;
  competitors: string;
  niche: string;
  location: string;
  numPrompts: number;
}

interface Result {
  prompt: string;
  summary: string;
  brand_mentioned: boolean;
  brand_cited: boolean;
  competitors_mentioned: string[];
  sentiment: string;
}

interface Scores {
  overall: number;
  recognition: number;
  market: number;
  quality: number;
  sentiment: number;
  totalQueries: number;
  mentionedCount: number;
  citedCount: number;
  positiveCount: number;
}

const STEPS = ["Enter Details", "Generating", "Analyzing", "Results"];

// ─── Feature Card Data ───
const FEATURES = [
  {
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
      </svg>
    ),
    title: "AI Visibility Score",
    description: "Measures how often your brand appears in AI-generated answers across topics, and how consistently it shows up compared to other brands. Higher score means better visibility.",
    gradient: "linear-gradient(135deg, #06d6a015, #118ab210)",
    borderColor: "#06d6a030",
  },
  {
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ffd166" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" />
      </svg>
    ),
    title: "Find Hot Topics for Your Brand",
    description: "Discover high-potential topics where your brand is missing. Create content that puts you back in the conversation and boost your AI visibility.",
    gradient: "linear-gradient(135deg, #ffd16615, #e6a80010)",
    borderColor: "#ffd16630",
  },
  {
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#118ab2" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Explore Competitor Strategies",
    description: "See which topics competitors dominate and where they publish. Use these insights to create content and grow visibility in AI-generated answers.",
    gradient: "linear-gradient(135deg, #118ab215, #06d6a010)",
    borderColor: "#118ab230",
  },
  {
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#ef476f" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect width={18} height={18} x={3} y={3} rx={2} /><path d="M7 7h.01" /><path d="M17 7h.01" />
        <path d="M7 17h.01" /><path d="M17 17h.01" /><path d="m8 12 4-4 4 4" />
      </svg>
    ),
    title: "Optimize Your Domain for AI",
    description: "Make sure AI bots can crawl your domain and use your content. If crawlers can't access it, your site won't appear in AI answers.",
    gradient: "linear-gradient(135deg, #ef476f15, #c0392b10)",
    borderColor: "#ef476f30",
  },
];

// ─── Score Gauge ───
function ScoreGauge({
  value, max, label, color = "var(--accent)",
}: {
  value: number; max: number; label: string; color?: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const r = 54, stroke = 10, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="text-center">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={70} cy={70} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
        <text x={70} y={66} textAnchor="middle" fill="white" fontSize={28} fontWeight={700}>{value}</text>
        <text x={70} y={86} textAnchor="middle" fill="var(--muted)" fontSize={12}>/ {max}</text>
      </svg>
      <div className="text-sm" style={{ color: "var(--muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Step Indicator ───
function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: 32, height: 32,
              background: i <= step ? "var(--accent)" : "transparent",
              color: i <= step ? "var(--bg)" : "var(--muted)",
              border: `2px solid ${i <= step ? "var(--accent)" : "var(--border)"}`,
              transition: "all 0.3s ease",
            }}>
            {i < step ? "✓" : i + 1}
          </div>
          <span className="text-sm" style={{
            color: i <= step ? "var(--text)" : "var(--muted)",
            fontWeight: i === step ? 600 : 400,
          }}>{s}</span>
          {i < STEPS.length - 1 && (
            <div style={{ width: 24, height: 2, background: i < step ? "var(--accent)" : "var(--border)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Sentiment Badge ───
function SentimentBadge({ value }: { value: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    positive: { bg: "#06d6a022", color: "var(--accent)", border: "#06d6a044" },
    negative: { bg: "#ef476f22", color: "var(--danger)", border: "#ef476f44" },
    neutral: { bg: "#ffd16622", color: "var(--warn)", border: "#ffd16644" },
    mixed: { bg: "#118ab222", color: "var(--accent-alt)", border: "#118ab244" },
  };
  const s = map[value] || map.neutral;
  return (
    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {(value || "neutral").toUpperCase()}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--muted)" }}>{label}</label>
      {children}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════
export default function Home() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<Config>({
    brand: "",
    competitors: "",
    niche: "",
    location: "",
    numPrompts: 3,
  });
  const [results, setResults] = useState<Result[]>([]);
  const [scores, setScores] = useState<Scores | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [error, setError] = useState("");
  const abortRef = useRef(false);

  const card: React.CSSProperties = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: 28,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", background: "var(--surface-alt)",
    border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)",
    fontSize: 14, outline: "none",
  };

  // ─── Start ───
  async function handleStart() {
    if (!config.brand || !config.niche) {
      setError("Please fill in your Brand name and Industry/Niche.");
      return;
    }
    setError("");
    abortRef.current = false;
    setStep(1);
    setProgress({ current: 0, total: 1, label: "Generating search queries..." });

    try {
      const res = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: config.niche,
          location: config.location,
          numPrompts: config.numPrompts,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.prompts?.length) throw new Error("No prompts generated");

      setProgress({ current: 1, total: 1, label: "Queries generated!" });
      await sleep(600);
      runAnalysis(data.prompts);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setStep(0);
    }
  }

  // ─── Analyze each query ───
  async function runAnalysis(queryList: string[]) {
    setStep(2);
    const allResults: Result[] = [];
    const competitors = config.competitors.split(",").map((c: string) => c.trim()).filter(Boolean);

    for (let i = 0; i < queryList.length; i++) {
      if (abortRef.current) break;
      setProgress({
        current: i,
        total: queryList.length,
        label: `Analyzing query ${i + 1} of ${queryList.length}...`,
      });

      try {
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: queryList[i],
            brand: config.brand,
            competitors,
          }),
        });
        const result = await analyzeRes.json();
        allResults.push({ ...result, prompt: queryList[i] });
      } catch {
        allResults.push({
          prompt: queryList[i], summary: "Analysis failed",
          brand_mentioned: false, brand_cited: false,
          competitors_mentioned: [], sentiment: "neutral",
        });
      }
      await sleep(800);
    }

    setProgress({ current: queryList.length, total: queryList.length, label: "Analysis complete!" });
    setResults(allResults);

    const total = allResults.length;
    const mentioned = allResults.filter((r) => r.brand_mentioned).length;
    const cited = allResults.filter((r) => r.brand_cited).length;
    const positive = allResults.filter((r) => r.sentiment === "positive").length;

    setScores({
      overall: total > 0 ? Math.round((mentioned / total) * 100) : 0,
      recognition: total > 0 ? Math.round((mentioned / total) * 20) : 0,
      market: total > 0 ? Math.round((mentioned / total) * 10) : 0,
      quality: total > 0 ? Math.round(((mentioned + cited) / (total * 2)) * 20) : 0,
      sentiment: total > 0 ? Math.round((positive / total) * 40) : 0,
      totalQueries: total, mentionedCount: mentioned, citedCount: cited, positiveCount: positive,
    });

    await sleep(400);
    setStep(3);
  }

  function handleReset() {
    abortRef.current = true;
    setStep(0); setResults([]); setScores(null); setError("");
  }

  // ════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(10, 14, 23, 0.85)",
          backdropFilter: "blur(12px)",
        }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl font-bold"
            style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, var(--accent), var(--accent-alt))",
              color: "var(--bg)", fontSize: 18,
            }}>A</div>
          <div>
            <div className="text-lg font-bold" style={{ letterSpacing: "-0.02em" }}>
              AEO <span style={{ color: "var(--accent)" }}>Grader</span>
            </div>
            <div className="text-xs uppercase" style={{ color: "var(--muted)", letterSpacing: "0.05em" }}>
              Answer Engine Optimization
            </div>
          </div>
        </div>
        {step > 0 && (
          <button onClick={handleReset} className="px-4 py-1.5 rounded-lg text-sm cursor-pointer"
            style={{
              background: step === 3 ? "var(--accent-dim)" : "transparent",
              border: `1px solid ${step === 3 ? "var(--accent)" : "var(--border)"}`,
              color: step === 3 ? "var(--accent)" : "var(--muted)",
              fontWeight: step === 3 ? 600 : 400,
            }}>
            {step === 3 ? "New Analysis" : "Cancel"}
          </button>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">

        {/* ═══════════════════════════════════════════ */}
        {/* STEP 0: Hero + Form + Feature Cards        */}
        {/* ═══════════════════════════════════════════ */}
        {step === 0 && (
          <div className="fade-up">

            {/* ─── Hero Section ─── */}
            <div className="text-center mb-10" style={{ maxWidth: 700, margin: "0 auto 48px" }}>
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid #06d6a044",
                  letterSpacing: "0.04em",
                }}>
                FREE AI VISIBILITY CHECKER
              </div>
              <h1 className="font-bold mb-4"
                style={{
                  fontSize: 48,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  background: "linear-gradient(135deg, #ffffff 0%, var(--accent) 60%, var(--accent-alt) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                Free AI Visibility Checker
              </h1>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                ⚡ Created by Pintu Dabhi - <a href="https://www.linkedin.com/in/pintudabhi/">https://www.linkedin.com/in/pintudabhi/</a>
              </span>
              <p>&nbsp;</p>
              <p className="text-lg" style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                AI Visibility Score measures how often your brand appears in AI-generated answers across topics,
                and how consistently it shows up compared to other brands.
                <span style={{ color: "var(--accent)", fontWeight: 600 }}> Higher score means better visibility.</span>
              </p>
            </div>

            {/* ─── Two-Column: Form + Features ─── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start", maxWidth: 960, margin: "0 auto" }}>

              {/* Left Column: Form */}
              <div style={card}>
                <h2 className="text-lg font-bold mb-1" style={{ color: "white" }}>
                  Check Your Brand
                </h2>
                <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
                  Enter your details and we&apos;ll analyze your AI visibility in under 2 minutes.
                </p>

                {error && (
                  <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                    style={{ background: "#ef476f18", border: "1px solid #ef476f44", color: "var(--danger)" }}>
                    ⚠ {error}
                  </div>
                )}

                <div className="grid gap-4">
                  <Field label="Your Brand *">
                    <input placeholder="e.g. Top10 Property Agents" value={config.brand}
                      onChange={(e) => setConfig((p) => ({ ...p, brand: e.target.value }))}
                      style={inputStyle} />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Industry / Niche *">
                      <input placeholder="e.g. Real Estate Agents" value={config.niche}
                        onChange={(e) => setConfig((p) => ({ ...p, niche: e.target.value }))}
                        style={inputStyle} />
                    </Field>
                    <Field label="Location">
                      <input placeholder="e.g. UK" value={config.location}
                        onChange={(e) => setConfig((p) => ({ ...p, location: e.target.value }))}
                        style={inputStyle} />
                    </Field>
                  </div>

                  <Field label="Competitors (comma-separated)">
                    <input placeholder="e.g. Rightmove, Zoopla, OpenRent" value={config.competitors}
                      onChange={(e) => setConfig((p) => ({ ...p, competitors: e.target.value }))}
                      style={inputStyle} />
                  </Field>

                  <Field label={`Number of AI Queries: ${config.numPrompts}`}>
                    <input type="range" min={3} max={3} value={config.numPrompts}
                      onChange={(e) => setConfig((p) => ({ ...p, numPrompts: +e.target.value }))}
                      style={{ width: "100%", accentColor: "var(--accent)" }} />
                    <div className="flex justify-between text-xs mt-1" style={{ color: "var(--muted)" }}>
                      <span>3 (fixed)</span>
                    </div>
                  </Field>
                </div>

                <button onClick={handleStart}
                  className="w-full mt-5 py-3.5 rounded-xl border-none text-base font-bold cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-alt))",
                    color: "var(--bg)", letterSpacing: "-0.01em",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLElement).style.transform = "translateY(-1px)";
                    (e.target as HTMLElement).style.boxShadow = "0 8px 24px #06d6a033";
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLElement).style.transform = "translateY(0)";
                    (e.target as HTMLElement).style.boxShadow = "none";
                  }}>
                  Analyze My Brand Visibility →
                </button>


              </div>

              {/* Right Column: Feature Cards */}
              <div className="grid gap-4">
                {FEATURES.map((f, i) => (
                  <div key={i} style={{
                    background: f.gradient,
                    border: `1px solid ${f.borderColor}`,
                    borderRadius: 14,
                    padding: "20px 22px",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    cursor: "default",
                  }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.borderColor = f.borderColor.replace("30", "60");
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.borderColor = f.borderColor;
                    }}>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          width: 44, height: 44,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1" style={{ color: "white" }}>
                          {f.title}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                          {f.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Trust Bar ─── */}
            <div className="text-center mt-12 mb-4">
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {[
                  { icon: "🔒", text: "No signup required" },
                  { icon: "⚡", text: "Results in under 2 min" },
                  { icon: "🆓", text: "100% Free" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 1-2: Progress ═══ */}
        {(step === 1 || step === 2) && (
          <div className="fade-up max-w-lg mx-auto" style={{ marginTop: 40 }}>
            <StepIndicator step={step} />
            <div style={card} className="text-center">
              <div className="pulse mx-auto mb-5 flex items-center justify-center rounded-full text-2xl"
                style={{ width: 56, height: 56, background: "var(--accent-dim)" }}>
                {step === 1 ? "🔍" : "🧠"}
              </div>
              <h2 className="text-xl font-bold mb-2">
                {step === 1 ? "Generating Queries..." : "Analyzing AI Responses..."}
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                {step === 1
                  ? "Crafting realistic search queries for your niche..."
                  : `Query ${Math.min(progress.current + 1, progress.total)} of ${progress.total}`}
              </p>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--muted)" }}>
                  <span style={{ maxWidth: "75%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {progress.label}
                  </span>
                  <span>{progress.current}/{progress.total}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--border)" }}>
                  <div className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--accent), var(--accent-alt))",
                      width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 5}%`,
                      transition: "width 0.4s ease",
                    }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Results ═══ */}
        {step === 3 && scores && (
          <div className="fade-up">
            <StepIndicator step={step} />

            {/* Big score */}
            <div style={{
              ...card, textAlign: "center", marginBottom: 24,
              background: "linear-gradient(135deg, var(--surface), var(--surface-alt))",
            }}>
              <div className="text-xs uppercase mb-1"
                style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>
                AEO Visibility Score
              </div>
              <div className="font-bold" style={{
                fontSize: 72, letterSpacing: "-0.04em",
                background: scores.overall >= 50
                  ? "linear-gradient(135deg, var(--accent), var(--accent-alt))"
                  : scores.overall >= 20
                    ? "linear-gradient(135deg, var(--warn), #e6a800)"
                    : "linear-gradient(135deg, var(--danger), #c0392b)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {scores.overall}%
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                for <strong style={{ color: "white" }}>{config.brand}</strong> in {config.niche}
              </div>
              <div className="mt-4 px-5 py-3 rounded-xl text-sm" style={{
                background: scores.overall >= 50 ? "#06d6a012" : scores.overall >= 20 ? "#ffd16612" : "#ef476f12",
                border: `1px solid ${scores.overall >= 50 ? "#06d6a033" : scores.overall >= 20 ? "#ffd16633" : "#ef476f33"}`,
                color: scores.overall >= 50 ? "var(--accent)" : scores.overall >= 20 ? "var(--warn)" : "var(--danger)",
              }}>
                {scores.overall >= 50 ? "🎉 Great AI visibility! Keep optimizing to maintain your lead."
                  : scores.overall >= 20 ? "⚠️ Moderate visibility. Your brand appears sometimes — room to improve."
                    : "🚨 Low visibility. AI engines rarely mention your brand — AEO strategy needed."}
              </div>
            </div>

            {/* Gauges */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div style={{ ...card, padding: 20 }}><ScoreGauge value={scores.recognition} max={20} label="Recognition" /></div>
              <div style={{ ...card, padding: 20 }}><ScoreGauge value={scores.market} max={10} label="Market" color="var(--accent-alt)" /></div>
              <div style={{ ...card, padding: 20 }}><ScoreGauge value={scores.quality} max={20} label="Quality" color="var(--warn)" /></div>
              <div style={{ ...card, padding: 20 }}>
                <ScoreGauge value={scores.sentiment} max={40} label="Sentiment"
                  color={scores.sentiment >= 20 ? "var(--accent)" : "var(--danger)"} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[
                { icon: "📋", value: scores.totalQueries, label: "Queries Tested" },
                { icon: "✅", value: scores.mentionedCount, label: "Brand Mentioned" },
                { icon: "🔗", value: scores.citedCount, label: "Brand Cited" },
                { icon: "😊", value: scores.positiveCount, label: "Positive Sentiment" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3" style={{ ...card, padding: 18 }}>
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="text-xl font-bold" style={{ color: "white" }}>{s.value}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div className="px-6 py-4 font-bold" style={{ borderBottom: "1px solid var(--border)" }}>
                Detailed Query Analysis
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--surface-alt)" }}>
                      {["#", "Query", "AI Summary", "Brand Found", "Competitors", "Sentiment"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase font-semibold"
                          style={{
                            color: "var(--muted)", letterSpacing: "0.06em",
                            borderBottom: "1px solid var(--border)",
                          }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{i + 1}</td>
                        <td className="px-4 py-3 font-medium" style={{ maxWidth: 200 }}>{r.prompt}</td>
                        <td className="px-4 py-3" style={{ color: "var(--muted)", maxWidth: 240, fontSize: 12, lineHeight: 1.5 }}>
                          {r.summary}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold"
                            style={{
                              background: r.brand_mentioned ? "#06d6a022" : "#ef476f22",
                              color: r.brand_mentioned ? "var(--accent)" : "var(--danger)",
                              border: `1px solid ${r.brand_mentioned ? "#06d6a044" : "#ef476f44"}`,
                            }}>
                            {r.brand_mentioned ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--muted)", fontSize: 12 }}>
                          {r.competitors_mentioned?.join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3"><SentimentBadge value={r.sentiment} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}