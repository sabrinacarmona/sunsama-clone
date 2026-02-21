import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks?from=2026-02-16&to=2026-02-22&userId=...
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const where: Record<string, unknown> = { userId };

  if (from && to) {
    where.scheduledDate = {
      gte: new Date(from),
      lte: new Date(to),
    };
  }

  if (status) {
    where.status = status;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      channel: true,
      subtasks: { orderBy: { sortOrder: "asc" } },
      objective: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const body = await request.json();

  const task = await prisma.task.create({
    data: {
      userId: body.userId,
      title: body.title,
      notes: body.notes,
      channelId: body.channelId,
      objectiveId: body.objectiveId,
      plannedMinutes: body.plannedMinutes,
      status: body.status ?? "PLANNED",
      scheduledDate: new Date(body.scheduledDate),
      sortOrder: body.sortOrder ?? 0,
      sourceType: body.sourceType ?? "NATIVE",
      sourceLink: body.sourceLink,
    },
    include: {
      channel: true,
      subtasks: true,
      objective: true,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
