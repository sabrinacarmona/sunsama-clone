import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// POST /api/subtasks
export async function POST(request: NextRequest) {
  const body = await request.json();

  const subtask = await prisma.subtask.create({
    data: {
      taskId: body.taskId,
      title: body.title,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json(subtask, { status: 201 });
}

// PATCH /api/subtasks (bulk update — toggle completion, reorder)
export async function PATCH(request: NextRequest) {
  const body = await request.json();

  if (body.id && body.isCompleted !== undefined) {
    const subtask = await prisma.subtask.update({
      where: { id: body.id },
      data: { isCompleted: body.isCompleted },
    });
    return NextResponse.json(subtask);
  }

  if (body.id && body.title !== undefined) {
    const subtask = await prisma.subtask.update({
      where: { id: body.id },
      data: { title: body.title },
    });
    return NextResponse.json(subtask);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// DELETE /api/subtasks?id=...
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await prisma.subtask.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
