"use client";

import { useEffect, useMemo, useState } from "react";
import * as webllm from "@mlc-ai/web-llm";

const MODELS = [
  // Licht en snel (aanrader om te starten)
  { id: "Llama-3.2-1B-Instruct-q4f16_1-MLC", label: "Llama 3.2 1B (fast)" },
  // Iets zwaarder maar vaak beter
  { id: "Llama-3.2-3B-Instruct-q4f16_1-MLC", label: "Llama 3.2 3B (better)" },
];

const STYLES = [
  "Cinematic",
  "Photorealistic",
  "Anime",
  "3D Render",
  "Pixel Art",
  "Watercolor",
  "Logo / Vector",
];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [modelId, setModelId] = useState(MODELS[0].id);

  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const [loadingModel, setLoadingModel] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [result, setResult] = useState({
    prompt: "",
    negative: "",
    settings: "",
  });

  const webgpuSupported = useMemo(() => {
    // WebLLM gebruikt WebGPU
    return typeof navigator !== "undefined" && !!navigator.gpu;
  }, []);

  async function loadModel() {
    if (!webgpuSupported) return;

    setLoadingModel(true);
    setStatus("Downloading model…");
    setProgress(0);

    try {
      const e = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (report) => {
          // report.progress is 0..1 (meestal)
          const p = Math.round((report.progress ?? 0) * 100);
          setProgress(Number.isFinite(p) ? p : 0);
          setStatus(report.text || "Loading…");
        },
      });
      setEngine(e);
      setStatus("Model ready ✅");
      setProgress(100);
    } catch (err) {
      setStatus(`Model load failed: ${err?.message || String(err)}`);
    } finally {
      setLoadingModel(false);
    }
  }

  useEffect(() => {
    // Auto-load bij eerste keer (optioneel: je kan dit ook via knop laten)
    // We houden het “handmatig” zodat jij controle hebt.
  }, []);

  async function generatePrompt() {
    if (!engine) {
      setStatus("Load the model first.");
      return;
    }
    if (!idea.trim()) return;

    setGenerating(true);
    setStatus("Generating prompt…");

    const system = `
You are a prompt-engineering expert for text-to-image models (Midjourney, Leonardo, SDXL).
Return EXACTLY this format with 3 sections:

PROMPT:
<one single powerful prompt line>

NEGATIVE PROMPT:
<one line of things to avoid>

SETTINGS:
<one line of recommended settings: aspect ratio, lens/lighting, quality, stylize, seed idea, etc.>
`;

    const user = `
User idea: ${idea}
Style: ${style}

Make it vivid, specific, high quality. Include subject, environment, lighting, camera/lens, composition, materials, mood, and tiny details.
Keep the PROMPT in one line.
NEGATIVE PROMPT in one line.
SETTINGS in one line.
`;

    try {
      const reply = await engine.chat.completions.create({
        messages: [
          { role: "system", content: system.trim() },
          { role: "user", content: user.trim() },
        ],
        temperature: 0.9,
        max_tokens: 450,
      });

      const text = reply?.choices?.[0]?.message?.content || "";

      // Parse the 3 blocks
      const promptMatch = text.match(/PROMPT:\s*([\s\S]*?)\n\s*NEGATIVE PROMPT:/i);
      const negMatch = text.match(/NEGATIVE PROMPT:\s*([\s\S]*?)\n\s*SETTINGS:/i);
      const setMatch = text.match(/SETTINGS:\s*([\s\S]*)$/i);

      setResult({
        prompt: (promptMatch?.[1] || "").trim(),
        negative: (negMatch?.[1] || "").trim(),
        settings: (setMatch?.[1] || "").trim(),
      });

      setStatus("Done ✅");
    } catch (err) {
      setStatus(`Generate failed: ${err?.message || String(err)}`);
    } finally {
      setGenerating(false);
    }
  }

  function copy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setStatus("Copied ✅");
    setTimeout(() => setStatus(""), 1200);
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>AI Factory</h1>
      <p style={styles.sub}>Free Prompt Engineer (runs in your browser via WebGPU)</p>

      {!webgpuSupported && (
        <div style={styles.warn}>
          <b>WebGPU not supported on this device/browser.</b>
          <div style={{ marginTop: 6 }}>
            Gebruik Chrome/Edge op desktop. (Op veel telefoons werkt dit nog niet.)
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.row}>
          <label style={styles.label}>Model</label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            style={styles.select}
            disabled={loadingModel || generating}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadModel}
            disabled={!webgpuSupported || loadingModel || !!engine}
            style={styles.button}
          >
            {engine ? "Model Loaded" : loadingModel ? "Loading…" : "Load Model"}
          </button>
        </div>

        {(loadingModel || engine) && (
          <div style={{ marginTop: 10 }}>
            <div style={styles.progressWrap}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <div style={styles.mini}>{status}</div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <label style={styles.label}>Style preset</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={styles.select}
            disabled={loadingModel || generating}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={styles.label}>Your idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: a golden retriever puppy on a rainy Tokyo street at night with neon reflections..."
            style={styles.textarea}
            disabled={loadingModel || generating}
          />
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button
            onClick={generatePrompt}
            disabled={!engine || generating || !idea.trim()}
            style={styles.buttonPrimary}
          >
            {generating ? "Generating…" : "Generate prompt"}
          </button>

          <button
            onClick={() => setResult({ prompt: "", negative: "", settings: "" })}
            disabled={generating}
            style={styles.button}
          >
            Clear result
          </button>
        </div>

        {!!status && !loadingModel && (
          <div style={{ marginTop: 10, ...styles.mini }}>{status}</div>
        )}
      </div>

      <div style={styles.grid}>
        <div style={styles.outCard}>
          <div style={styles.outHeader}>
            <b>PROMPT</b>
            <button onClick={() => copy(result.prompt)} style={styles.copyBtn}>
              Copy
            </button>
          </div>
          <div style={styles.outText}>{result.prompt || "—"}</div>
        </div>

        <div style={styles.outCard}>
          <div style={styles.outHeader}>
            <b>NEGATIVE PROMPT</b>
            <button onClick={() => copy(result.negative)} style={styles.copyBtn}>
              Copy
            </button>
          </div>
          <div style={styles.outText}>{result.negative || "—"}</div>
        </div>

        <div style={styles.outCard}>
          <div style={styles.outHeader}>
            <b>SETTINGS</b>
            <button onClick={() => copy(result.settings)} style={styles.copyBtn}>
              Copy
            </button>
          </div>
          <div style={styles.outText}>{result.settings || "—"}</div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    padding: 40,
    background: "#0b0b0b",
    color: "white",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  title: { fontSize: 44, margin: 0 },
  sub: { marginTop: 8, opacity: 0.8 },

  warn: {
    marginTop: 16,
    padding: 14,
    background: "#2a1f00",
    border: "1px solid #6b4b00",
    borderRadius: 10,
  },

  card: {
    marginTop: 18,
    padding: 16,
    border: "1px solid #222",
    borderRadius: 14,
    background: "#111",
    maxWidth: 900,
  },
  row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  label: { display: "block", marginBottom: 6, opacity: 0.85 },
  select: { padding: 10, borderRadius: 10, background: "#0b0b0b", color: "white", border: "1px solid #333" },
  textarea: {
    width: "100%",
    minHeight: 110,
    padding: 12,
    borderRadius: 12,
    background: "#0b0b0b",
    color: "white",
    border: "1px solid #333",
    resize: "vertical",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #333",
    background: "#0b0b0b",
    color: "white",
    cursor: "pointer",
  },
  buttonPrimary: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #444",
    background: "white",
    color: "black",
    cursor: "pointer",
    fontWeight: 600,
  },
  progressWrap: {
    height: 10,
    width: "100%",
    background: "#222",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "white",
    transition: "width 200ms linear",
  },
  mini: { marginTop: 8, fontSize: 13, opacity: 0.85 },

  grid: {
    marginTop: 18,
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    maxWidth: 1100,
  },
  outCard: {
    padding: 14,
    borderRadius: 14,
    border: "1px solid #222",
    background: "#111",
  },
  outHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  outText: { whiteSpace: "pre-wrap", lineHeight: 1.4, opacity: 0.95, fontSize: 14 },
  copyBtn: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid #333",
    background: "#0b0b0b",
    color: "white",
    cursor: "pointer",
  },
};
