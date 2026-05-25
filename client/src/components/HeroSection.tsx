"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      
      {/* Left Column: Title & Copy */}
      <div className="lg:col-span-6 text-left space-y-8 animate-fadeIn">

        <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-white font-extrabold max-w-xl">
          Making Offline Restaurant Operations Profitable with AI
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
        
        {/* Constrained Layering Wrapper - Always keeps cards perfectly overlapping the dashboard */}
        <div className="relative w-full max-w-[460px] h-[300px] animate-float">
          
          {/* Central Mockup: Web Dashboard (Landscape Laptop Style) */}
          <div className="absolute inset-0 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-5 shadow-2xl overflow-hidden backdrop-blur-xl z-10 flex flex-col justify-between transition-colors duration-300">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c77dff]/40 to-transparent" />
            
            {/* Browser/Dashboard Header */}
            <div className="flex justify-between items-center border-b border-[var(--brand-border-subtle)] pb-3 text-[10px] text-white/40">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <div className="w-2 h-2 rounded-full bg-green-500/80" />
                <span className="text-[9px] font-mono ml-1.5 opacity-60">dashboard.tabletalk.in/mm-bandra</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-brand-purple-text/10 border border-brand-purple-text/20 text-[8px] text-brand-purple-text font-bold">
                ACTIVE
              </span>
            </div>

            {/* Horizontal Layout Dashboard body */}
            <div className="flex-1 flex gap-4 pt-3 overflow-hidden">
              {/* Micro Sidebar */}
              <div className="w-10 bg-[var(--brand-border-subtle)] border-r border-[var(--brand-border-subtle)] pr-3 flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded bg-[var(--brand-border-subtle)] flex items-center justify-center text-white/40 text-[9px] font-bold">M</div>
                <div className="w-6 h-6 rounded bg-brand-purple-text/10 text-brand-purple-text flex items-center justify-center text-[9px] font-bold">A</div>
                <div className="w-6 h-6 rounded bg-[var(--brand-border-subtle)] flex items-center justify-center text-white/40 text-[9px] font-bold">C</div>
              </div>

              {/* Main Workspace */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden text-left">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[8px] text-white/40 uppercase tracking-wider font-semibold block">Restaurant</span>
                    <h4 className="text-sm font-bold text-white leading-tight">Mumbai Masala Bistro</h4>
                  </div>
                  
                  {/* Compact Stats */}
                  <div className="flex gap-2">
                    <div className="bg-[var(--brand-border-subtle)] border border-[var(--brand-border-subtle)] px-2 py-1 rounded-lg text-center">
                      <span className="text-[7px] text-white/40 uppercase block">NPS</span>
                      <span className="text-xs font-bold text-white block">92%</span>
                    </div>
                    <div className="bg-[var(--brand-border-subtle)] border border-[var(--brand-border-subtle)] px-2 py-1 rounded-lg text-center">
                      <span className="text-[7px] text-white/40 uppercase block">Scans</span>
                      <span className="text-xs font-bold text-white block">342</span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Feed rows */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[8px] text-white/40 block uppercase tracking-wider font-semibold">Triage Feed</span>
                  
                  <div className="bg-red-500/5 border border-red-500/10 px-2 py-1.5 rounded-xl flex justify-between items-center gap-2 text-[9px]">
                    <div>
                      <span className="font-bold text-white">Karan M. <span className="text-red-400">2★</span></span>
                      <span className="text-white/60 ml-2">Cold naan delay.</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[7px] text-red-400 font-bold uppercase whitespace-nowrap">
                      Apology Sent
                    </span>
                  </div>

                  <div className="bg-[var(--brand-border-subtle)] border border-[var(--brand-border-subtle)] px-2 py-1.5 rounded-xl flex justify-between items-center gap-2 text-[9px]">
                    <div>
                      <span className="font-bold text-white">Rohan S. <span className="text-green-400">5★</span></span>
                      <span className="text-white/60 ml-2">Perfect Butter Chicken!</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[7px] text-green-400 font-bold uppercase whitespace-nowrap">
                      Google Shared
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card A: Health Index (Top Left) */}
          <div className="absolute -top-6 -left-8 z-20 liquid-glass-card dot-grid p-3.5 w-[140px] animate-float-delayed">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 space-y-1.5 text-left text-xs">
              <span className="text-[8px] uppercase tracking-wider text-white/40 font-semibold block">Audit Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">B+</span>
                <span className="text-[9px] text-brand-purple-text font-mono font-bold">78/100</span>
              </div>
              <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#9d4edd] to-[#c77dff] h-full w-[78%]" />
              </div>
            </div>
          </div>

          {/* Floating Card B: Launch Offer Vouchers (Top Right) */}
          <div className="absolute -top-4 -right-6 z-20 liquid-glass-card dot-grid p-3.5 w-[150px] animate-float">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-1.5 text-xs flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5 text-[8px] text-brand-purple-text font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-spin" />
                Campaign Active
              </div>
              <p className="text-[10px] text-white leading-tight font-medium">SORRY20 • 20% off Naan</p>
              <div className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono text-center uppercase tracking-wider">
                Auto-Recovery
              </div>
            </div>
          </div>

          {/* Floating Card C: Customer Star rating (Bottom Right) */}
          <div className="absolute -bottom-6 -right-8 z-20 liquid-glass-card dot-grid p-3.5 w-[140px] animate-float-delayed">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-1 text-xs">
              <span className="text-[8px] uppercase tracking-wider text-white/40 block">Diner Rating</span>
              <div className="text-lg font-bold text-white">4.8</div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-2.5 h-2.5 fill-current" />
                ))}
              </div>
              <span className="text-[8px] text-white/50 block font-light">342 reviews imported</span>
            </div>
          </div>

          {/* Floating Card D: Private Triage Alert (Bottom Left) */}
          <div className="absolute -bottom-8 -left-6 z-20 liquid-glass-card dot-grid p-3.5 w-[150px] animate-float">
            <div className="liquid-glass-glow" />
            <div className="relative z-10 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider">CRITICAL ALARM</span>
              </div>
              <p className="text-[9px] text-white/70 font-light leading-snug">"Starters were dry, Naan cold."</p>
              <span className="text-[8px] text-white/40 block font-mono">Table 4 • floor Alert</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
