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

    if (data.image) {
      setImage(data.image);
    } else {
      alert("Geen afbeelding ontvangen");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1>AI Factory</h1>
      <h2>Text → Image Generator</h2>

      <input
        type="text"
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <button
        onClick={generate}
        style={{ padding: 10, marginLeft: 10 }}
        disabled={loading}
      >
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
