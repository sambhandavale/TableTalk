"use client";

import React from "react";
import { TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import OrbitalBackground from "@/components/ui/OrbitalBackground";

export default function FeatureInsights() {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0 blur-[8px] transform scale-110"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, transparent 60%), url("/assets/background/tables3.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#05010a] to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05010a] to-transparent pointer-events-none z-0" />
      <section id="insights-suite" className="py-24 relative z-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Right Side: Orbiting Rings and Skewed Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[600px] order-last lg:order-last w-full">
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center mx-auto lg:mr-auto lg:ml-0">
              {/* Orbital Rings Background */}
              <OrbitalBackground />

              {/* Central Skewed Dashboard Image */}
              <div
                className="absolute top-1/2 left-1/2 z-10 w-[120%] sm:w-[130%] max-w-[550px]"
                style={{
                  transform:
                    "translate(-50%, -50%) perspective(1200px) rotateX(15deg) rotateY(-25deg) rotateZ(4deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="animate-float"
                  style={{ animationDuration: "6s" }}
                >
                  <img
                    src="/assets/ss/ss2.png"
                    alt="TableTalk Insights Dashboard"
                    className="w-full h-auto object-contain rounded-xl opacity-95 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_60px_rgba(157,78,221,0.2)] border border-white/10 bg-[#05010a] p-1"
                  />
                </div>
              </div>

              {/* Floating Card 1: Google response rates */}
              <div
                className="absolute top-1/2 right-150 z-20"
                style={{
                  transform:
                    "translate(-50%, -50%) translateX(240px) translateY(180px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="animate-float"
                  style={{ animationDelay: "2s", animationDuration: "6s" }}
                >
                  <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-4 w-[210px] shadow-2xl text-left space-y-2 hover:scale-[1.05] transition-all duration-300 backdrop-blur-xl">
                    <span className="text-[12px] uppercase tracking-wider text-[var(--text-dim)] block">
                      Google response rates
                    </span>
                    <div className="text-xl font-bold text-[var(--foreground)]">
                      98% Responded
                    </div>
                    <p className="text-[12px] text-[var(--text-muted)] leading-relaxed font-light">
                      Replies auto-drafted by Agent #5 and approved with one
                      tap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Side: Copy & Details */}
          <div className="lg:col-span-6 text-left space-y-6 order-first lg:order-first">
            <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">
              TableTalk Insights Suite
            </span>
            <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight leading-tight transition-colors duration-300">
              Customer intelligence insights across all your business tables
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-sans max-w-md font-light transition-colors duration-300">
              Get deep dashboards detailing food, service, and wait time
              patterns. Scrape competitive benchmarks automatically and align
              kitchen operations instantly.
            </p>

            <div className="space-y-6 pt-4">
              {/* Bullet 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                    Maximize repeat customer profitability
                  </h5>
                  <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                    Track the NPS index of returning regular customers vs new
                    walk-ins. Optimize pricing based on positive sentiment
                    thresholds.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                    Assess performance at a glance
                  </h5>
                  <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                    Watch customer satisfaction indices update week-over-week.
                    Find exactly which staff member or service drives the best
                    reviews.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                    Exceed your brand goals
                  </h5>
                  <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                    No more manual spreadsheets or guessworks. The
                    recommendation agent translates feedback into structured
                    operational checklists.
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
