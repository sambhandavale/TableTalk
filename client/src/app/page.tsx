"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

// Import modular sub-components
import HeroSection from "../components/HeroSection";
import FeatureGrowth from "../components/FeatureGrowth";
import FeatureInsights from "../components/FeatureInsights";
import AgentLoop from "../components/AgentLoop";
import TriageSimulator from "../components/TriageSimulator";
import FaqAccordion from "../components/FaqAccordion";

export default function TableTalkLandingPage() {
  const [activeTab, setActiveTab] = useState("mumbai");

  return (
    <div className="relative min-h-screen bg-[#070210] text-white overflow-hidden flex flex-col font-sans select-none dot-grid">
      
      {/* Background Liquid Purple Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center border-b border-white/[0.04] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
            T
          </div>
          <div>
            <h1 className="text-xl tracking-wider leading-none text-white font-extrabold">TABLETALK</h1>
            <p className="text-[8px] text-white/50 tracking-widest font-semibold uppercase">AI Customer Intelligence</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#growth-suite" className="hover:text-white transition-colors">Growth Suite</a>
          <a href="#insights-suite" className="hover:text-white transition-colors">Insights</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Customers</a>
        </nav>

        <a 
          href="/onboard"
          className="px-5 py-2.5 bg-white text-[#070210] hover:bg-white/90 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 shadow-md shadow-white/5 flex items-center gap-1.5 cursor-pointer"
        >
          Get a demo
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </header>

      {/* HERO PREVIEW BLOCK */}
      <HeroSection />

      {/* ROTATING BADGE SECTION */}
      <section className="py-16 border-y border-white/[0.04] bg-[#0c0516]/40 relative z-10 flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-4xl px-6 text-center space-y-6">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light max-w-2xl mx-auto">
            TableTalk gives you powerful intelligence tools to intercept negative feedback privately and run automated campaigns that retrieve lost diners.
          </p>
          
          <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
            <div className="absolute w-full h-full animate-[spin_12s_linear_infinite] select-none text-[7px] font-mono tracking-widest text-[#c77dff]">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path
                  id="badgePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                />
                <text className="fill-current uppercase">
                  <textPath href="#badgePath" startOffset="0%">
                    • Platform For Offline Restaurants • AI Agents Funnel •
                  </textPath>
                </text>
              </svg>
            </div>
            <a 
              href="/onboard"
              className="w-16 h-16 rounded-full bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-300 transform active:scale-95 border border-white/10 backdrop-blur-md relative overflow-hidden group/orb shadow-2xl"
              style={{
                boxShadow: "inset 0 4px 12px rgba(255, 255, 255, 0.05), inset 0 -4px 12px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(199, 125, 255, 0.15)"
              }}
            >
              {/* Glass Highlight Arc */}
              <div className="absolute top-1 left-2 w-5 h-2.5 bg-white/15 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient(circle at 50% 120%, rgba(199, 125, 255, 0.25), transparent 70%)" />
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT FEATURES & SUITES */}
      <FeatureGrowth />
      <FeatureInsights />

      {/* COOPERATIVE AGENT ORCHESTRATION LOOP */}
      <AgentLoop />

      {/* STATEFUL INTERACTIVE SIMULATOR */}
      <TriageSimulator />

      {/* CUSTOMER TESTIMONIAL STORIES */}
      <section id="testimonials" className="py-24 bg-white/[0.01] border-t border-white/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 text-left">
            <span className="text-xs font-bold text-[#c77dff] uppercase tracking-widest block">Customer Stories</span>
            <h3 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight font-sans">
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
              Mumbai Outlets
            </button>
            <button
              onClick={() => setActiveTab("cafes")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === "cafes"
                  ? "bg-[#c77dff] text-black shadow-lg shadow-[#c77dff]/20"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Cafes & Lounges
            </button>
          </div>
        </div>

        {/* Infinitely Moving Marquee Carousel - Pauses on Hover */}
        <div className="w-full overflow-hidden relative py-4 pause-marquee">
          {/* Fading Glassmorphic Gradients on Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#070210] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#070210] to-transparent z-20 pointer-events-none" />
          
          {/* Seamless marquee using margin right on items for exact mathematically seamless wrap */}
          <div className="animate-marquee flex">
            {(() => {
              const list = activeTab === "mumbai" 
                ? [
                    {
                      id: "SG",
                      name: "Spice Garden Bistro",
                      brand: "Spice Garden",
                      location: "Bandra West, Mumbai",
                      quote: "TableTalk intercepted three critical 1-star complaints regarding service delays on our first busy Friday weekend. The diners left happy and our public Google Maps rating soared by +0.3 in weeks!",
                      metrics: [
                        { value: "+45%", label: "Google reviews" },
                        { value: "98%", label: "Diners Retained" }
                      ]
                    },
                    {
                      id: "GD",
                      name: "Golden Dragon Dhaba",
                      brand: "Golden Dragon",
                      location: "Chembur, Mumbai",
                      quote: "Our weekend takeaway orders were collapsing due to dry starters. TableTalk flagged the tandoor delay pattern. We altered prep and saw average ticket values climb by +18%!",
                      metrics: [
                        { value: "+18%", label: "Ticket Values" },
                        { value: "-55%", label: "Starters delays" }
                      ]
                    },
                    {
                      id: "BK",
                      name: "Bandra Kebab Co",
                      brand: "Bandra Kebab Co",
                      location: "Bandra, Mumbai",
                      quote: "TableTalk's retention campaigns recovered 42 at-risk regular VIP diners via SMS apology coupons last month alone. Dynamic apology dispatches are absolute game-changers.",
                      metrics: [
                        { value: "42 VIPs", label: "Diners Recovered" },
                        { value: "+30%", label: "Loyalty Returns" }
                      ]
                    },
                    {
                      id: "BC",
                      name: "The Bombay Canteen",
                      brand: "Bombay Canteen",
                      location: "Lower Parel, Mumbai",
                      quote: "TableTalk isolated a critical service bottleneck at our peak Sunday brunch. We streamlined the kitchen handoffs and customer satisfaction scores reached an all-time high.",
                      metrics: [
                        { value: "+52%", label: "Reservation Rate" },
                        { value: "95%", label: "Loyalty Score" }
                      ]
                    },
                    {
                      id: "ML",
                      name: "Mahesh Lunch Home",
                      brand: "Mahesh Lunch",
                      location: "Juhu, Mumbai",
                      quote: "Negative feedback about seafood wait times used to go public. Now, TableTalk routes complaints privately, letting us salvage diners before they even leave the table.",
                      metrics: [
                        { value: "+48%", label: "Google Ratings" },
                        { value: "96%", label: "Retention" }
                      ]
                    },
                    {
                      id: "TG",
                      name: "The Golden Spoon",
                      brand: "Golden Spoon",
                      location: "Pali Hill, Bandra",
                      quote: "TableTalk's custom WhatsApp engagement brought back over 80 at-risk regulars who hadn't visited in 30 days. The ROI on our retention campaign was immediate and spectacular.",
                      metrics: [
                        { value: "+62%", label: "Diners Retained" },
                        { value: "94%", label: "NPS Score" }
                      ]
                    }
                  ]
                : [
                    {
                      id: "UC",
                      name: "Urban Chai Co.",
                      brand: "Urban Chai Co",
                      location: "Colaba, Mumbai",
                      quote: "The weekly recommendation agent isolated that our cold bun-maska was causing a rating drop at Table 4. We adjusted waiter paths instantly and our overall health score hit 94%!",
                      metrics: [
                        { value: "+88%", label: "Customer NPS" },
                        { value: "92/100", label: "Health Score" }
                      ]
                    },
                    {
                      id: "CR",
                      name: "Café Royal",
                      brand: "Café Royal",
                      location: "Colaba, Mumbai",
                      quote: "Auto-replying to Google reviews manually took hours of daily effort. TableTalk drafts GMB responses instantly. Posting GMB replies within 2 hours boosted our Maps SEO ranking by 3 slots!",
                      metrics: [
                        { value: "99.2%", label: "Auto-Drafted" },
                        { value: "+3 Slots", label: "Maps Ranking" }
                      ]
                    },
                    {
                      id: "BR",
                      name: "Britannia & Co.",
                      brand: "Britannia & Co",
                      location: "Fort, Mumbai",
                      quote: "Retaining our heritage guests while attracting a younger crowd was a challenge. TableTalk's custom SMS campaigns brought back 120+ legacy patrons in a single month!",
                      metrics: [
                        { value: "+35%", label: "Parsi Chai Orders" },
                        { value: "97%", label: "Happy Diners" }
                      ]
                    },
                    {
                      id: "LC",
                      name: "Leopold Cafe",
                      brand: "Leopold Cafe",
                      location: "Colaba, Mumbai",
                      quote: "Handling hundreds of walk-ins meant review management fell behind. TableTalk's agent drafts hyper-personalized responses instantly, boosting our local SEO visibility.",
                      metrics: [
                        { value: "+60%", label: "Return Rate" },
                        { value: "99%", label: "Auto-Drafts" }
                      ]
                    },
                    {
                      id: "PB",
                      name: "Pizza By The Bay",
                      brand: "Pizza By The Bay",
                      location: "Marine Lines, Mumbai",
                      quote: "TableTalk's real-time alert system allowed us to address a customer's undercooked crust before they left the table. They ended up leaving a 5-star review!",
                      metrics: [
                        { value: "+40%", label: "Live Feedback" },
                        { value: "98%", label: "Resolution" }
                      ]
                    },
                    {
                      id: "TC",
                      name: "The Chai Lounge",
                      brand: "Chai Lounge",
                      location: "Kemps Corner, Mumbai",
                      quote: "We used to struggle with slow weekday afternoons. TableTalk automatically targeted our loyal cafe workforce with high-conversion vouchers, boosting tea-time visits by 40%.",
                      metrics: [
                        { value: "+45%", label: "Afternoon Sales" },
                        { value: "96%", label: "Happy Guests" }
                      ]
                    }
                  ];
              
              return list.concat(list).map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`} 
                  className="w-[420px] mr-6 flex-shrink-0 bg-[#120b22]/60 border border-white/[0.06] rounded-2xl p-6 flex gap-5 items-center text-left relative overflow-hidden backdrop-blur-md hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-950/20 rounded-full blur-[30px] pointer-events-none" />
                  
                  {/* Left Side: Mock Restaurant Image Frame */}
                  <div className="w-[110px] h-[140px] bg-white/5 border border-white/[0.08] rounded-xl flex flex-col items-center justify-center text-center p-3 flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm mb-1.5 relative z-20">
                      {item.id}
                    </div>
                    <h5 className="text-[9px] font-bold text-white relative z-20 leading-tight truncate w-full">{item.name}</h5>
                    <span className="text-[7.5px] text-white/50 relative z-20 block truncate w-full">{item.location}</span>
                  </div>

                  {/* Right Side: Quote, logo, metrics */}
                  <div className="flex-1 space-y-3.5 relative z-20 text-xs">
                    <div className="text-[#c77dff] font-extrabold text-[10px] uppercase tracking-wider">
                      {item.brand}
                    </div>
                    <p className="text-[10px] text-white/80 leading-normal font-light italic">
                      "{item.quote}"
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/[0.04]">
                      {item.metrics.map((metric, i) => (
                        <div key={i}>
                          <span className="text-xs font-bold text-white block leading-none">{metric.value}</span>
                          <span className="text-[8px] text-white/40 uppercase block mt-1 leading-none">{metric.label}</span>
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

      {/* STATEFUL QNA ACCORDION CHALLENGES */}
      <FaqAccordion />

      {/* FOOTER */}
      <footer className="mt-auto bg-[#070210] border-t border-white/[0.04] py-12 px-6 md:px-12 text-center text-xs text-white/30 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
              T
            </div>
            <span className="text-sm tracking-wider text-white font-extrabold uppercase">TABLETALK</span>
          </div>

          <p className="font-sans text-white/40">
            &copy; {new Date().getFullYear()} TableTalk AI. Built for offline restaurants in India.
          </p>

          <div className="flex items-center gap-4 text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-300">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
