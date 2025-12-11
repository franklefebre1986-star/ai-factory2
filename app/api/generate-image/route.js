export async function POST(req) {
  const { prompt } = await req.json();

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/sd-turbo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    }
  );

  if (!response.ok) {
    return new Response("Error generating image", { status: 500 });
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return new Response(base64, {
    headers: { "Content-Type": "text/plain" },
  });
}
