import { Sidebar } from "@/components/layout/sidebar";
import { DatePickerNav } from "@/components/layout/date-picker-nav";
import { RightPanel } from "@/components/layout/right-panel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel: Sidebar */}
      <Sidebar />

      {/* Center + Right panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DatePickerNav />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        {/* Right panel */}
        <RightPanel />
      </div>
    </div>
  );
}
