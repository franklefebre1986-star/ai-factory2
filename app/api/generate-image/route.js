export async function POST(req) {
  const { prompt } = await req.json();

  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    return new Response("Model error", { status: 500 });
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return new Response(base64, {
    headers: { "Content-Type": "text/plain" }
  });
}
