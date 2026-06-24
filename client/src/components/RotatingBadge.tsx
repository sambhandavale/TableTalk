"use client";

import React from "react";

export default function RotatingBadge() {
  return (
    <section className="py-16 border-y border-[var(--brand-border)] bg-[var(--brand-card)] relative z-10 flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
      <div className="max-w-4xl px-6 text-center space-y-6">
        <p className="text-lg md:text-xl text-[var(--foreground)]/80 leading-relaxed font-light max-w-2xl mx-auto transition-colors duration-300">
          TableTalk gives you powerful intelligence tools to intercept
          negative feedback privately and run automated campaigns that
          retrieve lost diners.
        </p>

        <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
          <div className="absolute w-full h-full animate-[spin_12s_linear_infinite] select-none text-[7px] font-mono tracking-widest text-[var(--color-brand-purple)]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path
                id="badgePath"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="none"
              />
              <text className="fill-current uppercase">
                <textPath href="#badgePath" startOffset="0%">
                  • Platform For Offline Businesses • AI Agents Funnel •
                </textPath>
              </text>
            </svg>
          </div>
          <a
            href="/onboard"
            className="w-16 h-16 rounded-full bg-[var(--orb-bg)] hover:bg-[var(--orb-border)] flex items-center justify-center transition-all duration-300 transform active:scale-95 border border-[var(--orb-border)] backdrop-blur-md relative overflow-hidden group/orb shadow-2xl"
            style={{
              boxShadow:
                "inset 0 4px 12px rgba(255, 255, 255, 0.05), inset 0 -4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(199, 125, 255, 0.15)",
            }}
          >
            {/* Glass Highlight Arc */}
            <div className="absolute top-1 left-2 w-5 h-2.5 bg-white/15 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient(circle at 50% 120%, rgba(199, 125, 255, 0.25), transparent 70%)" />
          </a>
        </div>
      </div>
    </section>
  );
}
