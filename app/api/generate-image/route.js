import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

// OpenJourney werkt zonder toegang en zonder blokkade
const IMAGE_MODEL_URL =
  "https://api-inference.huggingface.co/models/prompthero/openjourney";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await fetch(IMAGE_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      result: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
