import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { vatNumber, countryCode } = await req.json();

    if (!vatNumber || !countryCode) {
      return NextResponse.json({ valid: false, error: "vatNumber and countryCode are required" }, { status: 400 });
    }

    // TODO: Call VIES API — wrap in try/catch, never block on failure
    // const result = await validateVIES(countryCode, vatNumber.replace(countryCode, ""));

    // Stub response
    return NextResponse.json({ valid: true, name: null, address: null, stub: true });
  } catch {
    // VIES failure is non-blocking
    return NextResponse.json({ valid: false, error: "VIES check failed — treat as unverified" });
  }
}
