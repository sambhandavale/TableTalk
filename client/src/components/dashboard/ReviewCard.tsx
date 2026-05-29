import React, { useState } from "react";
import { Globe, Edit2, CornerDownRight, Check, Send, QrCode, RotateCw } from "lucide-react";

export default function ReviewCard({ rev, onApprove }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [customDraft, setCustomDraft] = useState(rev.ai_response_draft || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentOrderedItems, setCurrentOrderedItems] = useState(rev.ordered_items || []);

  const isApproved = rev.owner_approved_reply || rev.final_reply_content;

  const handleSaveDraft = () => {
    setIsEditing(false);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(rev.id, customDraft);
    setIsSubmitting(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/reviews/${rev.id}/regenerate-draft`, {
        method: "POST",
      });
      if (!resp.ok) throw new Error("Failed to regenerate draft");
      const data = await resp.json();
      
      setCustomDraft(data.ai_response_draft);
      setCurrentOrderedItems(data.ordered_items || []);
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate AI draft.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none flex flex-col gap-3">
      {/* Top Diner details & Stars */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-[var(--foreground)]">{rev.diner_name || "Guest"}</span>
            <span className="text-[9px] text-[#64748b] capitalize px-1 border border-[#1e293b] rounded-none">{rev.visitor_type || "unknown"}</span>
            
            {rev.source === "google" ? (
              <span className="text-[9px] text-[#a855f7] font-semibold flex items-center gap-1 border border-[#a855f7]/30 px-1 rounded-none bg-[#a855f7]/10">
                <Globe className="w-2.5 h-2.5" />
                Google
              </span>
            ) : (
              <span className="text-[9px] text-[#10b981] font-semibold flex items-center gap-1 border border-[#10b981]/30 px-1 rounded-none bg-[#10b981]/10">
                <QrCode className="w-2.5 h-2.5" />
                QR
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#94a3b8] leading-snug">
            {rev.text}
          </p>
          {currentOrderedItems && currentOrderedItems.length > 0 && (
            <div className="flex items-center gap-1 text-[9px] text-[#64748b] pt-0.5">
              <span>Items:</span>
              <div className="flex flex-wrap gap-1">
                {currentOrderedItems.map((item: string, i: number) => (
                  <span key={i} className="text-[#cbd5e1]">{item}{i < currentOrderedItems.length - 1 ? ',' : ''}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Star Ratings badge */}
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs leading-none ${i < rev.rating ? "text-[#f59e0b]" : "text-[#334155]"}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-[9px] text-[#64748b]">
            {rev.timestamp ? new Date(rev.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Just now"}
          </span>
        </div>
      </div>

      {/* Interactive Reply Terminal Panel */}
      <div className="bg-[#1e293b]/20 border border-[#1e293b] p-3 rounded-none space-y-2 mt-1">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <CornerDownRight className="w-3 h-3 text-[#a855f7]" />
            <span className="font-semibold text-[#a855f7] uppercase tracking-wider">AI Draft</span>
          </div>
          
          {!isApproved && !isEditing && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="text-[#a855f7] hover:text-white text-[9px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className={`w-2.5 h-2.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </button>

              <button 
                onClick={() => setIsEditing(true)}
                className="text-[#a855f7] hover:text-white text-[9px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-2.5 h-2.5" />
                Edit
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              className="w-full p-2 bg-[#0c0516] border border-[#a855f7] text-[10px] text-[var(--foreground)] placeholder-[#64748b] focus:outline-none min-h-[50px] leading-snug resize-none rounded-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-[9px] font-semibold text-[#94a3b8] hover:text-white border border-[#1e293b] rounded-none hover:bg-[#1e293b]/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-2 py-1 bg-[#a855f7]/20 border border-[#a855f7] text-[9px] font-semibold text-[#a855f7] hover:text-white hover:bg-[#a855f7] rounded-none transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-[#cbd5e1] leading-snug">
            {isApproved ? rev.final_reply_content : customDraft || "No AI template available..."}
          </p>
        )}

        {/* Approval / Status bar */}
        {!isEditing && (
          <div className="flex justify-end pt-1 mt-1">
            {isApproved ? (
              <div className="flex items-center gap-1 text-[#10b981] font-semibold text-[9px] border border-[#10b981]/20 bg-[#10b981]/5 px-2 py-1 rounded-none">
                <Check className="w-3 h-3" />
                Dispatched
              </div>
            ) : (
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className={`px-2 py-1 text-[9px] font-semibold flex items-center gap-1 rounded-none border transition-colors ${
                  isSubmitting
                    ? "bg-[#1e293b]/50 border-[#1e293b] text-[#64748b] cursor-not-allowed"
                    : "bg-[#0c0516] text-[#a855f7] border-[#a855f7] hover:bg-[#a855f7] hover:text-black"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-2.5 h-2.5 border-2 border-[#64748b]/20 border-t-[#64748b] rounded-none animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-2.5 h-2.5" />
                    Approve
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
