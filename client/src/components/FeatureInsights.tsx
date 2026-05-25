"use client";

import React from "react";
import { TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function FeatureInsights() {
  return (
    <section id="insights-suite" className="py-24 bg-white/[0.01] border-y border-white/[0.04] relative z-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Overlapping Analytics Mockups */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] order-last lg:order-first">
          
          {/* Main Mockup: Google maps local audit */}
          <div className="w-[85%] bg-[#120b22]/90 border border-white/[0.06] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl z-10 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 text-xs text-white/40">
              <span className="font-mono">INTELLIGENCE AGENTS REVIEWS</span>
              <span className="font-bold text-white/60">GOOGLE AUDIT</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white font-bold">Praised Menu Items</span>
                <span className="text-[9px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-green-400 font-bold uppercase font-mono">
                  HIGH IMPACT
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="font-medium">1. Mutton Biryani</span>
                  <span className="text-[#c77dff] font-bold">22 mentions (4.9★)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="font-medium">2. Butter Chicken & Naan</span>
                  <span className="text-[#c77dff] font-bold">14 mentions (4.7★)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04] space-y-2">
                <span className="text-[9px] text-white/40 block uppercase tracking-wider font-semibold">Priority Recommendation</span>
                <p className="text-[11px] text-white/70 italic leading-normal">
                  "Cold food was reported three times this week at Table 4. Consider adding insulated serving trays."
                </p>
              </div>
            </div>
          </div>

          {/* Floating Top Rating Card */}
          <div className="absolute top-[20px] right-[20px] z-20 bg-[#0d0718] border border-white/[0.06] rounded-2xl p-4 w-[210px] shadow-2xl text-left space-y-2 animate-float">
            <span className="text-[8px] uppercase tracking-wider text-white/40 block">Google response rates</span>
            <div className="text-xl font-bold text-white">98% Responded</div>
            <p className="text-[9px] text-white/50 leading-relaxed font-light">
              Replies auto-drafted by Agent #5 and approved with one tap.
            </p>
          </div>

        </div>

        {/* Right Side: Insights Details */}
        <div className="lg:col-span-6 text-left space-y-6">
          <span className="text-xs font-bold text-[#c77dff] uppercase tracking-widest block">TableTalk Insights Suite</span>
          <h3 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight leading-tight">
            Customer intelligence insights across all your restaurant tables
          </h3>
          <p className="text-xs text-white/50 font-sans max-w-md font-light">
            Get deep dashboards detailing food, service, and wait time patterns. Scrape competitive benchmarks automatically and align kitchen operations instantly.
          </p>

          <div className="space-y-6 pt-4">
            
            {/* Bullet 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Maximize repeat diners profitability</h5>
                <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                  Track the NPS index of returning regular customers vs new walk-ins. Optimize menu prices based on positive sentiment thresholds.
                </p>
              </div>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Assess performance at a glance</h5>
                <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                  Watch customer satisfaction indices update week-over-week. Find exactly which waiter or dish drives the best reviews.
                </p>
              </div>
            </div>

            {/* Bullet 3 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Exceed your brand goals</h5>
                <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                  No more manual spreadsheets or guessworks. The recommendation agent translates feedback into structured operational checklists.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <a 
              href="/onboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#070210] text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg shadow-white/5"
            >
              Launch free audit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
