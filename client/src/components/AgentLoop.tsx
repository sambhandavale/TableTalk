"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, Activity } from "lucide-react";

export default function InfiniteAgentLoop() {
  const [activeIndex, setActiveIndex] = useState(0);

  const agents = [
    {
      id: 0,
      number: "01",
      title: "Audit Agent",
      desc: "Scrapes Google Reviews & profiles initial sentiment.",
      logs: [
        "[AUDIT_AGENT] > fetch --google-maps --cid=mm-bandra",
        "[AUDIT_AGENT] ✔ 342 historical Google reviews scraped successfully",
        "[AUDIT_AGENT] ✔ aspect sentiment-extraction completed via Gemini",
        "[AUDIT_AGENT] ✔ Cached overall health score: 78/100 (B+)"
      ]
    },
    {
      id: 1,
      number: "02",
      title: "Triage Agent",
      desc: "Intercepts negative scores privately to protect SEO.",
      logs: [
        "[TRIAGE_AGENT] > triage --review-id=rev-8942 --source=qr-funnel",
        "[TRIAGE_AGENT] ⚠ Star Rating: 2/5 stars detected (Private Complaint)",
        "[TRIAGE_AGENT] ✔ Intercepted privately; floor manager alert dispatched",
        "[TRIAGE_AGENT] ✔ apology SMS template drafted: \"We miss you...\""
      ]
    },
    {
      id: 2,
      number: "03",
      title: "Analysis Agent",
      desc: "Aggregates rating trends & isolates service spikes.",
      logs: [
        "[ANALYST_AGENT] > aggregate --reviews --duration=7d --scope=dishes",
        "[ANALYST_AGENT] ✔ Weekly NPS score compiled successfully: 92%",
        "[ANALYST_AGENT] ⚠ Trend Alert: Slow kitchen ticket times during Friday rush",
        "[ANALYST_AGENT] ✔ Praised dish: Mutton Biryani has 4.9★ rating"
      ]
    },
    {
      id: 3,
      number: "04",
      title: "Checklist Agent",
      desc: "Issues operational check tasks to kitchen staff.",
      logs: [
        "[STRATEGIST_AGENT] > compile --operational-checklist",
        "[STRATEGIST_AGENT] ✔ Action: Feature Mutton Biryani on Google Maps",
        "[STRATEGIST_AGENT] ⚠ Warning: Naan arriving cold Table 4. Check paths.",
        "[STRATEGIST_AGENT] ✔ Recommendation checklist compiled: 4 tasks added"
      ]
    },
    {
      id: 4,
      number: "05",
      title: "Response Agent",
      desc: "Auto-drafts brand-matching public Google replies.",
      logs: [
        "[GMB_RESPONSE_AGENT] > watch --listings --filter=unanswered",
        "[GMB_RESPONSE_AGENT] ✔ New public review detected on Google Maps (5★)",
        "[GMB_RESPONSE_AGENT] ✔ Auto-Drafted GMB reply: \"Hi Ananya! Thanks...\"",
        "[GMB_RESPONSE_AGENT] ✔ Response queued and pending owner one-tap approval"
      ]
    },
    {
      id: 5,
      number: "06",
      title: "Retention Agent",
      desc: "Dispatches SMS recovery coupons to churn risks.",
      logs: [
        "[RETENTION_AGENT] > campaign --segment=Lost/Unhappy --trigger=auto",
        "[RETENTION_AGENT] ✔ Segment verified: 14 VIP churn-risk customers",
        " [RETENTION_AGENT] ✔ dynamic apology vouchers compiled: SORRY20",
        "[RETENTION_AGENT] ✔ Twilio SMS dispatches successfully initiated"
      ]
    }
  ];

  // Infinite Circular Loop Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % agents.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="agent-orchestration" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 border-t border-white/[0.04] text-left font-sans">
      
      {/* Header Info */}
      <div className="max-w-3xl mb-16 space-y-3">
        <span className="text-xs font-bold text-[#c77dff] uppercase tracking-widest block">Autonomous Execution Loop</span>
        <h3 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
          How our AI Agents talk to each other
        </h3>
        <p className="text-xs text-white/50 font-sans max-w-md font-light leading-relaxed">
          Six cooperative agents running in an infinite background loop, orchestrating and passing telemetry data automatically.
        </p>
      </div>

      {/* Symmetrical Geometric Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {agents.map((agent) => {
          const isActive = activeIndex === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setActiveIndex(agent.id)}
              className={`liquid-glass-card dot-grid p-6 text-left transition-all duration-300 relative border flex flex-col justify-between h-[150px] outline-none cursor-pointer select-none ${
                isActive 
                  ? "border-[#c77dff]/60 bg-[#160a28]/80 shadow-[0_0_30px_rgba(199,125,255,0.12)] scale-[1.02]" 
                  : "border-white/[0.05] bg-white/[0.01] opacity-75 hover:opacity-90 hover:border-white/10"
              }`}
            >
              <div className="liquid-glass-glow" />
              
              <div className="relative z-10 w-full space-y-3 flex flex-col justify-between h-full">
                {/* Card Top */}
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-bold ${isActive ? "text-[#c77dff]" : "text-white/40"}`}>
                    AGENT {agent.number}
                  </span>
                  
                  {/* Status Ring */}
                  <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded text-[8px] text-white/50 uppercase font-mono font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
                    {isActive ? "ACTIVE" : "STANDBY"}
                  </div>
                </div>

                {/* Card Title & Desc */}
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold text-white transition-colors ${isActive ? "text-[#c77dff]" : ""}`}>
                    {agent.title}
                  </h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-light font-sans">
                    {agent.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CENTRALIZED LIVE CONSOLE TERMINAL */}
      <div className="w-full max-w-3xl mx-auto bg-black/60 border border-white/[0.06] rounded-xl p-5 font-mono text-[10px] text-[#c77dff] shadow-2xl relative overflow-hidden mt-12 backdrop-blur-md">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-3 mb-4 text-[9px] text-white/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#c77dff]" />
            <span>TABLETALK BACKGROUND AGENT PIPELINE FEED</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span className="font-mono text-green-400 tracking-wider">LIVE STREAMING</span>
          </div>
        </div>

        {/* Live console logging output stream */}
        <div className="space-y-2 min-h-[90px] flex flex-col justify-center text-left">
          {agents[activeIndex].logs.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-snug animate-fadeIn">
              <span className="text-white/20 select-none">{idx === 0 ? ">" : "•"}</span>
              <span className={`font-mono text-[9.5px] ${
                idx === 0 
                  ? "text-white/80" 
                  : line.includes("⚠") 
                    ? "text-yellow-400 font-bold" 
                    : line.includes("✔") 
                      ? "text-green-400 font-bold" 
                      : "text-[#c77dff]/90"
              }`}>
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
