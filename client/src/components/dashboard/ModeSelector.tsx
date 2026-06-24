import React from "react";
import { Clock, CalendarDays, CalendarRange, Infinity } from "lucide-react";

interface ModeSelectorProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const modes = [
  { id: "daily", label: "Daily", icon: Clock },
  { id: "weekly", label: "Weekly", icon: CalendarDays },
  { id: "monthly", label: "Monthly", icon: CalendarRange },
  { id: "all", label: "All Time", icon: Infinity },
];

export default function ModeSelector({ activeMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold">
        VIEW MODE
      </span>
      <div className="inline-flex items-center gap-1 p-1 bg-[#0c0516] border border-[#1e293b] rounded-xl">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30"
                  : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1e293b]/30 border border-transparent"
              }`}
            >
              <Icon className="w-3 h-3" />
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
