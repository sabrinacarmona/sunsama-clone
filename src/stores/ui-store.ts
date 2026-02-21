"use client";

import { create } from "zustand";

export type RightPanelContent =
  | "task-detail"
  | "integrations"
  | "objectives"
  | "search"
  | null;

export type ViewMode = "board" | "calendar" | "today" | "focus";

interface UIState {
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  rightPanelContent: RightPanelContent;
  selectedTaskId: string | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openRightPanel: (content: RightPanelContent) => void;
  closeRightPanel: () => void;
  setSelectedTaskId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  rightPanelOpen: false,
  rightPanelContent: null,
  selectedTaskId: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  openRightPanel: (content) =>
    set({ rightPanelOpen: true, rightPanelContent: content }),

  closeRightPanel: () =>
    set({ rightPanelOpen: false, rightPanelContent: null, selectedTaskId: null }),

  setSelectedTaskId: (id) =>
    set({
      selectedTaskId: id,
      rightPanelOpen: id !== null,
      rightPanelContent: id !== null ? "task-detail" : null,
    }),
}));
