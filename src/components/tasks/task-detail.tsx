"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useChannels } from "@/hooks/use-channels";
import { ChannelPicker } from "@/components/channels/channel-picker";
import { SubtaskList } from "@/components/tasks/subtask-list";
import { formatDuration, parseDuration } from "@/lib/time";
import { useUIStore } from "@/stores/ui-store";
import type { Task } from "@/hooks/use-tasks";

interface TaskDetailProps {
  taskId: string;
  userId: string;
}

export function TaskDetail({ taskId, userId }: TaskDetailProps) {
  const { closeRightPanel } = useUIStore();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: channels = [] } = useChannels(userId);

  const { data: task } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/${taskId}`);
      if (!res.ok) throw new Error("Failed to fetch task");
      return res.json();
    },
  });

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [durationInput, setDurationInput] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes ?? "");
      setDurationInput(task.plannedMinutes ? formatDuration(task.plannedMinutes) : "");
    }
  }, [task]);

  if (!task) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  const saveTitle = () => {
    if (title.trim() && title !== task.title) {
      updateTask.mutate({ id: task.id, title: title.trim() });
    }
  };

  const saveNotes = () => {
    if (notes !== (task.notes ?? "")) {
      updateTask.mutate({ id: task.id, notes: notes || null });
    }
  };

  const saveDuration = () => {
    const minutes = parseDuration(durationInput);
    if (minutes !== task.plannedMinutes) {
      updateTask.mutate({ id: task.id, plannedMinutes: minutes });
    }
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
    closeRightPanel();
  };

  const statusOptions: { value: Task["status"]; label: string }[] = [
    { value: "PLANNED", label: "Planned" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DEFERRED", label: "Deferred" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-medium text-neutral-500">Task Details</h3>
        <button
          onClick={closeRightPanel}
          className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && saveTitle()}
          className="w-full border-none bg-transparent text-lg font-semibold outline-none"
        />

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Status</label>
          <select
            value={task.status}
            onChange={(e) =>
              updateTask.mutate({ id: task.id, status: e.target.value as Task["status"] })
            }
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Channel */}
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Channel</label>
          <ChannelPicker
            channels={channels}
            value={task.channelId}
            onChange={(channelId) => updateTask.mutate({ id: task.id, channelId })}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-500">
            <Clock className="h-3 w-3" />
            Planned Time
          </label>
          <input
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            onBlur={saveDuration}
            onKeyDown={(e) => e.key === "Enter" && saveDuration()}
            placeholder="e.g. 30m, 1h, 1h30m"
            className="w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="Add notes..."
            rows={4}
            className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Subtasks</label>
          <SubtaskList taskId={task.id} subtasks={task.subtasks} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete task
        </button>
      </div>
    </div>
  );
}
