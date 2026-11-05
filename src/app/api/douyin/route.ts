import { NextResponse } from "next/server";
import { getDouyinStats } from "@/shared/lib/douyin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const payload = await getDouyinStats();
  return NextResponse.json(payload, {
    // Cache in the service, so a CDN cannot prolong an old live status.
    headers: { "Cache-Control": "no-store" },
  });
}
