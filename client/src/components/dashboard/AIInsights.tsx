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

export default function AIInsights({ insights, onRefresh, isRefreshing }: any) {
  
  if (!insights) {
    return (
      <div className="space-y-4 w-full max-w-[1400px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1e293b]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#a855f7]" />
              Weekly Intelligence Report
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
        <div className="flex flex-col items-center justify-center py-20 border border-[#1e293b] bg-[#0c0516] rounded-none">
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
            Weekly Intelligence Report
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
        <div className="lg:col-span-8 bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col space-y-4 rounded-none">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
            <span className="text-xs font-semibold text-[var(--foreground)]">Health Score Trend</span>
            <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">8 Weeks</span>
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
        <div className="lg:col-span-4 bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-none">
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
        
        {/* Top Themes */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-none">
          <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold border-b border-[#1e293b] pb-2 mb-3">Top Themes Found</span>
          <div className="space-y-3">
            {themesData.length > 0 ? themesData.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px]">
                <span className="text-white font-semibold truncate pr-2 max-w-[150px]">{t.name}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
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
        <div className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-none justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold border-b border-[#1e293b] pb-2 mb-3 block">Menu Performance</span>
            
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1 text-[9px] text-[#10b981] uppercase tracking-widest font-bold">
                <ThumbsUp className="w-3 h-3" /> Best Reviewed
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-full block">{bestDish}</span>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[9px] text-[#f43f5e] uppercase tracking-widest font-bold">
                <ThumbsDown className="w-3 h-3" /> Worst Reviewed
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-full block">{worstDishName}</span>
            </div>
          </div>
        </div>

        {/* Operational Intelligence */}
        <div className="bg-[#0c0516] border border-[#1e293b] p-4 flex flex-col rounded-none justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold border-b border-[#1e293b] pb-2 mb-3 block">Actionable AI Suggestions</span>
            
            <div className="space-y-2 mt-2">
              {actionItems.map((action: any, idx: number) => (
                <div key={idx} className="p-2 bg-[#1e293b]/20 border border-[#1e293b]">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-white uppercase tracking-widest mb-1.5">
                    <AlertTriangle className="w-3 h-3 text-[#f59e0b]" /> {action.title || "Recommendation"}
                  </div>
                  <p className="text-[10px] text-[#94a3b8] leading-snug">
                    {typeof action === 'string' ? action : action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#1e293b]">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3 h-3 text-[#64748b] mt-0.5" />
              <p className="text-[9px] text-[#64748b] italic">
                {temporalTrends}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
