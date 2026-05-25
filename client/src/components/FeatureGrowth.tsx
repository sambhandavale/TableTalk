"use client";

import React from "react";
import { QrCode, Send, Check, ArrowRight } from "lucide-react";

export default function FeatureGrowth() {
  return (
    <section id="growth-suite" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
      
      {/* Left Side: Growth Suite Details */}
      <div className="lg:col-span-6 text-left space-y-6">
        <span className="text-xs font-bold text-[#c77dff] uppercase tracking-widest block">TableTalk Growth Suite</span>
        <h3 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight leading-tight">
          Achieve better review scores and loyalty response rates
        </h3>
        <p className="text-xs text-white/50 font-sans max-w-md font-light">
          Construct dynamic marketing campaigns on a single, easy-to-use platform. Intercept negative feedback before it goes public, and boost local SEO.
        </p>

        <div className="space-y-6 pt-4">
          
          {/* Bullet 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Create QR reviews tent - fast</h5>
              <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                Generate print-ready unique QR bill-stickers and table tents. Diners scan and review in under 30 seconds.
              </p>
            </div>
          </div>

          {/* Bullet 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Automate triage and discounts</h5>
              <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                Ratings 4-5 are pushed to Google Maps with coupon codes. Ratings 1-3 trigger private captures and notify floor managers.
              </p>
            </div>
          </div>

          {/* Bullet 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#c77dff]">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Tweak and retrieve in real-time</h5>
              <p className="text-xs text-white/60 font-light mt-1 max-w-sm">
                AI dynamically drafts personalized apology text templates with automatic discount codes ready for instant manager approval.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-4">
          <a 
            href="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c77dff] hover:bg-white text-[#070210] text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg shadow-[#c77dff]/10"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Right Side: Layered Dashboard Mockups */}
      <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px]">
        
        {/* Main frame background: Campaign Manager */}
        <div className="w-[85%] bg-[#120b22]/90 border border-white/[0.06] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl z-10">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 mb-4 text-xs text-white/40">
            <span className="font-mono">TABLETALK RETENTION BUILDER</span>
            <span className="font-bold text-[#c77dff]">CAMPAIGNS</span>
          </div>

          <div className="space-y-4 text-left">
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider text-white/40 font-semibold block">Segment Selector</span>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded bg-[#c77dff]/20 border border-[#c77dff]/30 text-[9px] text-[#c77dff] font-bold">
                  At-Risk Customers
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-white/60 font-medium">
                  Lost regular
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider text-white/40 font-semibold block">Campaign Message</span>
              <div className="bg-black/40 border border-white/[0.05] p-3 rounded-xl text-xs text-white/80 font-light leading-normal">
                "We miss you! It's been 21 days since your last order. Here is 15% off your next dining bill on us. Show coupon at floor."
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[8px] text-white/40 block">Estimated Reach</span>
                <span className="text-sm font-bold text-white">42 Diners</span>
              </div>
              <button className="px-3.5 py-1.5 bg-white text-[#070210] font-bold text-[9px] rounded-lg">
                Launch Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Overlapping Performance Graph Mockup */}
        <div className="absolute bottom-[-15px] right-[10px] z-20 bg-[#0d0718] border border-white/[0.06] rounded-2xl p-4 w-[230px] shadow-2xl text-left space-y-3">
          <span className="text-[8px] uppercase tracking-wider text-white/40 font-semibold block">Voucher Redemptions</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">18 Vouchers</span>
            <span className="text-[9px] text-green-400 font-bold font-mono">42.8% Conversion</span>
          </div>
          
          <div className="flex items-end justify-between h-10 gap-1.5 pt-2">
            {[30, 45, 60, 40, 80, 50, 95].map((height, i) => (
              <div key={i} className="flex-1 bg-white/[0.03] rounded-t h-full relative overflow-hidden">
                <div 
                  className="bg-[#c77dff] absolute bottom-0 left-0 right-0 rounded-t" 
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
