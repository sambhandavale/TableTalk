import React, { useState } from "react";
import { Megaphone, Plus, MessageSquare, Send, CheckCircle, Smartphone } from "lucide-react";

export default function RetentionCampaigns({ campaigns = [], business, setActiveTab }: any) {
  const [isCreating, setIsCreating] = useState(false);
  
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduleTime, setScheduleTime] = useState("17:00");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("Hi {Name}, we miss you at {RestaurantName}! Show this SMS to get a complimentary dessert on your next visit.");

  const coupons = business?.coupons || [];

  return (
    <div className="space-y-6 w-full max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#a855f7]" />
            Retention Campaigns
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Automated SMS marketing to intercept segments and drive repeat visits.
          </p>
        </div>
        
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-[#0c0516] border border-[#a855f7] p-5 rounded-none flex flex-col space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Create SMS Campaign</h3>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-[10px] text-[#64748b] hover:text-white uppercase tracking-widest font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Target AI Segment</label>
                <select className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none">
                  <option>At Risk (Avg rating &lt; 3)</option>
                  <option>Lost (No visit &gt; 90 days)</option>
                  <option>Happy Regulars (Visits &gt; 3, Rating &gt; 4)</option>
                </select>
                <span className="text-[9px] text-[#10b981] font-semibold mt-1 block">142 Diners match this segment</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Message Template</label>
                <textarea 
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Scheduling</label>
                <select 
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none appearance-none mb-2"
                >
                  <option value="now">Send Right Now</option>
                  <option value="daily">Every day at specific time</option>
                  <option value="specific">At a specific date and time</option>
                </select>
                
                {scheduleType === "daily" && (
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none font-mono" />
                )}
                
                {scheduleType === "specific" && (
                  <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none font-mono" />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Attach Incentive (Optional)</label>
                <select 
                  value={selectedCouponCode}
                  onChange={(e) => setSelectedCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none appearance-none"
                >
                  <option value="">No Incentive</option>
                  {coupons.map((c: any, idx: number) => {
                    const q = c.quantity;
                    const stock = (q === undefined || q === null || q === "") ? "Unlimited" : parseInt(q);
                    return (
                      <option key={idx} value={c.coupon_code}>
                        {c.discount_amount} (Code: {c.coupon_code}) - Stock: {stock}
                      </option>
                    )
                  })}
                </select>
                
                {selectedCouponCode && (
                  (() => {
                    const selected = coupons.find((c: any) => c.coupon_code === selectedCouponCode);
                    const stock = selected && selected.quantity !== undefined && selected.quantity !== "" ? parseInt(selected.quantity) : "Unlimited";
                    
                    if (stock !== "Unlimited" && stock <= 0) {
                      return (
                        <div className="mt-2 text-[10px] text-[#f43f5e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#f43f5e]/10 border border-[#f43f5e]/20 p-3">
                          <span>⚠️ Out of stock! This campaign will not run properly.</span>
                          <button 
                            onClick={() => setActiveTab("settings")}
                            className="bg-[#f43f5e] text-white px-2 py-1 uppercase tracking-widest font-bold hover:bg-[#e11d48] transition-colors whitespace-nowrap"
                          >
                            Add Quantity
                          </button>
                        </div>
                      )
                    }
                    if (stock !== "Unlimited" && stock < 10) {
                      return (
                         <div className="mt-2 text-[10px] text-[#f59e0b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-3">
                          <span>⚠️ Low stock: only {stock} remaining.</span>
                          <button 
                            onClick={() => setActiveTab("settings")}
                            className="bg-[#f59e0b] text-black px-2 py-1 uppercase tracking-widest font-bold hover:bg-[#d97706] transition-colors whitespace-nowrap"
                          >
                            Add Quantity
                          </button>
                        </div>
                      )
                    }
                    return null;
                  })()
                )}
              </div>

              <button className="w-full py-2.5 bg-[#a855f7] hover:bg-[#b55fe6] text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-none transition-colors">
                <Send className="w-3.5 h-3.5" />
                Schedule & Launch
              </button>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#1e293b]/10 border border-[#1e293b] p-6 relative">
              <span className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Live Preview</span>
              <div className="w-[200px] h-[340px] border-4 border-[#1e293b] rounded-3xl bg-[#0c0516] flex flex-col overflow-hidden">
                <div className="bg-[#1e293b] p-2 text-center text-[10px] font-bold text-white">SMS</div>
                <div className="p-3 flex-1 bg-black">
                  <div className="bg-[#334155] rounded-xl rounded-bl-sm p-2 mb-2 w-[85%] text-[10px] text-white whitespace-pre-wrap">
                    {messageTemplate.replace(/{Name}/g, "Ananya").replace(/{RestaurantName}/g, business?.name || "our business")}
                    {selectedCouponCode && `\n\nUse Code: ${selectedCouponCode}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">Active Automated Campaigns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.length > 0 ? campaigns.map((camp: any, idx: number) => {
              const sent = camp.sent_count || 0;
              const redeemed = camp.redemption_count || 0;
              const rate = sent > 0 ? Math.round((redeemed / sent) * 100) : 0;
              const color = rate > 20 ? "#10b981" : "#f59e0b";
              
              return (
                <div key={idx} className="bg-[#0c0516] border border-[#1e293b] p-5 rounded-none flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-[#1e293b] pb-3">
                    <div>
                      <span className="text-sm font-semibold text-white block">{camp.name || camp.segment || "Campaign"}</span>
                      <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3" /> {camp.status || "Active"}
                      </span>
                    </div>
                    <MessageSquare className="w-5 h-5 text-[#64748b]" />
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Sent</span>
                      <span className="text-lg font-mono text-white">{sent}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Redeemed</span>
                      <span className="text-lg font-mono text-white">{redeemed}</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">Conv. Rate</span>
                      <span className="text-lg font-semibold" style={{ color }}>{rate}%</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-1 md:col-span-2 p-8 text-center border border-[#1e293b] bg-[#0c0516]">
                <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">No active campaigns. Click "New Campaign" to engage your diners.</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
