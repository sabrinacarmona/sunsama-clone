import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/user — returns the demo user (until auth is implemented)
export async function GET() {
  const user = await prisma.user.findFirst({
    include: { settings: true },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
