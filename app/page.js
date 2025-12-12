"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setImage("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      setError("Image generation failed");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        style={{ padding: 10, marginLeft: 10, cursor: "pointer" }}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {image && (
        <div style={{ marginTop: 20 }}>
          <img
            src={image}
            alt="Generated"
            style={{ maxWidth: 400, border: "1px solid #444" }}
          />
        </div>
      )}
    </main>
  );
}
