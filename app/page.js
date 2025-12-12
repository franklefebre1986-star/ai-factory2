"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt) return;

    setLoading(true);
    setImage("");

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json(); // 🔥 HIER ZAT DE FOUT

    setImage(`data:image/png;base64,${data.image}`); // 🔥 ALLEEN image

    setLoading(false);
  }

  return (
    <main style={{ padding: "40px", color: "white" }}>
      <h1>AI Factory</h1>
      <h2>Text → Image Generator</h2>

      <input
        type="text"
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: 10, width: "300px" }}
      />

      <button
        onClick={generate}
        style={{ padding: 10, marginLeft: 10, cursor: "pointer" }}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <div style={{ marginTop: 20 }}>
          <img
            src={image}
            alt="Generated"
            style={{ maxWidth: "400px", border: "1px solid #444" }}
          />
        </div>
      )}
    </main>
  );
}
