export const runtime = "nodejs";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x512",
    });

    return new Response(result.data[0].b64_json, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Image generation failed", { status: 500 });
  }
}
