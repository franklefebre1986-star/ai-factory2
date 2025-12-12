export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "512x512",
      }),
    });

    const data = await response.json();

    return new Response(data.data[0].b64_json, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Image generation failed", { status: 500 });
  }
}
