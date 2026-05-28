import React from "react";
import { Lightbulb, AlertOctagon, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

export default function Recommendations({ insights }: any) {
  
  // Create an array of recommendations from insights or show empty state
  const actionItems = insights?.action_items || [];
  
  let recommendations: any[] = [];
  
  if (actionItems.length > 0) {
    recommendations = actionItems.map((item: string, idx: number) => {
      // Very basic pseudo-logic to give icons/colors based on the text
      const isCritical = item.toLowerCase().includes("urgent") || item.toLowerCase().includes("critical");
      const isGrowth = item.toLowerCase().includes("highlight") || item.toLowerCase().includes("feature");
      
      return {
        type: isCritical ? "CRITICAL" : isGrowth ? "GROWTH" : "HIGH",
        icon: isCritical ? AlertOctagon : isGrowth ? TrendingUp : AlertTriangle,
        title: item,
        context: "Identified by AI Audit",
        quote: null,
        action: "Review",
        color: isCritical ? "text-[#f43f5e]" : isGrowth ? "text-[#10b981]" : "text-[#f59e0b]",
        bg: isCritical ? "bg-[#f43f5e]/10" : isGrowth ? "bg-[#10b981]/10" : "bg-[#f59e0b]/10",
        border: isCritical ? "border-[#f43f5e]/30" : isGrowth ? "border-[#10b981]/30" : "border-[#f59e0b]/30"
      }
    });
  }

  return (
    <div className="space-y-4 w-full max-w-[1000px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
            Actionable Recommendations
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Prioritized operational and marketing steps based on recent review data.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {recommendations.length > 0 ? recommendations.map((rec, idx) => (
          <div key={idx} className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 rounded-none transition-colors hover:bg-[#1e293b]/10">
            <div className="flex gap-4 items-start">
              <div className={`p-2 rounded-none ${rec.bg} ${rec.border} border flex-shrink-0`}>
                <rec.icon className={`w-5 h-5 ${rec.color}`} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${rec.color}`}>
                    {rec.type}
                  </span>
                  <span className="text-sm font-semibold text-white">{rec.title}</span>
                </div>
                <p className="text-[10px] text-[#94a3b8]">{rec.context}</p>
                {rec.quote && (
                  <p className="text-[10px] text-[#64748b] italic border-l-2 border-[#334155] pl-2 mt-2">
                    {rec.quote}
                  </p>
                )}
              </div>
            </div>
            
            <button className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none transition-colors ${rec.border} ${rec.color} hover:${rec.bg} flex-shrink-0`}>
              {rec.action} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )) : (
          <div className="p-12 text-center border border-[#1e293b] bg-[#0c0516]">
            <Lightbulb className="w-8 h-8 text-[#64748b] mx-auto mb-3 opacity-50" />
            <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold block">No Actionable Recommendations Yet</span>
            <span className="text-[10px] text-[#475569] mt-2 block">AI requires more review volume to surface operational recommendations.</span>
          </div>
        )}
      </div>
    </div>
  );
}
