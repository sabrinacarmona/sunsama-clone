/**
 * Calculate workload summary for a set of tasks.
 */
export function calculateWorkload(
  tasks: { plannedMinutes: number | null; status: string }[],
  availableMinutes: number = 480 // 8 hours default
) {
  const activeTasks = tasks.filter(
    (t) => t.status !== "ARCHIVED" && t.status !== "COMPLETED"
  );
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const plannedMinutes = activeTasks.reduce(
    (sum, t) => sum + (t.plannedMinutes ?? 0),
    0
  );
  const completedMinutes = completedTasks.reduce(
    (sum, t) => sum + (t.plannedMinutes ?? 0),
    0
  );

  const totalMinutes = plannedMinutes + completedMinutes;
  const isOvercommitted = totalMinutes > availableMinutes;
  const utilizationPercent = Math.round((totalMinutes / availableMinutes) * 100);

  return {
    plannedMinutes,
    completedMinutes,
    totalMinutes,
    availableMinutes,
    isOvercommitted,
    utilizationPercent,
    remainingMinutes: Math.max(0, availableMinutes - totalMinutes),
  };
}
