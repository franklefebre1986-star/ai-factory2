import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

// Open video model - werkt zonder toestemming
const VIDEO_MODEL_URL =
  "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await fetch(VIDEO_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate video" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      result: `data:video/mp4;base64,${base64}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
