"use client";

import { formatDuration } from "@/lib/time";
import { calculateWorkload } from "@/lib/workload";
import type { Task } from "@/hooks/use-tasks";

interface WorkloadCounterProps {
  tasks: Task[];
  availableMinutes?: number;
  compact?: boolean;
}

export function WorkloadCounter({
  tasks,
  availableMinutes = 480,
  compact = false,
}: WorkloadCounterProps) {
  const workload = calculateWorkload(tasks, availableMinutes);

  const barPercent = Math.min(100, workload.utilizationPercent);
  const barColor = workload.isOvercommitted
    ? "bg-red-500"
    : workload.utilizationPercent > 80
      ? "bg-amber-500"
      : "bg-emerald-500";

  if (compact) {
    return (
      <span
        className={`text-xs font-medium ${
          workload.isOvercommitted ? "text-red-600" : "text-neutral-500"
        }`}
      >
        {formatDuration(workload.totalMinutes)} / {formatDuration(availableMinutes)}
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          {formatDuration(workload.totalMinutes)} planned
        </span>
        <span
          className={
            workload.isOvercommitted ? "font-medium text-red-600" : "text-neutral-400"
          }
        >
          {formatDuration(availableMinutes)} available
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${barPercent}%` }}
        />
      </div>
      {workload.isOvercommitted && (
        <p className="text-xs font-medium text-red-600">
          Overcommitted by {formatDuration(workload.totalMinutes - availableMinutes)}
        </p>
      )}
    </div>
  );
}
