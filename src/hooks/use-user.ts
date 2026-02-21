"use client";

import { useQuery } from "@tanstack/react-query";

// Until auth is implemented, fetch the first (demo) user
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });
}
