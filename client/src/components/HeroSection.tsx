"use client";

import React from "react";
import { Sparkles, ArrowUpRight, Star, LayoutDashboard, ShieldAlert } from "lucide-react";
import OrbitalBackground from "@/components/ui/OrbitalBackground";

export default function HeroSection() {
  return (
    <div
      className="relative w-full"
      style={{
        backgroundImage: 'url("/assets/background/tables5.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#05010a]/50 backdrop-blur-[12px] z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#05010a] to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05010a] to-transparent pointer-events-none z-0" />
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

      {/* Right Column: Layered, Floating Dashboard Mockups */}
      <div className="lg:col-span-6 flex items-center justify-center py-20 lg:py-0 relative z-10 min-h-[600px] w-full">
        
        {/* Constrained Layering Wrapper */}
        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center mx-auto lg:ml-auto lg:mr-0">
          
          {/* Orbital Rings Background */}
          <OrbitalBackground />

          {/* Central Skewed Dashboard Image */}
          <div 
            className="absolute top-1/2 left-1/2 z-10 w-[120%] sm:w-[130%] max-w-[550px]"
            style={{
              transform: "translate(-50%, -50%) perspective(1200px) rotateX(15deg) rotateY(-25deg) rotateZ(4deg)",
              transformStyle: "preserve-3d"
            }}
          >
            <div className="animate-float" style={{ animationDuration: '6s' }}>
              <img 
                src="/assets/ss/ss1.png" 
                alt="TableTalk Dashboard" 
                className="w-full h-auto object-contain rounded-xl opacity-95 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_60px_rgba(157,78,221,0.2)] border border-white/10 bg-[#05010a] p-1"
              />
            </div>
          </div>

          {/* Floating Card A: Health Index (Top Left) */}
          <div 
            className="absolute top-1/2 left-1/2 z-20"
            style={{ transform: "translate(-50%, -50%) translateX(-230px) translateY(-190px)", transformStyle: "preserve-3d" }}
          >
            <div className="animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
              <div className="liquid-glass-card dot-grid p-4 w-[165px] hover:scale-[1.08] transition-all duration-300 cursor-pointer shadow-2xl flex flex-col justify-between backdrop-blur-md bg-[#05010a]/60">
                <div className="liquid-glass-glow" />
                <div className="relative z-10 space-y-2.5 text-left">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--text-dim)] font-semibold block">Audit Score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-[var(--foreground)] leading-none font-display">B+</span>
                    <span className="text-[12px] text-[var(--brand-purple-text)] font-mono font-bold">78/100</span>
                  </div>
                  <div className="w-full bg-[var(--brand-border)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#9d4edd] to-[#c77dff] h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(157,78,221,0.5)] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card B: Launch Offer Vouchers (Top Right) */}
          <div 
            className="absolute top-1/2 left-1/2 z-20"
            style={{ transform: "translate(-50%, -50%) translateX(250px) translateY(-140px)", transformStyle: "preserve-3d" }}
          >
            <div className="animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}>
              <div className="liquid-glass-card dot-grid p-4 w-[175px] hover:scale-[1.08] transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-md bg-[#05010a]/60">
                <div className="liquid-glass-glow" />
                <div className="relative z-10 text-left space-y-2 text-xs flex flex-col justify-between h-full">
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--brand-purple-text)] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[var(--brand-purple-text)] animate-pulse" />
                    Campaign Active
                  </div>
                  <p className="text-[10px] text-[var(--foreground)] leading-snug font-bold">SORRY20 • 20% off Next Visit</p>
                  <div className="text-[12px] bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 py-1 rounded text-[var(--brand-purple-text)] font-mono text-center uppercase tracking-wider font-bold shadow-sm">
                    Auto-Recovery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card C: Customer Star rating (Bottom Right) */}
          <div 
            className="absolute top-1/2 left-1/2 z-20"
            style={{ transform: "translate(-50%, -50%) translateX(220px) translateY(170px)", transformStyle: "preserve-3d" }}
          >
            <div className="animate-float" style={{ animationDelay: '0.5s', animationDuration: '5.5s' }}>
              <div className="liquid-glass-card dot-grid p-4 w-[165px] hover:scale-[1.08] transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-md bg-[#05010a]/60">
                <div className="liquid-glass-glow" />
                <div className="relative z-10 text-left space-y-1 text-xs">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--text-dim)] block font-semibold">Customer Rating</span>
                  <div className="text-2xl font-extrabold text-[var(--foreground)] font-display leading-none">4.8</div>
                  <div className="flex text-amber-400 gap-0.5 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[12px] text-[var(--text-muted)] block font-light pt-1">342 reviews imported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card D: Private Triage Alert (Bottom Left) */}
          <div 
            className="absolute top-1/2 left-1/2 z-20"
            style={{ transform: "translate(-50%, -50%) translateX(-210px) translateY(190px)", transformStyle: "preserve-3d" }}
          >
            <div className="animate-float" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }}>
              <div className="liquid-glass-card dot-grid p-4 w-[175px] hover:scale-[1.08] transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-md bg-[#05010a]/60">
                <div className="liquid-glass-glow" />
                <div className="relative z-10 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                    <span className="text-[12px] text-red-500 font-bold uppercase tracking-wider">CRITICAL ALARM</span>
                  </div>
                  <p className="text-[12px] text-[var(--text-muted)] font-light leading-snug italic">"Staff was unattentive, waited 20m."</p>
                  <span className="text-[12px] text-[var(--text-dim)] block font-mono">Service Area A • Floor Alert</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    </div>
  );
}
