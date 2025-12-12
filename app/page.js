"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setImage("");

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    // 🔴 HIER GING HET AL DIE TIJD MIS
    setImage(data.image); // ← ALLEEN base64
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>AI Factory</h1>
      <h2>Text → Image Generator</h2>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        style={{ padding: 10, width: 300 }}
      />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <div style={{ marginTop: 20 }}>
          <img
            src={`data:image/png;base64,${image}`}
            alt="Generated"
            style={{ maxWidth: 400 }}
          />
        </div>
      )}
    </main>
  );
}
