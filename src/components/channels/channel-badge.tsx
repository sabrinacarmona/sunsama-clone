"use client";

interface ChannelBadgeProps {
  name: string;
  colour: string;
  size?: "sm" | "md";
}

export function ChannelBadge({ name, colour, size = "sm" }: ChannelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
      style={{ backgroundColor: `${colour}18`, color: colour }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: colour }}
      />
      {name}
    </span>
  );
}
