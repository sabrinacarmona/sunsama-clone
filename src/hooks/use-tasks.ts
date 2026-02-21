"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export interface TaskChannel {
  id: string;
  name: string;
  colour: string;
  type: string;
}

export interface TaskSubtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  channelId: string | null;
  channel: TaskChannel | null;
  objectiveId: string | null;
  plannedMinutes: number | null;
  actualMinutes: number | null;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED" | "ARCHIVED";
  scheduledDate: string;
  sortOrder: number;
  sourceType: string;
  sourceLink: string | null;
  rolloverCount: number;
  subtasks: TaskSubtask[];
  createdAt: string;
  updatedAt: string;
}

function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Fetch tasks for a date range
export function useTasks(userId: string | undefined, from: Date, to: Date) {
  return useQuery<Task[]>({
    queryKey: ["tasks", userId, dateKey(from), dateKey(to)],
    queryFn: async () => {
      const params = new URLSearchParams({
        userId: userId!,
        from: dateKey(from),
        to: dateKey(to),
      });
      const res = await fetch(`/api/tasks?${params}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: !!userId,
  });
}

// Create a new task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      title: string;
      scheduledDate: string;
      channelId?: string;
      plannedMinutes?: number;
      sortOrder?: number;
      notes?: string;
    }) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Update a task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      notes?: string;
      channelId?: string | null;
      objectiveId?: string | null;
      plannedMinutes?: number | null;
      actualMinutes?: number | null;
      status?: Task["status"];
      scheduledDate?: string;
      sortOrder?: number;
    }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Reorder tasks (batch update sortOrder and optionally scheduledDate)
export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: { id: string; sortOrder: number; scheduledDate?: string }[]
    ) => {
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/tasks/${u.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sortOrder: u.sortOrder,
              ...(u.scheduledDate ? { scheduledDate: u.scheduledDate } : {}),
            }),
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
