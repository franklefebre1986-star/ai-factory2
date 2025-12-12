export const runtime = "nodejs";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("No prompt provided", { status: 400 });
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const base64Image = result.data[0].b64_json;

    return new Response(
      JSON.stringify({ image: base64Image }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("IMAGE ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
