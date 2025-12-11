import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    const image_base64 = result.data[0].b64_json;

    return new Response(
      JSON.stringify({ image: image_base64 }),
      { status: 200 }
    );

  } catch (error) {
    console.error("API ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
