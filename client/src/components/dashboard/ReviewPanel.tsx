import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import { AlertTriangle, MessageSquare, Search, Filter } from "lucide-react";

interface ReviewPanelProps {
  reviews: any[];
  sourceFilter: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onApprove: (reviewId: string, customDraft: string) => Promise<void>;
  children?: React.ReactNode;
}

export default function ReviewPanel({ 
  reviews, 
  sourceFilter, 
  title, 
  subtitle, 
  icon, 
  onApprove,
  children 
}: ReviewPanelProps) {

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [starFilter, setStarFilter] = useState("All");

  let filteredReviews = reviews.filter(r => r.source === sourceFilter || sourceFilter === "all");

  const unansweredCount = filteredReviews.filter(r => !r.owner_approved_reply && !r.final_reply_content).length;

  // Apply Status Filter
  if (statusFilter === "Pending") {
    filteredReviews = filteredReviews.filter(r => !r.owner_approved_reply && !r.final_reply_content);
  } else if (statusFilter === "Dispatched") {
    filteredReviews = filteredReviews.filter(r => r.owner_approved_reply || r.final_reply_content);
  }

  // Apply Star Filter
  if (starFilter !== "All") {
    const starVal = parseInt(starFilter);
    filteredReviews = filteredReviews.filter(r => r.rating === starVal);
  }

  // Apply Search Query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredReviews = filteredReviews.filter(r => 
      (r.text && r.text.toLowerCase().includes(q)) || 
      (r.diner_name && r.diner_name.toLowerCase().includes(q))
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full max-w-[1400px]">
      
      {/* Left Main Content: Reviews List */}
      <div className={`${children ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              {icon}
              {title}
            </h2>
            <p className="text-[11px] text-[#64748b] mt-1">
              {subtitle}
            </p>
          </div>

          <div className="px-2 py-1 border border-[#1e293b] text-[10px] font-semibold text-[#94a3b8] flex items-center gap-1 rounded-none bg-[#0c0516]">
            <MessageSquare className="w-3 h-3" />
            {filteredReviews.length - unansweredCount} / {filteredReviews.length} Replied
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0516] p-2 border border-[#1e293b] rounded-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1e293b]/20 px-2 py-1 border border-[#1e293b]">
              <Filter className="w-3 h-3 text-[#64748b]" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[10px] font-semibold text-white focus:outline-none uppercase tracking-widest cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1 bg-[#1e293b]/20 px-2 py-1 border border-[#1e293b]">
              <select 
                value={starFilter} 
                onChange={(e) => setStarFilter(e.target.value)}
                className="bg-transparent text-[10px] font-semibold text-white focus:outline-none uppercase tracking-widest cursor-pointer"
              >
                <option value="All">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="flex items-center relative flex-1 max-w-xs">
            <Search className="absolute left-2 w-3.5 h-3.5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-[#1e293b]/20 border border-[#1e293b] text-[10px] text-white focus:outline-none focus:border-[#a855f7] rounded-none placeholder-[#64748b]"
            />
          </div>
        </div>

        {/* Review List */}
        {filteredReviews.length === 0 ? (
          <div className="p-8 border border-[#1e293b] border-dashed rounded-none text-center space-y-2 mt-2 bg-[#1e293b]/10">
            <AlertTriangle className="mx-auto w-6 h-6 text-[#64748b]" />
            <h4 className="text-xs font-semibold text-[var(--foreground)]">No reviews match filters</h4>
            <p className="text-[10px] text-[#64748b] max-w-sm mx-auto">
              Adjust your search or filter settings to view more reviews.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 pb-10" style={{ maxHeight: "calc(100vh - 220px)" }}>
            {filteredReviews.map((rev) => (
              <ReviewCard 
                key={rev.id} 
                rev={rev} 
                onApprove={onApprove} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar Widget Area (Optional) */}
      {children && (
        <div className="lg:col-span-4 flex flex-col pt-[115px]">
          {children}
        </div>
      )}

    </div>
  );
}
