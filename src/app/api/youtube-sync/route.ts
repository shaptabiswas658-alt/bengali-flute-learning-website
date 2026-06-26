import { NextResponse } from "next/server";
import { syncYouTubeSongsFromChannels } from "@/lib/youtube-collector";

export async function POST() {
  try {
    const result = await syncYouTubeSongsFromChannels();
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "YouTube sync ব্যর্থ হয়েছে।",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
