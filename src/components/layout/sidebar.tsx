"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Sun,
  Focus,
  Sparkles,
  Archive,
  InboxIcon,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/board", label: "Board", icon: LayoutDashboard, shortcut: null },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, shortcut: null },
  { href: "/today", label: "Today", icon: Sun, shortcut: null },
  { href: "/focus", label: "Focus", icon: Focus, shortcut: null },
];

const ritualItems = [
  {
    href: "/rituals/daily-planning",
    label: "Daily Planning",
    shortcut: "P",
  },
  { href: "/rituals/daily-shutdown", label: "Daily Shutdown", shortcut: null },
  { href: "/rituals/weekly-planning", label: "Weekly Planning", shortcut: null },
  { href: "/rituals/weekly-review", label: "Weekly Review", shortcut: null },
];

const systemItems = [
  { href: "/backlog", label: "Backlog", icon: InboxIcon, shortcut: null },
  { href: "/archive", label: "Archive", icon: Archive, shortcut: null },
  { href: "/insights", label: "Insights", icon: BarChart3, shortcut: null },
  { href: "/settings", label: "Settings", icon: Settings, shortcut: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-200",
        sidebarCollapsed ? "w-[52px]" : "w-[220px]"
      )}
    >
      {/* Logo / Header */}
      <div className="flex h-14 items-center justify-between px-3">
        {!sidebarCollapsed && (
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Tempo
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon className="h-4 w-4 shrink-0" />}
              active={pathname === item.href}
              collapsed={sidebarCollapsed}
              shortcut={item.shortcut}
            />
          ))}
        </div>

        {/* Rituals Section */}
        <div className="mt-4">
          {!sidebarCollapsed && (
            <span className="mb-1 block px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Rituals
            </span>
          )}
          <div className="space-y-0.5">
            {ritualItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={<Sparkles className="h-4 w-4 shrink-0" />}
                active={pathname === item.href}
                collapsed={sidebarCollapsed}
                shortcut={item.shortcut}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* System Section */}
        <div className="space-y-0.5">
          {systemItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon className="h-4 w-4 shrink-0" />}
              active={pathname === item.href}
              collapsed={sidebarCollapsed}
              shortcut={item.shortcut}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  collapsed,
  shortcut,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  shortcut: string | null;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      {icon}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {shortcut && (
            <kbd className="ml-auto hidden text-[10px] text-muted-foreground/70 lg:inline">
              {shortcut}
            </kbd>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {shortcut && (
            <kbd className="text-[10px] text-muted-foreground">{shortcut}</kbd>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
