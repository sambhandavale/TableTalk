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
        "[ANALYST_AGENT] > aggregate --reviews --duration=7d --scope=services",
        "[ANALYST_AGENT] ✔ Weekly NPS score compiled successfully: 92%",
        "[ANALYST_AGENT] ⚠ Trend Alert: Slow checkout times during Friday rush",
        "[ANALYST_AGENT] ✔ Praised service: Premium Consultation has 4.9★ rating"
      ]
    },
    {
      id: 3,
      number: "04",
      title: "Checklist Agent",
      desc: "Issues operational check tasks to staff.",
      logs: [
        "[STRATEGIST_AGENT] > compile --operational-checklist",
        "[STRATEGIST_AGENT] ✔ Action: Feature Premium Consultation on Google Maps",
        "[STRATEGIST_AGENT] ⚠ Warning: Waiting area congested. Check paths.",
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
    <section id="agent-orchestration" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 border-t border-[var(--brand-border)] text-left font-sans transition-colors duration-300">
      
      {/* Header Info */}
      <div className="max-w-3xl mb-16 space-y-3">
        <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">Autonomous Execution Loop</span>
        <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight transition-colors duration-300">
          How our AI Agents talk to each other
        </h3>
        <p className="text-xs text-[var(--text-muted)] font-sans max-w-md font-light leading-relaxed transition-colors duration-300">
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
              className={`agent-card dot-grid p-6 text-left relative flex flex-col justify-between h-[160px] outline-none cursor-pointer select-none transition-all duration-500 overflow-hidden ${
                isActive 
                  ? "border-[#9d4edd]/50 bg-[var(--brand-card-active)] shadow-[0_12px_40px_rgba(157,78,221,0.18)] scale-[1.03] z-20" 
                  : "border-[var(--brand-border)] bg-[var(--brand-card)] opacity-75 hover:opacity-95 hover:border-[#9d4edd]/35 hover:scale-[1.01]"
              }`}
            >
              {/* Dynamic Glowing Bottom Highlight inspired by chainApex mockup */}
              <div className={`absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#9d4edd]/20 via-[#9d4edd]/5 to-transparent transition-opacity duration-500 pointer-events-none rounded-b-2xl ${isActive ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9d4edd] via-[#c77dff] to-[#9d4edd] transition-all duration-500 rounded-b-2xl shadow-[0_-2px_15px_rgba(157,78,221,0.6)] ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"}`} />
              
              <div className="relative z-10 w-full space-y-3 flex flex-col justify-between h-full">
                {/* Card Top */}
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? "text-brand-purple-text" : "text-[var(--text-dim)]"}`}>
                    AGENT {agent.number}
                  </span>
                  
                  {/* Status Ring */}
                  <div className="flex items-center gap-1.5 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] px-2 py-0.5 rounded text-[12px] text-[var(--text-muted)] uppercase font-mono font-bold transition-colors duration-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-[var(--text-dim)]"}`} />
                    {isActive ? "ACTIVE" : "STANDBY"}
                  </div>
                </div>

                {/* Card Title & Desc */}
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold text-[var(--foreground)] transition-colors duration-300`}>
                    {agent.title}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-light font-sans transition-colors duration-300">
                    {agent.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CENTRALIZED LIVE CONSOLE TERMINAL */}
      <div className="w-full max-w-3xl mx-auto bg-black/60 border border-slate-800 rounded-xl p-5 font-mono text-[10px] text-[#c77dff] shadow-2xl relative overflow-hidden mt-12 backdrop-blur-md">
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 text-[12px] text-slate-400">
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
              <span className="text-slate-600 select-none">{idx === 0 ? ">" : "•"}</span>
              <span className={`font-mono text-[12px] ${
                idx === 0 
                  ? "text-slate-100 font-medium" 
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
