import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      channel: true,
      subtasks: { orderBy: { sortOrder: "asc" } },
      objective: true,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PATCH /api/tasks/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.channelId !== undefined) data.channelId = body.channelId;
  if (body.objectiveId !== undefined) data.objectiveId = body.objectiveId;
  if (body.plannedMinutes !== undefined) data.plannedMinutes = body.plannedMinutes;
  if (body.actualMinutes !== undefined) data.actualMinutes = body.actualMinutes;
  if (body.status !== undefined) data.status = body.status;
  if (body.scheduledDate !== undefined) data.scheduledDate = new Date(body.scheduledDate);
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;

  const task = await prisma.task.update({
    where: { id },
    data,
    include: {
      channel: true,
      subtasks: { orderBy: { sortOrder: "asc" } },
      objective: true,
    },
  });

  return NextResponse.json(task);
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
