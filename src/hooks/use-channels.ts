"use client";

import { useQuery } from "@tanstack/react-query";
import type { TaskChannel } from "./use-tasks";

export function useChannels(userId: string | undefined) {
  return useQuery<TaskChannel[]>({
    queryKey: ["channels", userId],
    queryFn: async () => {
      const res = await fetch(`/api/channels?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch channels");
      return res.json();
    },
    enabled: !!userId,
  });
}
