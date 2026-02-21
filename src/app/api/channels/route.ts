import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/channels?userId=...
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const channels = await prisma.channel.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(channels);
}
