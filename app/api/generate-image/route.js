import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { prompt } = await req.json();

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  return new Response(
    JSON.stringify({
      image: result.data[0].b64_json,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
