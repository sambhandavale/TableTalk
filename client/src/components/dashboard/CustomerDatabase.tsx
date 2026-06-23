import React, { useState } from "react";
import { Users, Filter, Send, Phone, Star, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function CustomerDatabase({ customers = [], reviews = [] }: any) {
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [expandedCustomerPhone, setExpandedCustomerPhone] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const derivedCustomers = customers.length > 0 ? customers : (() => {
    const map = new Map();
    reviews.forEach((r: any) => {
      if (!r.diner_name) return;
      const key = r.diner_phone || r.diner_email || r.diner_name;
      if (!map.has(key)) {
        map.set(key, {
          name: r.diner_name,
          contact: r.diner_phone || r.diner_email || "",
          visits: 0,
          totalRating: 0,
          lastVisit: r.timestamp || r.created_at || new Date().toISOString()
        });
      }
      const c = map.get(key);
      c.visits += 1;
      c.totalRating += (r.rating || 0);
      const rDate = new Date(r.timestamp || r.created_at || 0);
      if (rDate > new Date(c.lastVisit)) {
        c.lastVisit = r.timestamp || r.created_at;
      }
    });
    
    return Array.from(map.values()).map((c: any) => {
      c.avgRating = c.visits > 0 ? c.totalRating / c.visits : 0;
      if (c.avgRating >= 4 && c.visits > 1) c.segment = "Happy Regular";
      else if (c.avgRating >= 4) c.segment = "New";
      else if (c.avgRating <= 2) c.segment = "At Risk";
      else c.segment = "New";
      return c;
    });
  })();

  const filtered = segmentFilter === "All" ? derivedCustomers : derivedCustomers.filter((c: any) => c.segment === segmentFilter);

  return (
    <div className="space-y-4 w-full max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#a855f7]" />
            Customer Database (CRM)
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Diners who opted-in with contact information via the TableTalk QR Intercept.
          </p>
        </div>
        
        <button className="px-4 py-2 bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-xl transition-colors">
          <Send className="w-3.5 h-3.5" />
          Send Campaign
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0516] p-2 border border-[#1e293b] rounded-xl">
        <div className="flex items-center gap-2 bg-[#1e293b]/20 px-2 py-1 border border-[#1e293b]">
          <Filter className="w-3 h-3 text-[#64748b]" />
          <CustomSelect 
            value={segmentFilter}
            onChange={setSegmentFilter}
            options={[
              { label: "All Segments", value: "All" },
              { label: "Happy Regulars", value: "Happy Regular" },
              { label: "New", value: "New" },
              { label: "At Risk", value: "At Risk" },
              { label: "Lost", value: "Lost" }
            ]}
            className="bg-transparent text-[10px] font-semibold text-white focus:outline-none uppercase tracking-widest cursor-pointer min-w-[140px]"
          />
        </div>

        <div className="flex items-center relative flex-1 max-w-xs">
          <Search className="absolute left-2 w-3.5 h-3.5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-7 pr-3 py-1 bg-[#1e293b]/20 border border-[#1e293b] text-[10px] text-white focus:outline-none focus:border-[#a855f7] rounded-xl placeholder-[#64748b]"
          />
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-[#0c0516] border border-[#1e293b] rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#1e293b]/20 text-[9px] uppercase tracking-widest text-[#64748b]">
              <th className="p-3 font-bold">Diner Name</th>
              <th className="p-3 font-bold">Contact</th>
              <th className="p-3 font-bold">Visits</th>
              <th className="p-3 font-bold">Avg Rating</th>
              <th className="p-3 font-bold">AI Segment</th>
              <th className="p-3 font-bold">Last Visit</th>
              <th className="p-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {filtered.map((c: any, idx: number) => {
              const isExpanded = expandedCustomerPhone === (c.phone || c.contact || c.name);
              const customerReviews = reviews.filter((r: any) => 
                (c.phone && r.diner_phone === c.phone) || 
                (c.contact && (r.diner_phone === c.contact || r.diner_email === c.contact)) || 
                (!c.phone && !c.contact && r.diner_name === (c.name || c.diner_name))
              ).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              
              const totalPages = Math.ceil(customerReviews.length / 5);
              const paginatedReviews = customerReviews.slice((currentPage - 1) * 5, currentPage * 5);
              
              const avgRating = customerReviews.length > 0 
                ? customerReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / customerReviews.length 
                : (c.avgRating || 0);

              return (
              <React.Fragment key={idx}>
              <tr className={`hover:bg-[#1e293b]/10 transition-colors ${isExpanded ? 'bg-[#1e293b]/10' : ''}`}>
                <td className="p-3 text-xs font-semibold text-white">{c.name || c.diner_name || "Guest"}</td>
                <td className="p-3 text-[10px] text-[#94a3b8] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3 h-3 text-[#64748b]" /> {c.contact || c.phone || "N/A"}
                </td>
                <td className="p-3 text-[10px] text-white font-mono">{c.visits || c.visit_count || customerReviews.length || 1}</td>
                <td className="p-3 text-[10px] text-white flex items-center gap-1 mt-0.5">
                  <Star className={`w-3 h-3 ${avgRating >= 4 ? 'text-[#10b981]' : avgRating <= 2 ? 'text-[#f43f5e]' : 'text-[#f59e0b]'}`} />
                  {avgRating.toFixed(1)}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-xl ${
                    c.segment === "Happy Regular" ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]" :
                    c.segment === "At Risk" ? "bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]" :
                    c.segment === "Lost" ? "bg-[#f43f5e]/10 border-[#f43f5e]/30 text-[#f43f5e]" :
                    "bg-[#a855f7]/10 border-[#a855f7]/30 text-[#a855f7]"
                  }`}>
                    {c.segment || "New Customer"}
                  </span>
                </td>
                <td className="p-3 text-[10px] text-[#94a3b8]">{c.lastVisit || c.last_visit ? new Date(c.lastVisit || c.last_visit).toLocaleDateString() : "Recently"}</td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedCustomerPhone(null);
                      } else {
                        setExpandedCustomerPhone(c.phone || c.contact || c.name);
                        setCurrentPage(1);
                      }
                    }}
                    className="text-[#a855f7] hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-end gap-1 ml-auto"
                  >
                    View Reviews
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </td>
              </tr>
              {isExpanded && (
                <tr className="bg-[#05020a]">
                  <td colSpan={7} className="p-0 border-b border-[#1e293b]">
                    <div className="p-4 pl-8 border-l-2 border-[#a855f7] space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Customer Review History ({customerReviews.length})
                      </h4>
                      
                      {customerReviews.length === 0 ? (
                        <p className="text-[10px] text-[#475569] italic">No review text found for this customer.</p>
                      ) : (
                        <div className="space-y-3">
                          {paginatedReviews.map((r: any, rIdx: number) => (
                            <div key={rIdx} className="bg-[#1e293b]/20 border border-[#1e293b] p-3 rounded-xl">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#334155]'}`} />
                                  ))}
                                </div>
                                <span className="text-[9px] text-[#64748b] font-mono">{new Date(r.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-[#cbd5e1] leading-relaxed">"{r.text}"</p>
                              {r.ordered_items && r.ordered_items.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {r.ordered_items.map((item: string, iIdx: number) => (
                                    <span key={iIdx} className="text-[9px] bg-[#a855f7]/10 text-[#c084fc] px-1.5 py-0.5 border border-[#a855f7]/20 uppercase tracking-wider">{item}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[9px] text-[#64748b] uppercase tracking-widest font-semibold">
                            Page {currentPage} of {totalPages}
                          </span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="p-1 border border-[#1e293b] bg-[#1e293b]/50 hover:bg-[#a855f7] hover:text-black disabled:opacity-50 disabled:hover:bg-[#1e293b]/50 disabled:hover:text-white transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="p-1 border border-[#1e293b] bg-[#1e293b]/50 hover:bg-[#a855f7] hover:text-black disabled:opacity-50 disabled:hover:bg-[#1e293b]/50 disabled:hover:text-white transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-[#64748b] text-[10px] uppercase tracking-widest font-bold">
            {customers.length === 0 ? "No customers collected yet. Deploy your TableTalk QR codes to start building your CRM." : "No customers found in this segment."}
          </div>
        )}
      </div>

    </div>
  );
}
