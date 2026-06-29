import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { AlertTriangle, MessageSquare, Search, Filter } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { api } from "@/lib/api";

interface ReviewPanelProps {
  businessSlug: string;
  sourceFilter: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onApprove: (reviewId: string, customDraft: string) => Promise<void>;
  children?: React.ReactNode;
}

export default function ReviewPanel({ 
  businessSlug, 
  sourceFilter, 
  title, 
  subtitle, 
  icon, 
  onApprove,
  children 
}: ReviewPanelProps) {

  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [starFilter, setStarFilter] = useState("All");

  useEffect(() => {
    setReviewsList([]);
    setPage(1);
    fetchReviews(1, true);
  }, [sourceFilter, businessSlug]);

  const fetchReviews = async (pageNum: number, reset = false) => {
    setIsLoading(true);
    try {
      const data = await api.getReviews(businessSlug, pageNum, 20, sourceFilter);
      if (reset) {
        setReviewsList(data.items || []);
      } else {
        setReviewsList(prev => [...prev, ...(data.items || [])]);
      }
      setTotal(data.total || 0);
      setHasMore(data.items && data.items.length === 20);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  let filteredReviews = reviewsList;

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

          <div className="px-2 py-1 border border-[#1e293b] text-[10px] font-semibold text-[#94a3b8] flex items-center gap-1 rounded-xl bg-[#0c0516]">
            <MessageSquare className="w-3 h-3" />
            {total - unansweredCount} / {total} Replied
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0516] p-2 border border-[#1e293b] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#1e293b]/20 px-2 py-1 border border-[#1e293b]">
              <Filter className="w-3 h-3 text-[#64748b]" />
              <CustomSelect 
                value={statusFilter} 
                onChange={setStatusFilter}
                options={[
                  { label: "All Status", value: "All" },
                  { label: "Pending", value: "Pending" },
                  { label: "Dispatched", value: "Dispatched" }
                ]}
                className="bg-transparent text-[10px] font-semibold text-white focus:outline-none uppercase tracking-widest cursor-pointer min-w-[120px]"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-[#1e293b]/20 px-2 py-1 border border-[#1e293b]">
              <CustomSelect 
                value={starFilter} 
                onChange={setStarFilter}
                options={[
                  { label: "All Stars", value: "All" },
                  { label: "5 Stars", value: "5" },
                  { label: "4 Stars", value: "4" },
                  { label: "3 Stars", value: "3" },
                  { label: "2 Stars", value: "2" },
                  { label: "1 Star", value: "1" }
                ]}
                className="bg-transparent text-[10px] font-semibold text-white focus:outline-none uppercase tracking-widest cursor-pointer min-w-[100px]"
              />
            </div>
          </div>

          <div className="flex items-center relative flex-1 max-w-xs">
            <Search className="absolute left-2 w-3.5 h-3.5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-[#1e293b]/20 border border-[#1e293b] text-[10px] text-white focus:outline-none focus:border-[#a855f7] rounded-xl placeholder-[#64748b]"
            />
          </div>
        </div>

        {/* Review List */}
        {filteredReviews.length === 0 && !isLoading ? (
          <div className="p-8 border border-[#1e293b] border-dashed rounded-xl text-center space-y-2 mt-2 bg-[#1e293b]/10">
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
            
            {isLoading && (
              <div className="text-center py-4 text-xs text-[#64748b] animate-pulse">
                Loading reviews...
              </div>
            )}
            
            {hasMore && !isLoading && (
              <button 
                onClick={handleLoadMore}
                className="w-full py-2.5 mt-2 bg-[#1e293b]/50 hover:bg-[#1e293b] text-xs font-bold text-white border border-[#1e293b] rounded-xl transition-colors cursor-pointer"
              >
                Load More
              </button>
            )}
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
