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

    const imageBase64 = result.data[0].b64_json;

    return Response.json({ image: imageBase64 });
  } catch (error) {
    console.error(error);
    return new Response("Image generation failed", { status: 500 });
  }
}
