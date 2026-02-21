"use client";

import type { TaskChannel } from "@/hooks/use-tasks";

interface ChannelPickerProps {
  channels: TaskChannel[];
  value: string | null;
  onChange: (channelId: string | null) => void;
}

export function ChannelPicker({ channels, value, onChange }: ChannelPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
          value === null
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
        }`}
      >
        None
      </button>
      {channels.map((ch) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => onChange(ch.id)}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: value === ch.id ? `${ch.colour}24` : undefined,
            color: value === ch.id ? ch.colour : undefined,
            border: `1px solid ${value === ch.id ? ch.colour : "transparent"}`,
          }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: ch.colour }}
          />
          {ch.name}
        </button>
      ))}
    </div>
  );
}
