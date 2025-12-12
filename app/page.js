"use client";

import { useState } from "react";

const STYLES = {
  cinematic:
    "ultra-detailed cinematic photo, dramatic lighting, shallow depth of field, professional photography, masterpiece quality, 8K",
  anime:
    "anime style illustration, vibrant colors, sharp line art, studio ghibli inspired, highly detailed",
  realistic:
    "ultra realistic photo, natural lighting, high resolution, DSLR, sharp focus",
  logo:
    "clean modern logo design, vector style, minimal, flat design, white background",
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    if (!idea.trim()) return;

    setLoading(true);
    setCopied(false);

    setTimeout(() => {
      const result = `Ultra-detailed image of ${idea}, ${STYLES[style]}.`;
      setPrompt(result);
      setLoading(false);
    }, 900);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <main style={{ padding: "60px", maxWidth: "900px" }}>
      <h1>AI Factory</h1>
      <h2>Text → Image Prompt Generator</h2>

      {/* Input */}
      <input
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your idea..."
        style={{ width: "100%", padding: "12px", fontSize: "16px" }}
      />

      {/* Styles */}
      <div style={{ marginTop: "15px" }}>
        {Object.keys(STYLES).map((key) => (
          <button
            key={key}
            onClick={() => setStyle(key)}
            style={{
              marginRight: "8px",
              padding: "8px 14px",
              background: style === key ? "#fff" : "#333",
              color: style === key ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Generate */}
      <button
        onClick={generatePrompt}
        disabled={loading}
        style={{ marginTop: "20px", padding: "12px 24px" }}
      >
        {loading ? "Thinking..." : "Generate Prompt"}
      </button>

      {/* Result */}
      {prompt && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Prompt</h3>
          <textarea
            value={prompt}
            readOnly
            rows={5}
            style={{ width: "100%", padding: "12px" }}
          />
          <button
            onClick={copyPrompt}
            style={{ marginTop: "10px", padding: "10px 20px" }}
          >
            {copied ? "Copied ✅" : "Copy Prompt"}
          </button>
        </div>
      )}
    </main>
  );
}
