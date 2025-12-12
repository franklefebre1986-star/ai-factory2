import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "512x512",
    });

    const imageBase64 = result.data[0].b64_json;

    return new Response(imageBase64, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Image generation failed", { status: 500 });
  }
}
