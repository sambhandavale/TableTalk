"use client";

import React from "react";
import { TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function FeatureInsights() {
  return (
    <div 
      className="relative w-full"
      style={{
        backgroundImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, transparent 60%), url("/assets/background/tables3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#05010a] to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05010a] to-transparent pointer-events-none z-0" />
      <section id="insights-suite" className="py-24 relative z-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Overlapping Analytics Mockups */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] order-last lg:order-first">
          
          {/* Main Mockup: Google maps local audit */}
          <div className="w-[85%] bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl z-10 text-left space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-center border-b border-[var(--brand-border)] pb-4 text-xs text-[var(--text-dim)] transition-colors duration-300">
              <span className="font-mono">INTELLIGENCE AGENTS REVIEWS</span>
              <span className="font-bold text-[var(--text-muted)] transition-colors duration-300">GOOGLE AUDIT</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[var(--foreground)] font-bold transition-colors duration-300">Top Rated Offerings</span>
                <span className="text-[9px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-green-400 font-bold uppercase font-mono">
                  HIGH IMPACT
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] transition-colors duration-300">
                  <span className="font-medium">1. Customer Service</span>
                  <span className="text-brand-purple-text font-bold transition-colors duration-300">22 mentions (4.9★)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] transition-colors duration-300">
                  <span className="font-medium">2. Wait Time & Ambience</span>
                  <span className="text-brand-purple-text font-bold transition-colors duration-300">14 mentions (4.7★)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--brand-border)] space-y-2 transition-colors duration-300">
                <span className="text-[9px] text-[var(--text-dim)] block uppercase tracking-wider font-semibold transition-colors duration-300">Priority Recommendation</span>
                <p className="text-[11px] text-[var(--foreground)]/70 italic leading-normal transition-colors duration-300">
                  "Service delays were reported three times this week at the front desk. Consider adding an additional staff member during peak hours."
                </p>
              </div>
            </div>
          </div>

          {/* Floating Top Rating Card */}
          <div className="absolute top-[20px] right-[20px] z-20 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-4 w-[210px] shadow-2xl text-left space-y-2 animate-float transition-colors duration-300">
            <span className="text-[8px] uppercase tracking-wider text-[var(--text-dim)] block transition-colors duration-300">Google response rates</span>
            <div className="text-xl font-bold text-[var(--foreground)] transition-colors duration-300">98% Responded</div>
            <p className="text-[9px] text-[var(--text-muted)] leading-relaxed font-light transition-colors duration-300">
              Replies auto-drafted by Agent #5 and approved with one tap.
            </p>
          </div>

        </div>

        {/* Right Side: Copy & Details */}
        <div className="lg:col-span-6 text-left space-y-6 bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">TableTalk Insights Suite</span>
          <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight leading-tight transition-colors duration-300">
            Customer intelligence insights across all your business tables
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-sans max-w-md font-light transition-colors duration-300">
            Get deep dashboards detailing food, service, and wait time patterns. Scrape competitive benchmarks automatically and align kitchen operations instantly.
          </p>

          <div className="space-y-6 pt-4">
            
            {/* Bullet 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">Maximize repeat customer profitability</h5>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                  Track the NPS index of returning regular customers vs new walk-ins. Optimize pricing based on positive sentiment thresholds.
                </p>
              </div>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">Assess performance at a glance</h5>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                  Watch customer satisfaction indices update week-over-week. Find exactly which staff member or service drives the best reviews.
                </p>
              </div>
            </div>

            {/* Bullet 3 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">Exceed your brand goals</h5>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                  No more manual spreadsheets or guessworks. The recommendation agent translates feedback into structured operational checklists.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-4">
            <a 
              href="/onboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg transition-colors duration-300"
            >
              Launch free audit
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
    </div>
  );
}
