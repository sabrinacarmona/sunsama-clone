"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { parseDuration } from "@/lib/time";
import { useCreateTask } from "@/hooks/use-tasks";
import { format } from "date-fns";

interface TaskFormProps {
  userId: string;
  scheduledDate: Date;
  sortOrder: number;
  channelId?: string;
}

/**
 * Inline task creation. Supports quick-entry syntax:
 * "Review PR 30m" → title "Review PR", 30 min
 * "Team standup 15m" → title "Team standup", 15 min
 * "Write docs 1h30m" → title "Write docs", 90 min
 */
export function TaskForm({ userId, scheduledDate, sortOrder, channelId }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Try to extract duration from the end of the string
    const durationPattern = /\s+(\d+(?:\.\d+)?h(?:\d+m)?|\d+m|\d+(?:\.\d+)?h)$/i;
    const match = trimmed.match(durationPattern);

    let title = trimmed;
    let plannedMinutes: number | undefined;

    if (match) {
      title = trimmed.slice(0, match.index).trim();
      plannedMinutes = parseDuration(match[1]) ?? undefined;
    }

    createTask.mutate({
      userId,
      title,
      scheduledDate: format(scheduledDate, "yyyy-MM-dd"),
      plannedMinutes,
      sortOrder,
      channelId,
    });

    setValue("");
    // Keep form open for rapid entry
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setValue("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (!value.trim()) setIsOpen(false);
        }}
        placeholder='New task... (e.g. "Review PR 30m")'
        className="w-full border-none bg-transparent text-sm outline-none placeholder:text-neutral-400"
      />
      <p className="mt-1 text-[10px] text-neutral-400">
        Enter to add &middot; Esc to cancel &middot; Append duration (e.g. 30m, 1h)
      </p>
    </div>
  );
}
