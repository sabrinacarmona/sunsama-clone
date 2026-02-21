"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Clock, AlertTriangle } from "lucide-react";
import { ChannelBadge } from "@/components/channels/channel-badge";
import { formatDuration } from "@/lib/time";
import type { Task } from "@/hooks/use-tasks";
import { useUpdateTask } from "@/hooks/use-tasks";
import { useUIStore } from "@/stores/ui-store";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const { openRightPanel, setSelectedTaskId } = useUIStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCompleted = task.status === "COMPLETED";

  const toggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask.mutate({
      id: task.id,
      status: isCompleted ? "PLANNED" : "COMPLETED",
    });
  };

  const openDetail = () => {
    setSelectedTaskId(task.id);
    openRightPanel("task-detail");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-2 rounded-lg border bg-white p-2.5 transition-shadow hover:shadow-sm ${
        isDragging ? "z-50 shadow-lg opacity-90" : ""
      } ${isCompleted ? "opacity-60" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 cursor-grab opacity-0 group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-neutral-400" />
      </button>

      {/* Checkbox */}
      <button
        onClick={toggleComplete}
        className={`mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        {isCompleted && <Check className="h-3 w-3 text-white" />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1 cursor-pointer" onClick={openDetail}>
        <p
          className={`text-sm leading-snug ${
            isCompleted ? "line-through text-neutral-400" : "text-neutral-900"
          }`}
        >
          {task.title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          {task.channel && (
            <ChannelBadge name={task.channel.name} colour={task.channel.colour} />
          )}
          {task.plannedMinutes && (
            <span className="flex items-center gap-0.5 text-xs text-neutral-400">
              <Clock className="h-3 w-3" />
              {formatDuration(task.plannedMinutes)}
            </span>
          )}
          {task.rolloverCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500" title={`Rolled over ${task.rolloverCount} time(s)`}>
              <AlertTriangle className="h-3 w-3" />
              {task.rolloverCount}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="text-xs text-neutral-400">
              {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
