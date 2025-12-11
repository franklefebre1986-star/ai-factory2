import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // ⭐ Nieuwe correcte manier voor image generatie
    const response = await openai.images.generate({
      model: "gpt-image-1",       // blijft goed
      prompt: prompt,
      size: "1024x1024",
      response_format: "b64_json" // ⭐ BELANGRIJK! (anders krijg je "Model error")
    });

    const image_base64 = response.data[0].b64_json;

    return new Response(JSON.stringify({ image: image_base64 }), {
      status: 200,
    });

  } catch (error) {
    console.error("IMAGE API ERROR:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
