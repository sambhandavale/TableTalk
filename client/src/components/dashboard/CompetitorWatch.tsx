import React from "react";
import { Crosshair, Map, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

export default function CompetitorWatch({ competitors = [] }: any) {
  return (
    <div className="space-y-6 w-full max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#f43f5e]" />
            Local Competitor Watch
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Automated intelligence pulled from Google Maps for nearby similar cuisines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-[#1e293b] text-[9px] uppercase tracking-widest text-[#64748b] font-bold">
          <div className="col-span-3">Competitor</div>
          <div className="col-span-2">Avg Rating vs You</div>
          <div className="col-span-2">Review Volume Trend</div>
          <div className="col-span-5">Strategic AI Insight</div>
        </div>

        {/* Competitor Rows */}
        {competitors.length > 0 ? competitors.map((comp: any, idx: number) => (
          <div key={idx} className="bg-[#0c0516] border border-[#1e293b] p-4 md:px-4 md:py-5 rounded-none flex flex-col md:grid md:grid-cols-12 gap-4 items-center hover:bg-[#1e293b]/10 transition-colors">
            
            {/* Name & Distance */}
            <div className="col-span-3 w-full flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1e293b]/30 border border-[#1e293b] flex items-center justify-center rounded-none flex-shrink-0">
                <Map className="w-4 h-4 text-[#64748b]" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">{comp.name || "Unknown"}</span>
                <span className="text-[10px] text-[#64748b]">{comp.distance || "N/A"} away</span>
              </div>
            </div>

            {/* Rating Comparison */}
            <div className="col-span-2 w-full flex flex-col">
              <span className="md:hidden text-[9px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Rating</span>
              <div className="flex items-end gap-2">
                <span className="text-lg font-semibold text-white leading-none">{comp.rating?.toFixed(1) || "N/A"}</span>
                <span className={`text-[10px] font-bold ${(comp.ratingDiff || "").startsWith('+') ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
                  {comp.ratingDiff || ""}
                </span>
              </div>
            </div>

            {/* Volume Trend */}
            <div className="col-span-2 w-full flex flex-col">
              <span className="md:hidden text-[9px] uppercase tracking-widest text-[#64748b] font-bold mb-1">Volume Trend</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-semibold ${comp.volumeDir === 'up' ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
                  {comp.volumeTrend || "N/A"}
                </span>
                {comp.volumeDir === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 text-[#f43f5e]" /> : comp.volumeDir === 'down' ? <ArrowDownRight className="w-3.5 h-3.5 text-[#10b981]" /> : null}
              </div>
            </div>

            {/* AI Insight */}
            <div className="col-span-5 w-full">
              <div className="bg-[#1e293b]/20 border border-[#1e293b] p-3 flex gap-2 rounded-none">
                <Zap className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#cbd5e1] leading-snug">
                  <span className="font-semibold text-white">Focus:</span> {comp.insight || "Collecting data..."}
                </p>
              </div>
            </div>

          </div>
        )) : (
          <div className="p-8 text-center border border-[#1e293b] bg-[#0c0516]">
            <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">No competitors tracked yet. Add competitors in your settings to compare metrics.</span>
          </div>
        )}
      </div>
    </div>
  );
}
