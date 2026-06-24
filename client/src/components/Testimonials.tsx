"use client";

import React, { useState } from "react";

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState("mumbai");

  return (
    <section
      id="testimonials"
      className="py-24 bg-white/[0.01] border-t border-white/[0.04] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3 text-left">
          <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">
            Customer Stories
          </span>
          <h3 className="text-3xl sm:text-4xl text-[var(--foreground)] font-extrabold tracking-tight font-sans transition-colors duration-300">
            What our customers say about TableTalk
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/[0.03] border border-white/10 rounded-full p-1 self-start md:self-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTab("mumbai")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "mumbai"
                ? "bg-[#c77dff] text-black shadow-lg shadow-[#c77dff]/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            Retail & Clinics
          </button>
          <button
            onClick={() => setActiveTab("cafes")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "cafes"
                ? "bg-[#c77dff] text-black shadow-lg shadow-[#c77dff]/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            Restaurants & Cafes
          </button>
        </div>
      </div>

      {/* Infinitely Moving Marquee Carousel - Pauses on Hover */}
      <div className="w-full overflow-hidden relative py-4 pause-marquee">
        {/* Fading Glassmorphic Gradients on Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-20 pointer-events-none" />

        {/* Seamless marquee using margin right on items for exact mathematically seamless wrap */}
        <div className="animate-marquee flex">
          {(() => {
            const list =
              activeTab === "mumbai"
                ? [
                    {
                      id: "SK",
                      name: "SkinGlow Clinic",
                      brand: "SkinGlow",
                      location: "Bandra West, Mumbai",
                      quote:
                        "TableTalk intercepted three critical 1-star complaints regarding wait times on our first busy Friday weekend. The patients left happy and our public Google Maps rating soared by +0.3 in weeks!",
                      metrics: [
                        { value: "+45%", label: "Google reviews" },
                        { value: "98%", label: "Patients Retained" },
                      ],
                    },
                    {
                      id: "ST",
                      name: "Style Threads Boutique",
                      brand: "Style Threads",
                      location: "Chembur, Mumbai",
                      quote:
                        "Our weekend walk-in conversions were collapsing due to poor fitting room management. TableTalk flagged the delay pattern. We altered staffing and saw average ticket values climb by +18%!",
                      metrics: [
                        { value: "+18%", label: "Ticket Values" },
                        { value: "-55%", label: "Fitting room delays" },
                      ],
                    },
                    {
                      id: "SS",
                      name: "Serenity Spa",
                      brand: "Serenity Spa",
                      location: "Bandra, Mumbai",
                      quote:
                        "TableTalk's retention campaigns recovered 42 at-risk regular VIP clients via SMS apology coupons last month alone. Dynamic apology dispatches are absolute game-changers.",
                      metrics: [
                        { value: "42 VIPs", label: "Clients Recovered" },
                        { value: "+30%", label: "Loyalty Returns" },
                      ],
                    },
                    {
                      id: "BC",
                      name: "The Bombay Canteen",
                      brand: "Bombay Canteen",
                      location: "Lower Parel, Mumbai",
                      quote:
                        "TableTalk isolated a critical service bottleneck at our peak Sunday brunch. We streamlined the kitchen handoffs and customer satisfaction scores reached an all-time high.",
                      metrics: [
                        { value: "+52%", label: "Reservation Rate" },
                        { value: "95%", label: "Loyalty Score" },
                      ],
                    },
                    {
                      id: "ML",
                      name: "Mahesh Lunch Home",
                      brand: "Mahesh Lunch",
                      location: "Juhu, Mumbai",
                      quote:
                        "Negative feedback about seafood wait times used to go public. Now, TableTalk routes complaints privately, letting us salvage diners before they even leave the table.",
                      metrics: [
                        { value: "+48%", label: "Google Ratings" },
                        { value: "96%", label: "Retention" },
                      ],
                    },
                    {
                      id: "TG",
                      name: "The Golden Spoon",
                      brand: "Golden Spoon",
                      location: "Pali Hill, Bandra",
                      quote:
                        "TableTalk's custom WhatsApp engagement brought back over 80 at-risk regulars who hadn't visited in 30 days. The ROI on our retention campaign was immediate and spectacular.",
                      metrics: [
                        { value: "+62%", label: "Customers Retained" },
                        { value: "94%", label: "NPS Score" },
                      ],
                    },
                  ]
                : [
                    {
                      id: "UC",
                      name: "Urban Chai Co.",
                      brand: "Urban Chai Co",
                      location: "Colaba, Mumbai",
                      quote:
                        "The weekly recommendation agent isolated that our cold bun-maska was causing a rating drop at Table 4. We adjusted waiter paths instantly and our overall health score hit 94%!",
                      metrics: [
                        { value: "+88%", label: "Customer NPS" },
                        { value: "92/100", label: "Health Score" },
                      ],
                    },
                    {
                      id: "CR",
                      name: "Café Royal",
                      brand: "Café Royal",
                      location: "Colaba, Mumbai",
                      quote:
                        "Auto-replying to Google reviews manually took hours of daily effort. TableTalk drafts GMB responses instantly. Posting GMB replies within 2 hours boosted our Maps SEO ranking by 3 slots!",
                      metrics: [
                        { value: "99.2%", label: "Auto-Drafted" },
                        { value: "+3 Slots", label: "Maps Ranking" },
                      ],
                    },
                    {
                      id: "BR",
                      name: "Britannia & Co.",
                      brand: "Britannia & Co",
                      location: "Fort, Mumbai",
                      quote:
                        "Retaining our heritage guests while attracting a younger crowd was a challenge. TableTalk's custom SMS campaigns brought back 120+ legacy patrons in a single month!",
                      metrics: [
                        { value: "+35%", label: "Special Orders" },
                        { value: "97%", label: "Happy Customers" },
                      ],
                    },
                    {
                      id: "LC",
                      name: "Leopold Cafe",
                      brand: "Leopold Cafe",
                      location: "Colaba, Mumbai",
                      quote:
                        "Handling hundreds of walk-ins meant review management fell behind. TableTalk's agent drafts hyper-personalized responses instantly, boosting our local SEO visibility.",
                      metrics: [
                        { value: "+60%", label: "Return Rate" },
                        { value: "99%", label: "Auto-Drafts" },
                      ],
                    },
                    {
                      id: "PB",
                      name: "Pizza By The Bay",
                      brand: "Pizza By The Bay",
                      location: "Marine Lines, Mumbai",
                      quote:
                        "TableTalk's real-time alert system allowed us to address a customer's undercooked crust before they left the table. They ended up leaving a 5-star review!",
                      metrics: [
                        { value: "+40%", label: "Live Feedback" },
                        { value: "98%", label: "Resolution" },
                      ],
                    },
                    {
                      id: "TC",
                      name: "The Chai Lounge",
                      brand: "Chai Lounge",
                      location: "Kemps Corner, Mumbai",
                      quote:
                        "We used to struggle with slow weekday afternoons. TableTalk automatically targeted our loyal cafe workforce with high-conversion vouchers, boosting tea-time visits by 40%.",
                      metrics: [
                        { value: "+45%", label: "Afternoon Sales" },
                        { value: "96%", label: "Happy Guests" },
                      ],
                    },
                  ];

            return list.concat(list).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-[420px] mr-6 flex-shrink-0 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-6 flex gap-5 items-center text-left relative overflow-hidden backdrop-blur-md hover:border-[var(--orb-border)] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-950/20 rounded-full blur-[30px] pointer-events-none" />

                {/* Left Side: Mock Business Image Frame */}
                <div className="w-[110px] h-[140px] bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-xl flex flex-col items-center justify-center text-center p-3 flex-shrink-0 relative overflow-hidden transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-sm mb-1.5 relative z-20 transition-colors duration-300">
                    {item.id}
                  </div>
                  <h5 className="text-[9px] font-bold text-[var(--foreground)] relative z-20 leading-tight truncate w-full transition-colors duration-300">
                    {item.name}
                  </h5>
                  <span className="text-[7.5px] text-[var(--text-muted)] relative z-20 block truncate w-full transition-colors duration-300">
                    {item.location}
                  </span>
                </div>

                {/* Right Side: Quote, logo, metrics */}
                <div className="flex-1 space-y-3.5 relative z-20 text-xs">
                  <div className="text-[var(--color-brand-purple)] font-extrabold text-[10px] uppercase tracking-wider transition-colors duration-300">
                    {item.brand}
                  </div>
                  <p className="text-[10px] text-[var(--foreground)]/80 leading-normal font-light italic transition-colors duration-300">
                    "{item.quote}"
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-[var(--brand-border)] transition-colors duration-300">
                    {item.metrics.map((metric, i) => (
                      <div key={i}>
                        <span className="text-xs font-bold text-[var(--foreground)] block leading-none transition-colors duration-300">
                          {metric.value}
                        </span>
                        <span className="text-[8px] text-[var(--text-dim)] uppercase block mt-1 leading-none transition-colors duration-300">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </section>
  );
}
