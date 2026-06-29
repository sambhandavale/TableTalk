"use client";

import React from "react";
import { QrCode, Send, Check, ArrowRight } from "lucide-react";
import OrbitalBackground from "@/components/ui/OrbitalBackground";

export default function FeatureGrowth() {
  return (
    <section
      id="growth-suite"
      className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
    >
      {/* Right Side: Growth Suite Details */}
      <div className="lg:col-span-6 text-left space-y-6 order-first lg:order-last">
        <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">
          TableTalk Growth Suite
        </span>
        <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight leading-tight transition-colors duration-300">
          Achieve better review scores and loyalty response rates
        </h3>
        <p className="text-xs text-[var(--text-muted)] font-sans max-w-md font-light transition-colors duration-300">
          Construct dynamic marketing campaigns on a single, easy-to-use
          platform. Intercept negative feedback before it goes public, and boost
          local SEO.
        </p>

        <div className="space-y-6 pt-4">
          {/* Bullet 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                Smart QR & Private Feedback
              </h5>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                Generate print-ready unique QR stands and stickers. Customers
                scan and review in under 30 seconds before leaving the premises.
              </p>
            </div>
          </div>

          {/* Bullet 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                Dynamic AI Rewards & Triage
              </h5>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                Smart sentiment routing pushes 4-5 stars to Google Maps.
                Negative feedback triggers private alerts and dispatches
                stock-managed apology coupons automatically.
              </p>
            </div>
          </div>

          {/* Bullet 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] flex items-center justify-center flex-shrink-0 text-[#c77dff] transition-colors duration-300">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">
                Targeted Retention Campaigns
              </h5>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm transition-colors duration-300">
                Our CRM tracks customers by phone to segment them (Regulars,
                At-Risk, Lost). Launch scheduled SMS campaigns with attached
                incentives in seconds.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <a
            href="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c77dff] hover:bg-[var(--foreground)] hover:text-[var(--background)] text-[#070210] text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg shadow-[#c77dff]/10"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Left Side: Orbiting Rings and Skewed Mockup */}
      <div className="lg:col-span-6 relative flex items-center justify-center min-h-[600px] w-full order-last lg:order-first">
        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center mx-auto lg:mr-auto lg:ml-0">
          {/* Orbital Rings Background */}
          <OrbitalBackground />

          {/* Central Dashboard Image */}
          <div
            className="absolute top-1/2 left-1/2 z-10 w-[120%] sm:w-[130%] max-w-[580px]"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="" style={{ animationDuration: "6s" }}>
              <img
                src="/assets/mockup.png"
                alt="TableTalk Growth Mockup"
                className="w-full h-auto object-contain p-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
