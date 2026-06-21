import React, { useState } from "react";
import { Lightbulb, AlertOctagon, AlertTriangle, TrendingUp, ArrowRight, X } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function Recommendations({ insights, reviews = [] }: any) {
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[] | null>(null);
  
  // Create an array of recommendations from insights or show empty state
  const actionItems = insights?.action_items || [];
  
  let recommendations: any[] = [];
  
  if (actionItems.length > 0) {
    recommendations = actionItems.map((item: any) => {
      const displayTitle = typeof item === 'string' ? item : item.title;
      const displayContext = typeof item === 'string' ? "Identified by AI Audit" : item.description;
      const priority = item.priority || "Medium";
      const citations = item.citations || [];
      const reviewIds = citations.map((c: any) => c.review_id);

      const isCritical = priority === 'High';
      const isGrowth = item.category?.toLowerCase() === 'marketing';
      
      return {
        type: typeof item !== 'string' && item.category ? item.category.toUpperCase() : "OPERATIONS",
        icon: isCritical ? AlertOctagon : isGrowth ? TrendingUp : AlertTriangle,
        title: displayTitle,
        context: displayContext,
        citations: citations,
        action: "Trace Sources",
        source_review_ids: reviewIds,
        color: priority === 'High' ? "text-red-400" : priority === 'Medium' ? "text-yellow-400" : "text-blue-400",
        bg: priority === 'High' ? "bg-red-400/10" : priority === 'Medium' ? "bg-yellow-400/10" : "bg-blue-400/10",
        border: priority === 'High' ? "border-red-400/30" : priority === 'Medium' ? "border-yellow-400/30" : "border-blue-400/30",
        priority: priority
      }
    });
  }

  return (
    <div className="space-y-6 w-full max-w-[1200px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#a855f7]" />
            Actionable Recommendations
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Prioritized operational and marketing steps based on recent review data.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {recommendations.length > 0 ? recommendations.map((rec, idx) => (
          <div key={idx} className="bg-[#0c0516] border border-[#1e293b] p-5 flex flex-col rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:border-[#a855f7]/40 hover:bg-[#1e293b]/20">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 text-[11px] font-bold text-white uppercase tracking-widest">
                  <span className={`px-2 py-0.5 rounded-sm border ${rec.bg} ${rec.border} ${rec.color}`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-[#64748b]">{rec.type}</span>
                  <span className="text-[#e2e8f0] flex items-center gap-1.5"><rec.icon className={`w-3.5 h-3.5 ${rec.color}`} /> {rec.title}</span>
                </div>
                <p className="text-[12px] text-[#cbd5e1] leading-relaxed mb-4">
                  {rec.context}
                </p>

                {rec.citations.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-[#1e293b]/50">
                    {rec.citations.map((cite: any, cidx: number) => (
                      <div key={cidx} className="bg-[#0f172a] p-3 rounded-sm border border-[#1e293b] relative overflow-hidden group max-w-3xl">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#a855f7]/60 group-hover:bg-[#a855f7] transition-colors"></div>
                        <p className="text-[12px] text-[#94a3b8] italic">"{cite.quote}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex sm:flex-col items-center justify-center sm:pl-6 sm:border-l border-[#1e293b] flex-shrink-0">
                <button 
                  onClick={() => setSelectedReviewIds(rec.source_review_ids)}
                  disabled={rec.source_review_ids.length === 0}
                  className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center w-full gap-2 rounded-sm transition-colors ${rec.border} ${rec.color} hover:${rec.bg} ${rec.source_review_ids.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {rec.action} <ArrowRight className="w-3 h-3" />
                </button>
                <p className="text-[9px] text-[#64748b] mt-3 uppercase tracking-widest font-semibold text-center hidden sm:block">
                  {rec.source_review_ids.length} Source{rec.source_review_ids.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center border border-[#1e293b] bg-[#0c0516]">
            <Lightbulb className="w-8 h-8 text-[#64748b] mx-auto mb-3 opacity-50" />
            <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold block">No Actionable Recommendations Yet</span>
            <span className="text-[10px] text-[#475569] mt-2 block">AI requires more review volume to surface operational recommendations.</span>
          </div>
        )}
      </div>

      {/* Traceability Modal */}
      {selectedReviewIds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#0c0516] border border-[#1e293b] w-full max-w-[800px] max-h-[80vh] flex flex-col rounded-none shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#1e293b]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
                  AI Evidence Traceability
                </h3>
                <p className="text-[10px] text-[#64748b] mt-1">
                  Showing the exact customer reviews that triggered this specific AI recommendation.
                </p>
              </div>
              <button 
                onClick={() => setSelectedReviewIds(null)}
                className="text-[#64748b] hover:text-white transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              {reviews.filter((r: any) => selectedReviewIds.includes(r.id || r._id)).length > 0 ? (
                reviews.filter((r: any) => selectedReviewIds.includes(r.id || r._id)).map((review: any) => (
                  <ReviewCard 
                    key={review.id || review._id} 
                    rev={review} 
                    onApprove={async () => {}} 
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="text-sm text-[#64748b]">Could not find the source reviews in the current dataset.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
