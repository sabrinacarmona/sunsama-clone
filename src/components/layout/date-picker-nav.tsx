"use client";

import { format, addDays, isSameDay, isToday, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/stores/date-store";
import { Button } from "@/components/ui/button";

export function DatePickerNav() {
  const { selectedDate, setSelectedDate, goToToday, goForward, goBackward } =
    useDateStore();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={goToToday}
      >
        Today
      </Button>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => goBackward(7)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => goForward(7)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <span className="text-sm font-medium text-foreground">
        {format(selectedDate, "MMMM yyyy")}
      </span>

      <div className="ml-4 flex items-center gap-0.5">
        {weekDays.map((day) => {
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center rounded-lg px-2.5 py-1 text-xs transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                !selected && today && "text-primary font-semibold"
              )}
            >
              <span className="text-[10px] uppercase leading-none">
                {format(day, "EEE")}
              </span>
              <span className="mt-0.5 text-sm font-medium leading-none">
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
