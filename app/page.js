"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const endpoint =
      mode === "image"
        ? "/api/generate-image"
        : "/api/generate-video";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Error generating.");
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 40, background: "#111", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>AI Website Demo</h1>

      <button onClick={() => setMode("image")}>🖼 Image</button>
      <button onClick={() => setMode("video")} style={{ marginLeft: 10 }}>🎬 Video</button>

      <textarea
        rows="3"
        style={{ width: "100%", marginTop: 20 }}
        placeholder="Describe your image or video"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        style={{ marginTop: 20 }}
        onClick={generate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          {mode === "image" ? (
            <img src={result} style={{ width: "100%", borderRadius: 8 }} />
          ) : (
            <video src={result} controls style={{ width: "100%", borderRadius: 8 }} />
          )}
        </div>
      )}
    </main>
  );
}
