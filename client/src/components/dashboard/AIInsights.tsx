import React from "react";
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  BarChart2,
  RefreshCw,
  Clock
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AIInsights({ insights, onRefresh, isRefreshing, mode }: any) {
  const titleMap: Record<string, string> = {
    daily: "Daily Intelligence Report",
    weekly: "Weekly Intelligence Report",
    monthly: "Monthly Intelligence Report",
    all: "All-Time Intelligence Report"
  };
  const reportTitle = titleMap[mode] || titleMap.all;
  const trendLabel = mode === "daily" ? "7 Days" : mode === "weekly" ? "8 Weeks" : mode === "monthly" ? "6 Months" : "All Time";
  
  if (!insights) {
    return (
      <div className="space-y-4 w-full max-w-[1400px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#a855f7]" />
              {reportTitle}
            </h2>
            <p className="text-[11px] text-[#64748b] mt-1">
              AI-driven NLP analysis across all imported reviews and private intercepts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button 
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`px-3 py-1.5 border border-[#1e293b] text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#1e293b]/50 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Analyzing...' : 'Generate AI Data'}
              </button>
            )}
            <button className="px-3 py-1.5 border border-[#1e293b] text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#1e293b]/50 transition-colors opacity-50 cursor-not-allowed">
              <BarChart2 className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 border border-[#1e293b] bg-[#0c0516] rounded-xl">
          <BrainCircuit className="w-10 h-10 text-[#64748b] mb-4 opacity-50" />
          <span className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Data Not Available</span>
          <p className="text-[10px] text-[#475569] mt-2 text-center max-w-sm">We don't have enough review data to generate an AI Intelligence Report yet. Connect your Google Maps profile or collect more TableTalk QR feedback.</p>
        </div>
      </div>
    );
  }

  // Derive from actual insights object
  const healthTrendData = insights.health_trend || [
    { week: "Current", score: insights.health_score || 0 }
  ];

  const sentimentData = [
    { name: 'Positive', value: insights.sentiment?.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: insights.sentiment?.neutral || 0, color: '#f59e0b' },
    { name: 'Negative', value: insights.sentiment?.negative || 0, color: '#f43f5e' }
  ];

  const themesData = [
    ...(insights.themes?.praised || []).map((t: string) => ({ name: t, trend: "up", change: "+" })),
    ...(insights.themes?.complaints || []).map((t: any) => ({ name: typeof t === 'string' ? t : t.issue, trend: "down", change: "-" }))
  ].slice(0, 5);

  const bestDish = insights.themes?.praised?.[0] || "N/A";
  const worstDish = insights.themes?.complaints?.[0];
  const worstDishName = typeof worstDish === 'string' ? worstDish : (worstDish?.issue || "N/A");
  
  const temporalTrends = insights.themes?.temporal_trends || "No temporal patterns detected yet.";
  
  const actionItems = insights.action_items || [
    {
      category: "operations",
      title: "Gathering data",
      description: "Waiting for more reviews to generate operational suggestions."
    }
  ];

  return (
    <div className="space-y-4 w-full max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#a855f7]" />
            {reportTitle}
          </h2>
          <p className="text-[11px] text-[#64748b] mt-1">
            AI-driven NLP analysis across all imported reviews and private intercepts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`px-3 py-1.5 border border-[#1e293b] text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#1e293b]/50 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Analyzing...' : 'Refresh AI Data'}
            </button>
          )}
          <button className="px-3 py-1.5 border border-[#1e293b] text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#1e293b]/50 transition-colors">
            <BarChart2 className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Main Chart */}
        <div className="lg:col-span-8 bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col space-y-4 rounded-xl">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
            <span className="text-xs font-semibold text-[var(--foreground)]">Health Score Trend</span>
            <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">{trendLabel}</span>
          </div>
          <div className="flex-1 min-h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} />
                <CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0px', fontSize: '10px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{stroke: '#334155'}}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#0c0516', stroke: '#10b981' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Pie */}
        <div className="lg:col-span-4 bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-xl">
          <div className="pb-2 border-b border-[#1e293b] mb-4">
            <span className="text-xs font-semibold text-[var(--foreground)]">Sentiment Breakdown</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full flex justify-center gap-4 mt-2">
              {sentimentData.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#64748b]">
                  <div className="w-1.5 h-1.5" style={{backgroundColor: s.color}} />
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left Column: Top Themes & Menu Performance */}
        <div className="col-span-1 flex flex-col gap-4">
          
          {/* Top Themes */}
          <div className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all hover:border-[#334155]">
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold border-b border-[#1e293b] pb-2 mb-3">Top Themes Found</span>
            <div className="space-y-3">
              {themesData.length > 0 ? themesData.map((t, idx) => (
                <div key={idx} className="flex justify-between items-start text-[10px] gap-2">
                  <span className="text-[#e2e8f0] font-semibold pr-2 break-words leading-snug">{t.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <span className={`${t.trend === 'up' ? 'text-[#10b981]' : t.trend === 'down' ? 'text-[#f43f5e]' : 'text-[#64748b]'}`}>
                      {t.change}
                    </span>
                    {t.trend === 'up' ? <TrendingUp className="w-3 h-3 text-[#10b981]" /> : 
                     t.trend === 'down' ? <TrendingDown className="w-3 h-3 text-[#f43f5e]" /> : 
                     <span className="w-3 h-3 flex items-center justify-center text-[#64748b]">-</span>}
                  </div>
                </div>
              )) : (
                <span className="text-[10px] text-[#64748b]">No themes detected yet.</span>
              )}
            </div>
          </div>

          {/* Best / Worst Dishes */}
          <div className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all hover:border-[#334155]">
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold border-b border-[#1e293b] pb-2 mb-3 block">Menu Performance</span>
            
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1 text-[9px] text-[#10b981] uppercase tracking-widest font-bold">
                <ThumbsUp className="w-3 h-3" /> Best Reviewed
              </div>
              <span className="text-xs font-semibold text-white break-words leading-snug block">{bestDish}</span>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[9px] text-[#f43f5e] uppercase tracking-widest font-bold">
                <ThumbsDown className="w-3 h-3" /> Worst Reviewed
              </div>
              <span className="text-xs font-semibold text-white break-words leading-snug block">{worstDishName}</span>
            </div>
          </div>
          
        </div>

        {/* Right Column: Operational Intelligence (Spans 2 columns) */}
        <div className="col-span-1 md:col-span-2 bg-[#0c0516] border border-[#1e293b] p-5 flex flex-col rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2 mb-4">
              <span className="text-[11px] uppercase tracking-widest text-[#a855f7] font-bold">Actionable AI Suggestions</span>
              <span className="text-[9px] uppercase tracking-widest text-[#64748b]">Prioritized</span>
            </div>
            
            <div className="space-y-4">
              {actionItems.map((action: any, idx: number) => {
                const priorityColor = action.priority === 'High' ? 'text-red-400 bg-red-400/10 border-red-400/30' : 
                                     action.priority === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 
                                     action.priority === 'Low' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                                     'text-[#94a3b8] bg-[#1e293b]/50 border-[#1e293b]';
                
                return (
                  <div key={idx} className="p-4 bg-[#1e293b]/20 border border-[#1e293b] rounded-sm transition-all hover:border-[#a855f7]/40 hover:bg-[#1e293b]/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4 text-[#f59e0b]" /> {action.title || "Recommendation"}
                      </div>
                      {action.priority && (
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${priorityColor} w-max`}>
                          {action.priority} Priority
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#cbd5e1] leading-relaxed mb-3">
                      {typeof action === 'string' ? action : action.description}
                    </p>
                    
                    {/* Citations */}
                    {action.citations && action.citations.length > 0 && (
                      <div className="space-y-2 mt-4 pt-3 border-t border-[#1e293b]/50">
                        {action.citations.map((cite: any, cidx: number) => (
                          <div key={cidx} className="bg-[#0f172a] p-3 rounded-sm border border-[#1e293b] relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#a855f7]/60 group-hover:bg-[#a855f7] transition-colors"></div>
                            <p className="text-[12px] text-[#94a3b8] italic">"{cite.quote}"</p>
                            <div className="mt-2 text-[9px] text-[#475569] uppercase tracking-widest font-semibold flex items-center justify-between">
                              <span>Source Review Citation</span>
                              <span className="font-mono bg-[#1e293b] px-1.5 py-0.5 rounded">ID: {cite.review_id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 pt-3 border-t border-[#1e293b]">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#64748b] mt-0.5" />
              <p className="text-[10px] text-[#64748b] italic">
                {temporalTrends}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
