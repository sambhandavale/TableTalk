import React from "react";
import { 
  MapPin, 
  ShieldAlert, 
  CheckCircle,
  ThumbsUp,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function OverviewPanel({ business, reviews = [], insights, auditStatus, chartData = [], healthSparkline = [], mode }: any) {
  const modeConfig: Record<string, any> = {
    daily: { velocityUnit: "/today", chartLabel: "Last 7 Days", dishLabel: "Today", worstLabel: "Today", deltaLabel: "vs Yesterday" },
    weekly: { velocityUnit: "/this week", chartLabel: "Last 30 Days", dishLabel: "This Week", worstLabel: "This Week", deltaLabel: "vs Last Week" },
    monthly: { velocityUnit: "/this month", chartLabel: "Last 6 Months", dishLabel: "This Month", worstLabel: "This Month", deltaLabel: "vs Last Month" },
    all: { velocityUnit: "/total", chartLabel: "All Time", dishLabel: "All Time", worstLabel: "All Time", deltaLabel: "" }
  };
  const mc = modeConfig[mode] || modeConfig.all;

  const unansweredCount = reviews.filter((r: any) => !r.owner_approved_reply && !r.final_reply_content).length;

  const now = new Date();
  const windowedReviews = reviews.filter((r: any) => {
    if (mode === "all") return true;
    const rTime = new Date(r.timestamp || r.created_at || 0);
    const diffDays = (now.getTime() - rTime.getTime()) / (1000 * 60 * 60 * 24);
    if (mode === "daily") return diffDays <= 1;
    if (mode === "weekly") return diffDays <= 7;
    if (mode === "monthly") return diffDays <= 30;
    return true;
  });

  const googleCount = windowedReviews.filter((r: any) => r.source === 'google').length;
  const qrCount = windowedReviews.filter((r: any) => r.source === 'tabletalk' || r.source === 'qr').length;
  const otherCount = windowedReviews.length - googleCount - qrCount;
  
  const sourceData = windowedReviews.length > 0 ? [
    { name: 'Google', value: Math.round((googleCount/windowedReviews.length)*100), color: '#a855f7' },
    { name: 'TableTalk QR', value: Math.round((qrCount/windowedReviews.length)*100), color: '#10b981' },
    { name: 'Yelp/Other', value: Math.round((otherCount/windowedReviews.length)*100), color: '#f59e0b' }
  ] : [
    { name: 'No Data', value: 100, color: '#334155' }
  ];

  // Derive Activity Feed from windowed reviews
  const activityFeed = [...windowedReviews].sort((a, b) => new Date(b.timestamp || b.created_at || 0).getTime() - new Date(a.timestamp || a.created_at || 0).getTime()).slice(0, 5).map(r => ({
    user: r.diner_name || "Guest",
    rating: r.rating || 5,
    time: r.timestamp || r.created_at ? new Date(r.timestamp || r.created_at).toLocaleDateString() : "Just now",
    text: r.text || "Left a rating."
  }));

  let topDish = "N/A";
  let worstDish = "N/A";
  let topIsTheme = false;
  let worstIsTheme = false;

  if (mode === "all" || windowedReviews.length === 0) {
    topDish = insights?.themes?.praised?.[0] || "N/A";
    topIsTheme = true;
    const w = insights?.themes?.complaints?.[0];
    worstDish = typeof w === 'string' ? w : (w?.issue || "N/A");
    worstIsTheme = true;
  } else {
    const itemScores: Record<string, { pos: number, neg: number }> = {};
    windowedReviews.forEach((r: any) => {
      const items = r.ordered_items || [];
      items.forEach((item: string) => {
        if (!itemScores[item]) itemScores[item] = { pos: 0, neg: 0 };
        if (r.rating >= 4) itemScores[item].pos += 1;
        if (r.rating <= 3) itemScores[item].neg += 1;
      });
    });

    let maxPos = 0;
    let maxNeg = 0;
    for (const [item, scores] of Object.entries(itemScores)) {
      if (scores.pos > maxPos) {
        maxPos = scores.pos;
        topDish = item;
      }
      if (scores.neg > maxNeg) {
        maxNeg = scores.neg;
        worstDish = item;
      }
    }

    if (topDish === "N/A") {
      topDish = insights?.themes?.praised?.[0] || "N/A";
      topIsTheme = true;
    }
    if (worstDish === "N/A") {
      const w = insights?.themes?.complaints?.[0];
      worstDish = typeof w === 'string' ? w : (w?.issue || "N/A");
      worstIsTheme = true;
    }
  }

  return (
    <div className="space-y-4 w-full max-w-[1400px]">
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] font-sans leading-none">
            {business.name}
          </h1>
          <p className="text-[11px] text-[#64748b] mt-1.5 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#a855f7]" />
            {business.location} | <span className="font-medium text-[#a855f7]">{business.cuisine}</span>
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-xl hover:bg-[#f43f5e]/20 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5" />
            1 Critical Complaint
          </button>
          <button className="px-3 py-1.5 bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-xl hover:bg-[#a855f7]/20 transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            {unansweredCount} Replies Needed
          </button>
        </div>
      </div>

      {/* KPI STATS GRID (WITH WoW & SPARKLINES) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-3 rounded-xl relative flex justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Health Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-semibold text-[var(--foreground)] leading-none">
                {business.health_score || 88}%
              </span>
              {mode !== "all" && (
                <span className="text-[9px] text-[#10b981] font-semibold flex items-center">
                  <ArrowUpRight className="w-2.5 h-2.5" /> 4% {mc.deltaLabel}
                </span>
              )}
            </div>
          </div>
          <div className="w-16 h-8 mt-2 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthSparkline}>
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-3 rounded-xl relative">
          <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Review Velocity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold text-[var(--foreground)] leading-none">
              {windowedReviews.length} <span className="text-[10px] text-[#64748b] font-normal">{mc.velocityUnit}</span>
            </span>
            {mode !== "all" && (
              <span className="text-[9px] text-[#10b981] font-semibold flex items-center">
                <ArrowUpRight className="w-2.5 h-2.5" /> 12% {mc.deltaLabel}
              </span>
            )}
          </div>
        </div>

        {/* Unanswered */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-3 rounded-xl relative">
          <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Unanswered Queue</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-semibold leading-none ${unansweredCount > 0 ? "text-[#f43f5e]" : "text-[#10b981]"}`}>
              {unansweredCount}
            </span>
            <span className="text-[9px] text-[#f43f5e] font-semibold flex items-center">
              <ArrowDownRight className="w-2.5 h-2.5" /> Needs action
            </span>
          </div>
        </div>

        {/* Top Dish */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-3 rounded-xl relative">
          <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Top Dish ({mc.dishLabel})</span>
          {insights || windowedReviews.length > 0 ? (
            <>
              <div className="flex items-start gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                <span className="text-xs font-semibold text-[var(--foreground)] leading-snug line-clamp-2 pr-2">
                  {topDish}
                </span>
              </div>
              <span className="text-[8px] text-[#64748b] uppercase tracking-wider block mt-1">
                {topIsTheme ? "Identified by AI" : "Based on recent reviews"}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold text-[#64748b] mt-2 block">Data not available</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Side: Graphs & Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-xl flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
              <span className="text-xs font-semibold text-[var(--foreground)]">Review Volume Trends</span>
              <span className="text-[9px] uppercase tracking-widest text-[#94a3b8] font-bold">{mc.chartLabel}</span>
            </div>
            <div className="flex-1 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.map((d: any) => ({
                  ...d,
                  name: mode === 'weekly' ? (
                    d.name === 'W1' ? '3 Weeks Ago' : 
                    d.name === 'W2' ? '2 Weeks Ago' : 
                    d.name === 'W3' ? 'Last Week' : 
                    d.name === 'W4' ? 'This Week' : d.name
                  ) : d.name
                }))} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                  <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0px', fontSize: '10px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{stroke: '#334155'}}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#a855f7" strokeWidth={2} fillOpacity={0.1} fill="#a855f7" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Breakdown */}
            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-xl h-[140px] flex items-center">
              <div className="w-1/3 h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} innerRadius={25} outerRadius={35} paddingAngle={2} dataKey="value" stroke="none">
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-2/3 pl-2 flex flex-col justify-center gap-1.5">
                <span className="text-[10px] font-semibold text-[var(--foreground)] flex items-center gap-1.5 mb-1"><PieChartIcon className="w-3 h-3 text-[#a855f7]" /> Source Distribution</span>
                {sourceData.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-xl" style={{backgroundColor: s.color}} />
                      <span className="text-[#64748b]">{s.name}</span>
                    </div>
                    <span className="text-white">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst Dish */}
            <div className="bg-[#0c0516] border border-[#1e293b] p-4 rounded-xl h-[140px] flex flex-col justify-center gap-1">
              <span className="text-[9px] uppercase tracking-widest text-[#f43f5e] font-semibold block">Worst Component ({mc.worstLabel})</span>
              {insights || windowedReviews.length > 0 ? (
                <>
                  <span className="text-sm font-semibold text-[var(--foreground)] mt-1 truncate">{worstDish}</span>
                  <span className="text-[9px] text-[#64748b] leading-snug block mt-1 line-clamp-2">
                    {worstIsTheme ? "Identified by AI Analysis as a primary negative driver." : "Identified from recent low-rated reviews."}
                  </span>
                  {worstIsTheme && (
                    <button className="text-[#a855f7] hover:text-white text-[9px] font-bold tracking-widest uppercase text-left mt-2 transition-colors flex items-center gap-1">
                      View Reports <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-[#64748b] mt-2 block">Data not available yet. Waiting for reviews.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Activity Feed */}
        <div className="lg:col-span-4 bg-[#0c0516] border border-[#1e293b] flex flex-col rounded-xl">
          <div className="p-3 pb-2 border-b border-[#1e293b] bg-[#1e293b]/20">
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">Recent Activity Feed</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar custom-scrollbar" style={{ maxHeight: "330px" }}>
            {activityFeed.length > 0 ? activityFeed.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-xl ${item.rating >= 4 ? 'bg-[#10b981]' : item.rating <= 2 ? 'bg-[#f43f5e]' : 'bg-[#f59e0b]'}`} />
                  {idx !== activityFeed.length -1 && <div className="w-px h-full bg-[#1e293b] mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-white">{item.user}</span>
                    <span className="text-[8px] text-[#64748b]">{item.time}</span>
                  </div>
                  <div className="flex gap-0.5 mt-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-[8px] ${i < item.rating ? "text-[#f59e0b]" : "text-[#334155]"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-[9px] text-[#94a3b8] leading-snug line-clamp-2 italic border-l border-[#334155] pl-1.5">"{item.text}"</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-50 py-10">
                <AlertTriangle className="w-5 h-5 text-[#64748b]" />
                <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">No recent activity</span>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-[#1e293b]">
            <button className="w-full text-center text-[#64748b] hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors">
              View All History
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
