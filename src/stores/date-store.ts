"use client";

import { create } from "zustand";
import { addDays, startOfDay, startOfWeek, endOfWeek } from "date-fns";

interface DateState {
  selectedDate: Date;
  visibleRangeStart: Date;
  visibleRangeEnd: Date;

  setSelectedDate: (date: Date) => void;
  goToToday: () => void;
  goForward: (days?: number) => void;
  goBackward: (days?: number) => void;
}

function getWeekRange(date: Date) {
  return {
    visibleRangeStart: startOfWeek(date, { weekStartsOn: 1 }),
    visibleRangeEnd: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

const today = startOfDay(new Date());
const initialRange = getWeekRange(today);

export const useDateStore = create<DateState>((set) => ({
  selectedDate: today,
  ...initialRange,

  setSelectedDate: (date) =>
    set({
      selectedDate: startOfDay(date),
      ...getWeekRange(date),
    }),

  goToToday: () => {
    const now = startOfDay(new Date());
    set({
      selectedDate: now,
      ...getWeekRange(now),
    });
  },

  goForward: (days = 1) =>
    set((state) => {
      const next = addDays(state.selectedDate, days);
      return {
        selectedDate: next,
        ...getWeekRange(next),
      };
    }),

  goBackward: (days = 1) =>
    set((state) => {
      const prev = addDays(state.selectedDate, -days);
      return {
        selectedDate: prev,
        ...getWeekRange(prev),
      };
    }),
}));
