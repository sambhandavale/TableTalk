import React from "react";
import { Activity, Globe, ArrowUp, ArrowDown, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function SEOHealth({ auditStatus = {}, seoStats = {}, insights = null }: any) {
  const isAudited = auditStatus?.audit_completed || false;
  const seoScore = seoStats?.score || 0;
  const pieData = [
    { value: seoScore, color: isAudited ? '#f59e0b' : '#1e293b' },
    { value: 100 - seoScore, color: '#1e293b' }
  ];

  const keywords = insights?.seo_insights?.trending_keywords || [];
  const descriptiveText = insights?.seo_insights?.descriptive_text || "Your score is FAIR. You are currently losing local search traffic to competitors due to a low review response rate and incomplete profile information.";

  return (
    <div className="space-y-6 w-full max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3b82f6]" />
            SEO Health & Presence
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            Track how your Google Maps profile ranks in local search results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Score & Core Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0c0516] border border-[#1e293b] p-6 rounded-none flex items-center gap-8 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
            <div className="w-[140px] h-[140px] relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{seoScore}</span>
                <span className="text-[8px] uppercase tracking-widest text-[#64748b]">/ 100</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-white">Google Presence Score</h3>
              {isAudited ? (
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                  {descriptiveText}
                </p>
              ) : (
                <p className="text-[11px] text-[#f43f5e] leading-relaxed font-bold">
                  Data Not Available. You must run a full AI SEO Audit to populate this score.
                </p>
              )}
              <button className="px-4 py-2 mt-3 bg-[#3b82f6]/10 border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-black text-[9px] font-bold uppercase tracking-widest transition-colors rounded-none">
                Run Full Audit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block border-b border-[#1e293b] pb-2">Response Rate</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold text-[#10b981]">{seoStats?.response_rate || 0}%</span>
                <div className="text-right">
                  <span className="text-[10px] text-[#10b981] flex items-center justify-end gap-1 font-bold">
                    <ArrowUp className="w-3 h-3" />
                  </span>
                  <span className="text-[9px] text-[#64748b]">Industry avg: 25%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block border-b border-[#1e293b] pb-2">Review Velocity</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold text-[#f43f5e]">{seoStats?.review_velocity || 0} <span className="text-sm text-[#64748b] font-normal">/ 30d</span></span>
                <div className="text-right">
                  <span className="text-[10px] text-[#f43f5e] flex items-center justify-end gap-1 font-bold">
                    <Activity className="w-3 h-3" />
                  </span>
                  <span className="text-[9px] text-[#64748b]">Past 30 days</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block border-b border-[#1e293b] pb-2">Average Rating</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold text-white">{seoStats?.average_rating || "0.0"} <span className="text-sm text-[#f59e0b] font-normal">★</span></span>
                <div className="text-right">
                  <span className="text-[10px] text-[#10b981] flex items-center justify-end gap-1 font-bold">
                    <ArrowUp className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block border-b border-[#1e293b] pb-2">Profile Completeness</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-semibold text-[#f59e0b]">{seoStats?.profile_completeness || 0}%</span>
                <div className="text-right">
                  <span className="text-[10px] text-[#f43f5e] flex items-center justify-end gap-1 font-bold">
                    {seoStats?.profile_completeness < 100 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3 text-[#10b981]" />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Keywords */}
        <div className="lg:col-span-4">
          <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-none h-full">
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold flex items-center gap-1.5 border-b border-[#1e293b] pb-3 mb-4">
              <Search className="w-3.5 h-3.5 text-[#3b82f6]" /> Keyword Appearances
            </span>
            <p className="text-[9px] text-[#94a3b8] mb-4 leading-snug">
              Google boosts your ranking for these terms when users search for them locally because they frequently appear in your reviews.
            </p>
            
            <div className="space-y-3">
              {keywords.length > 0 ? keywords.map((kw: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 border border-[#1e293b] bg-[#1e293b]/10 rounded-none">
                  <span className="text-xs font-semibold text-white">"{kw.word}"</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-[#64748b]">{kw.count}x</span>
                    {kw.sentiment === 'positive' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#f43f5e]" />
                    )}
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center border border-[#1e293b] bg-[#1e293b]/10">
                  <span className="text-[9px] text-[#64748b] font-bold uppercase tracking-widest">No keyword data yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
