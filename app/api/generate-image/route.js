export const runtime = "nodejs";

import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return new Response(
      JSON.stringify({
        image: result.data[0].b64_json,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("IMAGE API ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Image generation failed" }),
      { status: 500 }
    );
  }
}
