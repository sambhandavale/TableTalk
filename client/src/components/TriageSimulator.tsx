"use client";

import React, { useState } from "react";
import { Star, ShieldAlert, Sparkles, Send, ArrowRight, Share2, ShieldCheck, HeartHandshake } from "lucide-react";

export default function TriageSimulator() {
  const [rating, setRating] = useState(5);
  const [dinerName, setDinerName] = useState("Rohan");
  const [orderedItem, setOrderedItem] = useState("Premium Service");
  const [smsSent, setSmsSent] = useState(false);

  return (
    <section id="triage-simulator" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-10 border-t border-[var(--brand-border)] text-left font-sans transition-colors duration-300">
      
      {/* Title Explainer Block */}
      <div className="max-w-3xl mb-16 space-y-3">
        <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">Core Funnel Mechanic</span>
        <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight transition-colors duration-300">
          How Unhappy Customers are Intercepted Privately, While Happy Customers Boost Your Google Presence
        </h3>
        <p className="text-xs text-[var(--text-muted)] font-sans max-w-lg font-light leading-relaxed transition-colors duration-300">
          The smart QR triage engine splits feedback based on ratings. Happy customers are routed online to drive public ratings. Unhappy customers are intercepted privately so you can rescue them before they leave.
        </p>
      </div>

      {/* Main Interactive Visual split workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* LEFT COLUMN: INTERACTIVE DINER DEVICE (The Input) */}
        <div className="lg:col-span-4 liquid-glass-card dot-grid p-6 flex flex-col justify-between h-full border border-[var(--brand-border)] bg-[var(--brand-card)] transition-colors duration-300">
          <div className="liquid-glass-glow" />
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--brand-border)] transition-colors duration-300">
              <span className="text-[9px] uppercase tracking-wider text-[var(--text-dim)] font-mono font-bold transition-colors duration-300">Customer Device Screen</span>
              <span className="text-[8px] bg-[var(--brand-border-subtle)] px-2 py-0.5 rounded text-[var(--text-muted)] font-mono transition-colors duration-300">QR Scan (Zone A)</span>
            </div>

            {/* Star selector */}
            <div className="space-y-3">
              <label className="text-xs text-[var(--text-muted)] block font-medium transition-colors duration-300">1. Tap a star to rate your experience today:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setSmsSent(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      star <= rating 
                        ? rating >= 4 
                          ? "bg-green-500/10 border-green-400 text-green-400" 
                          : "bg-red-500/10 border-red-400 text-red-400"
                        : "bg-[var(--brand-border-subtle)] border-[var(--brand-border)] text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[var(--text-dim)] block text-[9px] uppercase tracking-wide transition-colors duration-300">Customer Name</span>
                  <input 
                    type="text" 
                    value={dinerName}
                    onChange={(e) => setDinerName(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--brand-border)] focus:border-brand-purple-text p-2.5 rounded-lg text-[var(--foreground)] outline-none transition-colors duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[var(--text-dim)] block text-[9px] uppercase tracking-wide transition-colors duration-300">Product / Service</span>
                  <select 
                    value={orderedItem}
                    onChange={(e) => setOrderedItem(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--brand-border)] p-2.5 rounded-lg text-[var(--foreground)] outline-none transition-colors duration-300"
                  >
                    <option>Premium Service</option>
                    <option>Standard Package</option>
                    <option>Walk-in Visit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[var(--text-dim)] block text-[9px] uppercase tracking-wide transition-colors duration-300">Customer Comment (Optional)</span>
                <textarea 
                  rows={2}
                  disabled
                  value={rating <= 3 ? "Wait took too long, service was poor." : "Service was fantastic and highly professional!"}
                  className="w-full bg-[var(--background)] border border-[var(--brand-border)] text-[var(--foreground)]/80 p-2.5 rounded-lg outline-none resize-none font-sans transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--brand-border)] text-[10px] text-[var(--text-muted)] leading-normal transition-colors duration-300">
            {rating >= 4 ? (
              <span className="text-green-400 font-medium">✔ Currently simulating Happy Customer flow.</span>
            ) : (
              <span className="text-red-400 font-medium">⚠ Currently simulating Complaint Triage flow.</span>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: THE SMART TRIAGE SPLITTER (Google Boost vs Private Capture Node) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* PATH A: AUTOMATED GOOGLE SEO BOOST (Pushes 4-5 Stars) */}
          <div className={`liquid-glass-card dot-grid p-6 flex flex-col justify-between transition-all duration-300 border ${
            rating >= 4 
              ? "border-green-500/60 bg-green-500/[0.02] shadow-[0_0_30px_rgba(74,222,128,0.08)] scale-[1.01]" 
              : "border-[var(--brand-border)] bg-[var(--brand-card)] opacity-45"
          }`}>
            <div className="liquid-glass-glow" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[8px] bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-green-400 font-mono font-bold uppercase tracking-wider">
                  Public SEO Boost Route
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">Automated Google Maps Boost</h4>
                <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed transition-colors duration-300">
                  Positive score detected. The customer is automatically prompted to paste their {rating}-star rating onto Google. To incentivize them, a dynamic loyalty coupon is sent:
                </p>
              </div>

              {/* Reward Coupon Display */}
              <div className="bg-[var(--background)] border border-[var(--brand-border)] p-4 rounded-xl flex items-center justify-between gap-4 transition-colors duration-300">
                <div className="text-left font-sans text-xs">
                  <span className="text-[8px] text-[var(--text-dim)] uppercase block transition-colors duration-300">Customer Coupon Reward</span>
                  <span className="text-sm font-bold text-[var(--foreground)] font-mono uppercase block tracking-wider mt-0.5 transition-colors duration-300">DELICIOUS15</span>
                  <span className="text-[8.5px] text-green-400 block mt-0.5">Show at desk for 15% OFF next bill</span>
                </div>
                <span className="px-3 py-1.5 bg-green-500 text-black text-[9px] font-bold rounded-lg uppercase tracking-wider font-mono">
                  Google Shared
                </span>
              </div>

              {/* Operational impact */}
              <div className="pt-2 border-t border-[var(--brand-border)] text-[9.5px] text-[var(--text-muted)] space-y-1.5 transition-colors duration-300">
                <span className="font-semibold text-[var(--foreground)]/70 block uppercase tracking-wider text-[8px] transition-colors duration-300">Business Result:</span>
                <p className="leading-relaxed">📈 Skyrockets your public Google Map reviews count by up to <strong>40%</strong>, lifting local SEO search ranking prominence without marketing budgets.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--brand-border)] text-[9px] text-[var(--text-dim)] font-mono transition-colors duration-300">
              Redirect Route: google.com/maps/review/mm-bandra
            </div>
          </div>

          {/* PATH B: PRIVATE MANAGEMENT RESCUE LOOP (Intercepts 1-3 Stars) */}
          <div className={`liquid-glass-card dot-grid p-6 flex flex-col justify-between transition-all duration-300 border ${
            rating <= 3 
              ? "border-red-500/60 bg-red-500/[0.02] shadow-[0_0_30px_rgba(239,68,68,0.08)] scale-[1.01]" 
              : "border-[var(--brand-border)] bg-[var(--brand-card)] opacity-45"
          }`}>
            <div className="liquid-glass-glow" />
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[8px] bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-red-400 font-mono font-bold uppercase tracking-wider">
                  Private Intercept Route
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[var(--foreground)] transition-colors duration-300">Private Customer Rescue Loop</h4>
                <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed transition-colors duration-300">
                  Negative rating intercepted privately. An alarm raises instantly on the owner's dashboard and a custom apologetic SMS recovery voucher is drafted:
                </p>
              </div>

              {/* Apology Text Display */}
              <div className="bg-[var(--background)] border border-[var(--brand-border)] p-3.5 rounded-xl space-y-2 transition-colors duration-300">
                <div className="flex justify-between items-center text-[8.5px]">
                  <span className="text-brand-purple-text font-bold uppercase tracking-wider">Agent #2 apology SMS template</span>
                  <span className="text-[var(--text-dim)] transition-colors duration-300">To: +91 99999 88888</span>
                </div>
                
                <p className="text-[10px] text-[var(--foreground)]/80 italic leading-relaxed font-sans transition-colors duration-300">
                  "Dear {dinerName}, we apologize deeply for the delay regarding your {orderedItem}. Please accept voucher SORRY20 for a free add-on next time."
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-[var(--brand-border)] transition-colors duration-300">
                  {!smsSent ? (
                    <button
                      onClick={() => setSmsSent(true)}
                      className="px-3 py-1 bg-red-500 text-black text-[9px] font-bold rounded hover:bg-red-400 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Dispatch Apology SMS
                    </button>
                  ) : (
                    <span className="text-[9px] text-green-400 font-bold animate-pulse">✓ Voucher Sent via Twilio Gateway</span>
                  )}
                  <span className="text-[8.5px] text-[var(--text-dim)] uppercase font-mono transition-colors duration-300">Apology Voucher: SORRY20</span>
                </div>
              </div>

              {/* Operational impact */}
              <div className="pt-2 border-t border-[var(--brand-border)] text-[9.5px] text-[var(--text-muted)] space-y-1.5 transition-colors duration-300">
                <span className="font-semibold text-[var(--foreground)]/70 block uppercase tracking-wider text-[8px] transition-colors duration-300">Business Result:</span>
                <p className="leading-relaxed">🛡 Intercepts complaints **privately** before they leak onto public Google listings. Converts disgruntled visitors into loyal repeat customers.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--brand-border)] text-[9px] text-[var(--text-dim)] font-mono transition-colors duration-300">
              Alert Dispatched: manager-alarm@tabletalk.in
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
