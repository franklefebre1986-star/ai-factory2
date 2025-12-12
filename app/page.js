'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  // Timer
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  async function generateImage() {
    setLoading(true);
    setError(null);
    setImage(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 sec

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setImage(data.image);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('⏱ Image generation took too long (30s). Try again.');
      } else {
        setError(err.message);
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>AI Factory</h1>
      <h2 style={styles.subtitle}>Text → Image Generator</h2>

      <div style={styles.inputRow}>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your image..."
          style={styles.input}
        />
        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          style={styles.button}
        >
          {loading ? 'Generating…' : 'Generate Image'}
        </button>
      </div>

      {/* Progress */}
      {loading && (
        <div style={styles.progressBox}>
          <div style={styles.spinner} />
          <p>Generating… {seconds}s</p>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min(seconds * 3, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Image Gallery */}
      {image && (
        <div style={styles.gallery}>
          <img src={image} alt="Generated" style={styles.image} />
          <a href={image} download="ai-image.png" style={styles.download}>
            ⬇ Download image
          </a>
        </div>
      )}
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#0b0b0b',
    color: 'white',
    padding: '60px',
    fontFamily: 'Arial',
  },
  title: { fontSize: '42px' },
  subtitle: { marginBottom: '30px' },
  inputRow: { display: 'flex', gap: '10px' },
  input: {
    padding: '12px',
    fontSize: '16px',
    width: '300px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  progressBox: { marginTop: '30px' },
  spinner: {
    width: '30px',
    height: '30px',
    border: '4px solid #444',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  progressBar: {
    height: '8px',
    background: '#333',
    marginTop: '10px',
    width: '300px',
  },
  progressFill: {
    height: '100%',
    background: 'white',
    transition: 'width 1s linear',
  },
  gallery: {
    marginTop: '40px',
  },
  image: {
    maxWidth: '400px',
    borderRadius: '8px',
    display: 'block',
  },
  download: {
    display: 'inline-block',
    marginTop: '10px',
    color: 'white',
  },
  error: { color: 'red', marginTop: '20px' },
};
