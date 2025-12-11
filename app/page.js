"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");

  async function generate() {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const data = await res.text();
    setImage(`data:image/png;base64,${data}`);
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
        Generate Image
      </button>

      {image && (
        <div style={{ marginTop: 20 }}>
          <img src={image} alt="Generated" style={{ maxWidth: "400px" }} />
        </div>
      )}
    </main>
  );
}
