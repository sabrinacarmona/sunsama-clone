"use client";

import { useUIStore } from "@/stores/ui-store";
import { useUser } from "@/hooks/use-user";
import { TaskDetail } from "@/components/tasks/task-detail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RightPanel() {
  const { rightPanelOpen, rightPanelContent, selectedTaskId, closeRightPanel } =
    useUIStore();
  const { data: user } = useUser();

  if (!rightPanelOpen || !rightPanelContent) return null;

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      {rightPanelContent === "task-detail" && selectedTaskId && user ? (
        <TaskDetail taskId={selectedTaskId} userId={user.id} />
      ) : (
        <>
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-medium">
              {rightPanelContent === "integrations"
                ? "Integrations"
                : rightPanelContent === "objectives"
                  ? "Objectives"
                  : "Panel"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={closeRightPanel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </ScrollArea>
        </>
      )}
    </aside>
  );
}
