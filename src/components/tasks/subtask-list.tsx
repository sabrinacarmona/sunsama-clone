"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskSubtask } from "@/hooks/use-tasks";

interface SubtaskListProps {
  taskId: string;
  subtasks: TaskSubtask[];
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const toggleSubtask = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const res = await fetch("/api/subtasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isCompleted }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addSubtask = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, title, sortOrder: subtasks.length }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTitle("");
    },
  });

  const deleteSubtask = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/subtasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleAdd = () => {
    if (newTitle.trim()) {
      addSubtask.mutate(newTitle.trim());
    }
  };

  return (
    <div className="space-y-1">
      {subtasks.map((st) => (
        <div key={st.id} className="group flex items-center gap-2 rounded py-0.5 px-1 hover:bg-neutral-50">
          <button
            onClick={() => toggleSubtask.mutate({ id: st.id, isCompleted: !st.isCompleted })}
            className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
              st.isCompleted
                ? "border-emerald-500 bg-emerald-500"
                : "border-neutral-300 hover:border-neutral-400"
            }`}
          >
            {st.isCompleted && <Check className="h-2.5 w-2.5 text-white" />}
          </button>
          <span
            className={`flex-1 text-sm ${
              st.isCompleted ? "line-through text-neutral-400" : "text-neutral-700"
            }`}
          >
            {st.title}
          </span>
          <button
            onClick={() => deleteSubtask.mutate(st.id)}
            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2 px-1">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewTitle("");
              }
            }}
            onBlur={() => {
              if (!newTitle.trim()) setIsAdding(false);
            }}
            placeholder="Subtask title..."
            className="flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-1 text-xs text-neutral-400 hover:text-neutral-600"
        >
          <Plus className="h-3 w-3" />
          Add subtask
        </button>
      )}
    </div>
  );
}
