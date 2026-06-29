import React, { useState } from "react";
import { Megaphone, Plus, MessageSquare, Send, CheckCircle, Smartphone } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function RetentionCampaigns({ campaigns: initialCampaigns = [], business, setActiveTab }: any) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [targetSegment, setTargetSegment] = useState("At Risk (Avg rating < 3)");
  const [campaignType, setCampaignType] = useState<"sms" | "email">("sms");
  const [emailTemplateId, setEmailTemplateId] = useState("win_back");
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduleTime, setScheduleTime] = useState("17:00");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("Hi {Name}, we miss you at {RestaurantName}! Show this SMS to get a complimentary dessert on your next visit.");

  const emailTemplates = [
    { id: "win_back", name: "The 'We Miss You' (Win-back)", subject: "It's been a while, {Name}! 🥺", html: `<div style="font-family:sans-serif;color:#333;max-width:500px;margin:0 auto;padding:20px;text-align:center;"><h1 style="color:#a855f7;">We Miss You!</h1><p style="font-size:16px;">Hi {Name}, it's been a while since we saw you at {RestaurantName}. We've missed serving you!</p><p style="font-size:16px;">Come back this week and enjoy a special treat on us.</p></div>` },
    { id: "vip", name: "The VIP Exclusive", subject: "Exclusive VIP offer just for you, {Name} 👑", html: `<div style="font-family:sans-serif;background:#0f172a;color:#f8fafc;max-width:500px;margin:0 auto;padding:30px;border-top:4px solid #f59e0b;"><h1 style="color:#f59e0b;">VIP Exclusive</h1><p style="font-size:16px;">Hi {Name}, as one of our top diners at {RestaurantName}, we wanted to give you early access to our new menu.</p></div>` },
    { id: "event", name: "The Special Event Invite", subject: "You're Invited! 🎉", html: `<div style="font-family:sans-serif;color:#333;max-width:500px;margin:0 auto;padding:20px;background:#f0f9ff;"><h1 style="color:#0284c7;">Special Event!</h1><p style="font-size:16px;">Hey {Name}, join us at {RestaurantName} for an unforgettable evening of great food and music.</p></div>` },
    { id: "apology", name: "The 'Sorry We Messed Up'", subject: "A note from the manager at {RestaurantName}", html: `<div style="font-family:serif;color:#333;max-width:500px;margin:0 auto;padding:20px;"><p style="font-size:16px;">Dear {Name},</p><p style="font-size:16px;">I want to personally apologize if your recent experience wasn't up to our usual standards. We value your feedback and want to make it right.</p></div>` },
    { id: "birthday", name: "The Birthday/Anniversary Treat", subject: "Happy Celebration, {Name}! 🎂", html: `<div style="font-family:sans-serif;color:#333;max-width:500px;margin:0 auto;padding:20px;text-align:center;background:#fff1f2;"><h1 style="color:#e11d48;">Happy Celebration!</h1><p style="font-size:16px;">Hi {Name}, we'd love to celebrate your special day with you at {RestaurantName}. Enjoy a complimentary dessert!</p></div>` }
  ];

  const coupons = business?.coupons || [];

  const handleSchedule = async () => {
    setIsSubmitting(true);
    try {
      const resp = await fetch("http://localhost:8000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: business.id || business.slug,
          target_segment: targetSegment,
          campaign_type: campaignType,
          message_template: campaignType === 'sms' ? messageTemplate : undefined,
          email_template_id: campaignType === 'email' ? emailTemplateId : undefined,
          schedule_type: scheduleType,
          schedule_time: scheduleType === 'daily' ? scheduleTime : undefined,
          schedule_date: scheduleType === 'specific' ? scheduleDate.split('T')[0] : undefined,
          coupon_code: selectedCouponCode
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setCampaigns([data.campaign, ...campaigns]);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="px-4 py-2 bg-[#a855f7]/10 border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-[#0c0516] border border-[#a855f7] p-5 rounded-xl flex flex-col space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-[#1e293b] pb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Create Campaign</h3>
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
                <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Target AI Segment</label>
                <CustomSelect 
                  value={targetSegment}
                  onChange={setTargetSegment}
                  options={[
                    "At Risk (Avg rating < 3)",
                    "Lost (No visit > 90 days)",
                    "Happy Regulars (Visits > 3, Rating > 4)"
                  ]}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl"
                />
                <span className="text-[12px] text-[#10b981] font-semibold mt-1 block">142 Diners match this segment</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Campaign Channel</label>
                <div className="flex bg-[#1e293b]/20 border border-[#1e293b] p-1">
                  <button
                    onClick={() => setCampaignType("sms")}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${campaignType === 'sms' ? 'bg-[#a855f7] text-white' : 'text-[#64748b] hover:text-white'}`}
                  >
                    SMS
                  </button>
                  <button
                    onClick={() => setCampaignType("email")}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${campaignType === 'email' ? 'bg-[#a855f7] text-white' : 'text-[#64748b] hover:text-white'}`}
                  >
                    Email
                  </button>
                </div>
              </div>

              {campaignType === 'sms' ? (
                <div className="space-y-1.5">
                  <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Message Template (SMS)</label>
                  <textarea 
                    value={messageTemplate}
                    onChange={(e) => setMessageTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl min-h-[100px] resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Email Template</label>
                  <CustomSelect 
                    value={emailTemplateId}
                    onChange={setEmailTemplateId}
                    options={emailTemplates.map(t => ({ label: t.name, value: t.id }))}
                    className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Scheduling</label>
                <CustomSelect 
                  value={scheduleType}
                  onChange={setScheduleType}
                  options={[
                    { label: "Send Right Now", value: "now" },
                    { label: "Every day at specific time", value: "daily" },
                    { label: "At a specific date and time", value: "specific" }
                  ]}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl mb-2"
                />
                
                {scheduleType === "daily" && (
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl font-mono" />
                )}
                
                {scheduleType === "specific" && (
                  <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl font-mono" />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">Attach Incentive (Optional)</label>
                <CustomSelect 
                  value={selectedCouponCode}
                  onChange={setSelectedCouponCode}
                  options={[
                    { label: "No Incentive", value: "" },
                    ...coupons.map((c: any) => {
                      const q = c.quantity;
                      const stock = (q === undefined || q === null || q === "") ? "Unlimited" : parseInt(q);
                      return {
                        label: `${c.discount_amount} (Code: ${c.coupon_code}) - Stock: ${stock}`,
                        value: c.coupon_code
                      };
                    })
                  ]}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-xl"
                />
                
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

              <button 
                onClick={handleSchedule}
                disabled={isSubmitting}
                className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Scheduling..." : "Schedule & Launch"}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#1e293b]/10 border border-[#1e293b] p-6 relative">
              <span className="absolute top-2 left-3 text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Live Preview</span>
              <div className="w-full flex justify-center mt-6">
                {campaignType === 'sms' ? (
                  <div className="w-[200px] h-[340px] border-4 border-[#1e293b] rounded-3xl bg-[#0c0516] flex flex-col overflow-hidden shadow-2xl">
                    <div className="bg-[#1e293b] p-2 text-center text-[10px] font-bold text-white">SMS</div>
                    <div className="p-3 flex-1 bg-black">
                      <div className="bg-[#334155] rounded-xl rounded-bl-sm p-2 mb-2 w-[85%] text-[10px] text-white whitespace-pre-wrap">
                        {messageTemplate.replace(/{Name}/g, "Ananya").replace(/{RestaurantName}/g, business?.name || "our business")}
                        {selectedCouponCode && `\n\nUse Code: ${selectedCouponCode}`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[600px] h-[340px] border border-[#1e293b] bg-white rounded-md flex flex-col overflow-hidden shadow-2xl">
                    <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] p-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-[12px] text-[#64748b] font-medium flex-1 text-center bg-white px-2 py-0.5 rounded border border-[#e2e8f0]">
                        {emailTemplates.find(t => t.id === emailTemplateId)?.subject.replace(/{Name}/g, "Ananya") || "Subject"}
                      </div>
                    </div>
                    <div className="flex-1 p-0 overflow-y-auto bg-white" dangerouslySetInnerHTML={{
                      __html: (emailTemplates.find(t => t.id === emailTemplateId)?.html || "").replace(/{Name}/g, "Ananya").replace(/{RestaurantName}/g, business?.name || "our business") + (selectedCouponCode ? `<div style="text-align:center;margin-top:20px;padding:15px;background:#f8fafc;border:2px dashed #cbd5e1;color:#334155;font-weight:bold;">Use Code: ${selectedCouponCode}</div>` : "")
                    }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : campaigns.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center justify-center py-20 border border-[#1e293b] bg-[#0c0516] rounded-xl">
          <Megaphone className="w-10 h-10 text-[#64748b] mb-4 opacity-50" />
          <span className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">No Active Campaigns</span>
          <p className="text-[10px] text-[#475569] mt-2 text-center max-w-sm">You haven't scheduled any SMS retention campaigns yet. Create one to automatically engage with your diners.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">Active Automated Campaigns</h3>
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp: any, idx: number) => (
              <div key={idx} className="bg-[#0c0516] border border-[#1e293b] p-5 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-[#1e293b] pb-3">
                  <div>
                    <span className="text-sm font-semibold text-white block">{camp.target_segment || camp.segment || "Campaign"}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 ${camp.status === 'completed' ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                      {camp.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Megaphone className="w-3 h-3" />} 
                      {camp.status || "Pending"}
                    </span>
                  </div>
                  <MessageSquare className="w-5 h-5 text-[#64748b]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#94a3b8] mt-1 max-w-lg line-clamp-2">
                    {camp.message_template}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748b]">
                    <span>• {camp.schedule_type === 'now' ? 'Sent immediately' : `Scheduled for ${camp.execute_at ? new Date(camp.execute_at).toLocaleString() : 'specific time'}`}</span>
                    {camp.coupon_code && (
                      <span className="text-[#a855f7] font-semibold">• Attached Coupon: {camp.coupon_code}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
