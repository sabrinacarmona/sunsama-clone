"use client";

import { useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { format, eachDayOfInterval } from "date-fns";
import { useState } from "react";
import { DayColumn } from "./day-column";
import { TaskCard } from "@/components/tasks/task-card";
import { useTasks, useReorderTasks, type Task } from "@/hooks/use-tasks";
import { useUser } from "@/hooks/use-user";
import { useDateStore } from "@/stores/date-store";

export function BoardView() {
  const { data: user } = useUser();
  const { visibleRangeStart, visibleRangeEnd } = useDateStore();
  const userId = user?.id;

  const days = useMemo(
    () => eachDayOfInterval({ start: visibleRangeStart, end: visibleRangeEnd }),
    [visibleRangeStart, visibleRangeEnd]
  );

  const { data: tasks = [] } = useTasks(userId, visibleRangeStart, visibleRangeEnd);
  const reorderTasks = useReorderTasks();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const day of days) {
      map[format(day, "yyyy-MM-dd")] = [];
    }
    for (const task of tasks) {
      const key = task.scheduledDate.slice(0, 10);
      if (map[key]) {
        map[key].push(task);
      }
    }
    // Sort each group
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [tasks, days]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeTask = active.data.current?.task as Task | undefined;
      if (!activeTask) return;

      // Determine target column
      let targetDate: string;
      let targetTasks: Task[];

      if (over.data.current?.type === "column") {
        targetDate = over.data.current.date as string;
        targetTasks = tasksByDate[targetDate] ?? [];
      } else {
        // Dropped on another task — find which column that task belongs to
        const overTask = over.data.current?.task as Task | undefined;
        if (!overTask) return;
        targetDate = overTask.scheduledDate.slice(0, 10);
        targetTasks = tasksByDate[targetDate] ?? [];
      }

      const sourceDate = activeTask.scheduledDate.slice(0, 10);
      const sourceTasks = tasksByDate[sourceDate] ?? [];

      // Same column reorder
      if (sourceDate === targetDate) {
        const oldIndex = sourceTasks.findIndex((t) => t.id === active.id);
        const newIndex = over.data.current?.type === "column"
          ? sourceTasks.length
          : sourceTasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(sourceTasks, oldIndex, newIndex);
        const updates = reordered.map((t, i) => ({
          id: t.id,
          sortOrder: i,
        }));
        reorderTasks.mutate(updates);
      } else {
        // Cross-column move
        const newSortOrder = over.data.current?.type === "column"
          ? targetTasks.length
          : targetTasks.findIndex((t) => t.id === over.id);

        // Update moved task
        const updates = [
          {
            id: activeTask.id,
            sortOrder: Math.max(0, newSortOrder),
            scheduledDate: targetDate,
          },
        ];

        // Reorder remaining tasks in source column
        const remainingSource = sourceTasks.filter((t) => t.id !== activeTask.id);
        remainingSource.forEach((t, i) => {
          updates.push({ id: t.id, sortOrder: i });
        });

        // Reorder tasks in target column
        const newTargetTasks = [...targetTasks];
        newTargetTasks.splice(Math.max(0, newSortOrder), 0, activeTask);
        newTargetTasks.forEach((t, i) => {
          if (t.id !== activeTask.id) {
            updates.push({ id: t.id, sortOrder: i });
          }
        });

        reorderTasks.mutate(updates);
      }
    },
    [tasksByDate, reorderTasks]
  );

  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-3 overflow-x-auto p-4">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          return (
            <DayColumn
              key={key}
              date={day}
              tasks={tasksByDate[key] ?? []}
              userId={userId}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 rotate-2 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
