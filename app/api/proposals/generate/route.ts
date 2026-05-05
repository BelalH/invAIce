import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // TODO: Replace with real Anthropic call
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    // const extraction = await anthropic.messages.create({ ... });

    return NextResponse.json(
      { error: "AI generation not configured — set ANTHROPIC_API_KEY and implement this route" },
      { status: 501 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
