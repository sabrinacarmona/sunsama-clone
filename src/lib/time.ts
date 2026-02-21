/**
 * Parse duration strings like "30m", "1h", "1h30m", "90" (minutes) into minutes.
 */
export function parseDuration(input: string): number | null {
  if (!input || !input.trim()) return null;

  const cleaned = input.trim().toLowerCase();

  // Pure number → treat as minutes
  if (/^\d+$/.test(cleaned)) {
    return parseInt(cleaned, 10);
  }

  // Match patterns like "1h", "30m", "1h30m", "1.5h"
  const hoursMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutesMatch = cleaned.match(/(\d+)\s*m/);

  if (!hoursMatch && !minutesMatch) return null;

  let total = 0;
  if (hoursMatch) total += parseFloat(hoursMatch[1]) * 60;
  if (minutesMatch) total += parseInt(minutesMatch[1], 10);

  return Math.round(total);
}

/**
 * Format minutes into a human-readable string like "1h 30m", "45m", "2h".
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "0m";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format minutes into a compact string like "1:30", "0:45".
 */
export function formatDurationCompact(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "0:00";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}
