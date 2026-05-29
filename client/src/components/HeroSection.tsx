"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Star, LayoutDashboard, ShieldAlert } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Title & Copy */}
      <div className="lg:col-span-6 text-left space-y-8 animate-fadeIn">

        <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-white font-extrabold max-w-xl">
          Making Offline Business Operations Profitable with AI
        </h2>

        <p className="text-sm sm:text-base text-white/70 max-w-lg font-light leading-relaxed">
          TableTalk is an all-in-one platform integrating smart QR review funnels, instant Google audits, and automated customer retention. Intercept negative feedback privately, boost Google Maps SEO, and bring lost customers back automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-2">
          <a 
            href="/onboard"
            className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 text-xs font-bold rounded-xl transition-all duration-300 shadow-xl flex items-center justify-center gap-1.5 transform active:scale-95 cursor-pointer border border-[var(--brand-border)]"
          >
            Get started
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a 
            href="#triage-simulator"
            className="px-8 py-4 border border-white/[0.08] hover:bg-white/[0.02] text-xs font-bold text-white rounded-xl transition-all text-center flex items-center justify-center"
          >
            Try Simulator
          </a>
        </div>

        {/* Channels */}
        <div className="pt-8 border-t border-white/[0.04] space-y-3">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block">Supported Channels</span>
          <div className="flex flex-wrap items-center gap-6 text-white/70 text-xs font-bold">
            <span className="bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Google Maps
            </span>
            <span className="bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c77dff]" /> WhatsApp SMS
            </span>
            <span className="bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> POS Terminals
            </span>
            <span className="text-white/30 text-[10px]">+ More Integrations</span>
          </div>
        </div>
      </div>

      {/* Right Column: Layered, Floating Dashboard Mockups (like Revly) */}
      <div className="lg:col-span-6 flex items-center justify-center py-12 lg:py-0 relative z-10">
        
        {/* Constrained Layering Wrapper - Keeps cards floating elegantly around the dashboard */}
        <div className="relative w-full max-w-[480px] h-[310px] animate-float">
          
          {/* Central Mockup: Web Dashboard (Landscape Laptop Style) */}
          <div className="absolute inset-0 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-5 shadow-2xl overflow-hidden backdrop-blur-xl z-10 flex flex-col justify-between transition-colors duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-purple-text)]/30 to-transparent" />
            
            {/* Browser/Dashboard Header */}
            <div className="flex justify-between items-center border-b border-[var(--brand-border-subtle)] pb-3 text-[10px] text-[var(--text-dim)]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                <span className="text-[9px] font-mono ml-1.5 text-[var(--text-muted)] font-medium">dashboard.tabletalk.in/mm-bandra</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 text-[8px] text-[var(--brand-purple-text)] font-bold tracking-wider">
                ACTIVE
              </span>
            </div>

            {/* Horizontal Layout Dashboard body */}
            <div className="flex-1 flex gap-4 pt-3 overflow-hidden">
              {/* Micro Sidebar */}
              <div className="w-10 flex flex-col items-center gap-3 border-r border-[var(--brand-border-subtle)] pr-2">
                <div className="w-7 h-7 rounded-xl bg-[var(--brand-purple-text)]/10 text-[var(--brand-purple-text)] flex items-center justify-center transition-colors duration-300">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-xl hover:bg-[var(--orb-bg)] text-[var(--text-dim)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors duration-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-xl hover:bg-[var(--orb-bg)] text-[var(--text-dim)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors duration-300">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              {/* Main Workspace */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden text-left">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <span className="text-[8.5px] text-[var(--text-dim)] uppercase tracking-wider font-semibold block">Business</span>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)] leading-tight truncate transition-colors duration-300">
                      Urban Retail & Services
                    </h4>
                  </div>
                  
                  {/* Compact Stats */}
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] px-2.5 py-1 rounded-xl text-center shadow-sm">
                      <span className="text-[7px] text-[var(--text-dim)] uppercase font-semibold block">NPS</span>
                      <span className="text-xs font-bold text-[var(--foreground)] block">92%</span>
                    </div>
                    <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] px-2.5 py-1 rounded-xl text-center shadow-sm">
                      <span className="text-[7px] text-[var(--text-dim)] uppercase font-semibold block">Scans</span>
                      <span className="text-xs font-bold text-[var(--foreground)] block">342</span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Feed rows */}
                <div className="space-y-2 pt-2">
                  <span className="text-[8.5px] text-[var(--text-dim)] block uppercase tracking-wider font-semibold">Triage Feed</span>
                  
                  <div className="bg-red-500/5 border border-red-500/10 px-3 py-2 rounded-xl flex justify-between items-center gap-3 text-[9.5px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="font-bold text-[var(--foreground)]">Karan M. <span className="text-red-400">2★</span></span>
                      <span className="text-[var(--text-muted)] truncate max-w-[100px] sm:max-w-[130px]">Service was slow today.</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[7px] text-red-400 font-bold uppercase whitespace-nowrap tracking-wider">
                      Apology Sent
                    </span>
                  </div>

                  <div className="bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] px-3 py-2 rounded-xl flex justify-between items-center gap-3 text-[9.5px]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-bold text-[var(--foreground)]">Rohan S. <span className="text-green-400">5★</span></span>
                      <span className="text-[var(--text-muted)] truncate max-w-[100px] sm:max-w-[130px]">Perfect experience!</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[7px] text-green-400 font-bold uppercase whitespace-nowrap tracking-wider">
                      Google Shared
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card A: Health Index (Top Left - Spaced beautifully for zero overlaps) */}
          <div className="absolute -top-6 lg:-top-12 -left-6 lg:-left-16 z-20 liquid-glass-card dot-grid p-4 w-[140px] lg:w-[155px] hover:scale-[1.08] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl flex flex-col justify-between">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 space-y-2.5 text-left">
              <span className="text-[8.5px] uppercase tracking-wider text-[var(--text-dim)] font-semibold block">Audit Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[var(--foreground)] leading-none font-display">B+</span>
                <span className="text-[9.5px] text-[var(--brand-purple-text)] font-mono font-bold">78/100</span>
              </div>
              <div className="w-full bg-[var(--brand-border)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#9d4edd] to-[#c77dff] h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(157,78,221,0.5)] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Floating Card B: Launch Offer Vouchers (Top Right - Spaced beautifully for zero overlaps) */}
          <div className="absolute -top-4 lg:-top-8 -right-6 lg:-right-16 z-20 liquid-glass-card dot-grid p-4 w-[150px] lg:w-[165px] hover:scale-[1.08] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-2 text-xs flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5 text-[8.5px] text-[var(--brand-purple-text)] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[var(--brand-purple-text)] animate-pulse" />
                Campaign Active
              </div>
              <p className="text-[10px] text-[var(--foreground)] leading-snug font-bold">SORRY20 • 20% off Next Visit</p>
              <div className="text-[8.5px] bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 py-1 rounded text-[var(--brand-purple-text)] font-mono text-center uppercase tracking-wider font-bold shadow-sm">
                Auto-Recovery
              </div>
            </div>
          </div>

          {/* Floating Card C: Customer Star rating (Bottom Right - Spaced beautifully for zero overlaps) */}
          <div className="absolute -bottom-6 lg:-bottom-12 -right-6 lg:-right-16 z-20 liquid-glass-card dot-grid p-4 w-[140px] lg:w-[155px] hover:scale-[1.08] hover:translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-1 text-xs">
              <span className="text-[8.5px] uppercase tracking-wider text-[var(--text-dim)] block font-semibold">Customer Rating</span>
              <div className="text-2xl font-extrabold text-[var(--foreground)] font-display leading-none">4.8</div>
              <div className="flex text-amber-400 gap-0.5 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[8.5px] text-[var(--text-muted)] block font-light pt-1">342 reviews imported</span>
            </div>
          </div>

          {/* Floating Card D: Private Triage Alert (Bottom Left - Spaced beautifully for zero overlaps) */}
          <div className="absolute -bottom-8 lg:-bottom-14 -left-6 lg:-left-16 z-20 liquid-glass-card dot-grid p-4 w-[150px] lg:w-[165px] hover:scale-[1.08] hover:translate-y-1 transition-all duration-300 cursor-pointer shadow-2xl">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                <span className="text-[8.5px] text-red-500 font-bold uppercase tracking-wider">CRITICAL ALARM</span>
              </div>
              <p className="text-[9.5px] text-[var(--text-muted)] font-light leading-snug italic">"Staff was unattentive, waited 20m."</p>
              <span className="text-[8.5px] text-[var(--text-dim)] block font-mono">Service Area A • Floor Alert</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
