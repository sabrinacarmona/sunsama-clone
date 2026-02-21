"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { format, isToday, isPast, isFuture } from "date-fns";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm } from "@/components/tasks/task-form";
import { WorkloadCounter } from "@/components/tasks/workload-counter";
import type { Task } from "@/hooks/use-tasks";

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  userId: string;
}

export function DayColumn({ date, tasks, userId }: DayColumnProps) {
  const dateStr = format(date, "yyyy-MM-dd");
  const today = isToday(date);

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${dateStr}`,
    data: { type: "column", date: dateStr },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={`flex w-72 flex-shrink-0 flex-col rounded-xl border ${
        today ? "border-neutral-300 bg-neutral-50/50" : "border-neutral-200 bg-white"
      } ${isOver ? "ring-2 ring-neutral-300" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              today
                ? "bg-neutral-900 text-white"
                : isPast(date)
                  ? "text-neutral-400"
                  : "text-neutral-700"
            }`}
          >
            {format(date, "d")}
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                today
                  ? "text-neutral-900"
                  : isPast(date) && !today
                    ? "text-neutral-400"
                    : "text-neutral-700"
              }`}
            >
              {today ? "Today" : format(date, "EEEE")}
            </p>
            <p className="text-[10px] text-neutral-400">{format(date, "MMM d")}</p>
          </div>
        </div>
        <WorkloadCounter tasks={tasks} compact />
      </div>

      {/* Task list */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-1.5 overflow-auto p-2"
        style={{ minHeight: "120px" }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <p className="py-8 text-center text-xs text-neutral-300">
            {isPast(date) && !today ? "No tasks" : "Drop tasks here"}
          </p>
        )}
      </div>

      {/* Inline creation */}
      {(today || isFuture(date)) && (
        <div className="border-t p-2">
          <TaskForm
            userId={userId}
            scheduledDate={date}
            sortOrder={tasks.length}
          />
        </div>
      )}
    </div>
  );
}
