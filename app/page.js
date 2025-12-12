// PROMPT GENERATOR v1

"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePrompt = () => {
    if (!idea.trim()) return;

    setLoading(true);

    // Fake “AI thinking” — maar wél slim opgebouwd
    setTimeout(() => {
      const result = `Ultra-detailed, cinematic image of ${idea}, shot with a professional DSLR camera, shallow depth of field, dramatic lighting, ultra realistic textures, high resolution, sharp focus, masterpiece quality.`;

      setPrompt(result);
      setLoading(false);
    }, 1200);
  };

  return (
    <main style={{ padding: "60px", maxWidth: "900px" }}>
      <h1>AI Factory</h1>
      <h2>Text → Image Prompt Generator</h2>

      <input
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your idea..."
        style={{ width: "70%", padding: "10px", fontSize: "16px" }}
      />

      <button
        onClick={generatePrompt}
        disabled={loading}
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        {loading ? "Thinking..." : "Generate Prompt"}
      </button>

      {prompt && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Prompt</h3>
          <textarea
            value={prompt}
            readOnly
            rows={5}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
      )}
    </main>
  );
}
