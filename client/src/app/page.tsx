"use client";

import React, { useState } from "react";
import { ArrowUpRight, Sun, Moon, ChevronDown, LayoutDashboard, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

// Import modular sub-components
import HeroSection from "../components/HeroSection";
import FeatureGrowth from "../components/FeatureGrowth";
import FeatureInsights from "../components/FeatureInsights";
import AgentLoop from "../components/AgentLoop";
import TriageSimulator from "../components/TriageSimulator";
import FaqAccordion from "../components/FaqAccordion";

// Helper component for interactive footer navigation links with sliding dot animation
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className="group flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all duration-300 hover:pl-2"
      >
        <span className="w-1 h-1 rounded-full bg-[var(--brand-purple-text)] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 flex-shrink-0" />
        <span className="transition-all duration-300">{children}</span>
      </a>
    </li>
  );
}

export default function TableTalkLandingPage() {
  const [activeTab, setActiveTab] = useState("mumbai");
  const [theme, setTheme] = useState("dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none dot-grid transition-colors duration-300">
      
      {/* Background Liquid Purple Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[20%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center border-b border-[var(--brand-border-subtle)] relative z-50 transition-colors duration-300">
        <div className="flex items-center">
          <img 
            src={theme === "dark" ? "/assets/logos/logo_dark.svg" : "/assets/logos/logo_light.svg"} 
            alt="TableTalk" 
            className="h-7 w-auto object-contain transition-all duration-300"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[var(--text-muted)] transition-colors duration-300">
          <a href="#features" className="hover:text-[var(--foreground)] transition-colors">Features</a>
          <a href="#growth-suite" className="hover:text-[var(--foreground)] transition-colors">Growth Suite</a>
          <a href="#insights-suite" className="hover:text-[var(--foreground)] transition-colors">Insights</a>
          <a href="#testimonials" className="hover:text-[var(--foreground)] transition-colors">Customers</a>
        </nav>

        <div className="flex items-center gap-4 relative">

          <a 
            href="/onboard"
            className="px-5 py-2.5 bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer border border-white/5"
          >
            Get a demo
            <ArrowUpRight className="w-4 h-4 text-[#ffffff]" />
          </a>
          
          {/* Explore Suites guest dropdown settings menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-10 px-4 rounded-full border border-[var(--orb-border)] hover:bg-[var(--orb-bg)] flex items-center gap-2 text-xs font-bold text-[var(--foreground)] cursor-pointer transition-all duration-300 shadow-sm outline-none transition-colors"
            >
              <span className="text-[var(--text-muted)] font-medium">Explore Suites</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-dim)] transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] p-2 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn text-left space-y-1">
                  <div className="px-3.5 py-2.5 border-b border-[var(--brand-border)]">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-semibold block">TableTalk for GMs</span>
                    <span className="text-xs font-bold text-[var(--foreground)] block mt-0.5">Manager Control Center</span>
                  </div>
                  
                  <div className="py-1">
                    <a 
                      href="#insights-suite" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--orb-bg)] transition-all duration-200"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[var(--color-brand-purple)] flex-shrink-0" />
                      <div>
                        <span className="font-bold block leading-none">Multi-Unit Insights</span>
                        <span className="text-[8.5px] text-[var(--text-dim)] font-light block mt-1 leading-tight">GM view across all physical outlets</span>
                      </div>
                    </a>
                    <a 
                      href="#triage-simulator" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--orb-bg)] transition-all duration-200"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[var(--color-brand-purple)] flex-shrink-0" />
                      <div>
                        <span className="font-bold block leading-none">Feedback Intercept</span>
                        <span className="text-[8.5px] text-[var(--text-dim)] font-light block mt-1 leading-tight">Private triage routing & alerts</span>
                      </div>
                    </a>
                    <a 
                      href="#growth-suite" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--orb-bg)] transition-all duration-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-purple)] flex-shrink-0" />
                      <div>
                        <span className="font-bold block leading-none">Retention Vouchers</span>
                        <span className="text-[8.5px] text-[var(--text-dim)] font-light block mt-1 leading-tight">SMS & WhatsApp recovery campaigns</span>
                      </div>
                    </a>
                    <a 
                      href="#agent-orchestration" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--orb-bg)] transition-all duration-200"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[var(--color-brand-purple)] flex-shrink-0" />
                      <div>
                        <span className="font-bold block leading-none">SEO Map Booster</span>
                        <span className="text-[8.5px] text-[var(--text-dim)] font-light block mt-1 leading-tight">Auto Google review management</span>
                      </div>
                    </a>
                  </div>

                  <div className="border-t border-[var(--brand-border)] pt-1 mt-1">
                    <button
                      onClick={() => {
                        toggleTheme();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--orb-bg)] transition-all duration-200 cursor-pointer animate-fadeIn"
                    >
                      <div className="flex items-center gap-2.5">
                        {theme === "dark" ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-[var(--brand-border-subtle)] px-2 py-0.5 rounded text-[var(--text-dim)] font-mono font-bold">
                        Toggle
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO PREVIEW BLOCK */}
      <HeroSection />

      {/* ROTATING BADGE SECTION */}
      <section className="py-16 border-y border-[var(--brand-border)] bg-[var(--brand-card)] relative z-10 flex flex-col items-center justify-center overflow-hidden transition-colors duration-300">
        <div className="max-w-4xl px-6 text-center space-y-6">
          <p className="text-lg md:text-xl text-[var(--foreground)]/80 leading-relaxed font-light max-w-2xl mx-auto transition-colors duration-300">
            TableTalk gives you powerful intelligence tools to intercept negative feedback privately and run automated campaigns that retrieve lost diners.
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
                    • Platform For Offline Restaurants • AI Agents Funnel •
                  </textPath>
                </text>
              </svg>
            </div>
            <a 
              href="/onboard"
              className="w-16 h-16 rounded-full bg-[var(--orb-bg)] hover:bg-[var(--orb-border)] flex items-center justify-center transition-all duration-300 transform active:scale-95 border border-[var(--orb-border)] backdrop-blur-md relative overflow-hidden group/orb shadow-2xl"
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
            <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block">Customer Stories</span>
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
          <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-20 pointer-events-none" />
          
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
                  className="w-[420px] mr-6 flex-shrink-0 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-2xl p-6 flex gap-5 items-center text-left relative overflow-hidden backdrop-blur-md hover:border-[var(--orb-border)] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-950/20 rounded-full blur-[30px] pointer-events-none" />
                  
                  {/* Left Side: Mock Restaurant Image Frame */}
                  <div className="w-[110px] h-[140px] bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-xl flex flex-col items-center justify-center text-center p-3 flex-shrink-0 relative overflow-hidden transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-sm mb-1.5 relative z-20 transition-colors duration-300">
                      {item.id}
                    </div>
                    <h5 className="text-[9px] font-bold text-[var(--foreground)] relative z-20 leading-tight truncate w-full transition-colors duration-300">{item.name}</h5>
                    <span className="text-[7.5px] text-[var(--text-muted)] relative z-20 block truncate w-full transition-colors duration-300">{item.location}</span>
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
                          <span className="text-xs font-bold text-[var(--foreground)] block leading-none transition-colors duration-300">{metric.value}</span>
                          <span className="text-[8px] text-[var(--text-dim)] uppercase block mt-1 leading-none transition-colors duration-300">{metric.label}</span>
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
      <footer className="mt-auto bg-[var(--background)] border-t border-[var(--brand-border)] pt-20 pb-12 px-6 md:px-12 text-xs text-[var(--text-dim)] z-10 relative overflow-hidden transition-colors duration-300">
        {/* Soft centered background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[var(--glow-color)] opacity-20 blur-[100px] pointer-events-none rounded-full transition-colors duration-300" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-20">
          
          {/* Top Footer Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
            
            {/* Col 1: Brand details (6 cols) */}
            <div className="col-span-2 md:col-span-6 space-y-5 text-left">
              <div className="flex items-center">
                <img 
                  src={theme === "dark" ? "/assets/logos/logo_dark.svg" : "/assets/logos/logo_light.svg"} 
                  alt="TableTalk" 
                  className="h-7 w-auto object-contain transition-all duration-300"
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed max-w-md transition-colors duration-300">
                Making offline restaurant operations profitable using autonomous AI customer intelligence, private triage loops, and automated retention marketing.
              </p>
            </div>

            {/* Col 2: Product Suites (2 cols) */}
            <div className="col-span-1 md:col-span-2 space-y-4 text-left">
              <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">Product Suites</h5>
              <ul className="space-y-2.5 font-light transition-colors duration-300">
                <FooterLink href="#insights-suite">Multi-Unit Insights</FooterLink>
                <FooterLink href="#triage-simulator">Feedback Intercept</FooterLink>
                <FooterLink href="#growth-suite">Retention Vouchers</FooterLink>
                <FooterLink href="#agent-orchestration">SEO Map Booster</FooterLink>
              </ul>
            </div>

            {/* Col 3: Developer APIs (2 cols) */}
            <div className="col-span-1 md:col-span-2 space-y-4 text-left">
              <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">Developer APIs</h5>
              <ul className="space-y-2.5 font-light transition-colors duration-300">
                <FooterLink href="#api">
                  <span className="flex items-center gap-1.5">
                    API Reference
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  </span>
                </FooterLink>
                <FooterLink href="#docs">Developer Docs</FooterLink>
                <FooterLink href="#status">System Status</FooterLink>
                <FooterLink href="#integrations">Webhook Portal</FooterLink>
              </ul>
            </div>

            {/* Col 4: Company & Trust (2 cols) */}
            <div className="col-span-1 md:col-span-2 space-y-4 text-left">
              <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">Company & Trust</h5>
              <ul className="space-y-2.5 font-light transition-colors duration-300">
                <FooterLink href="#about">About TableTalk</FooterLink>
                <FooterLink href="#security">Security Standards</FooterLink>
                <FooterLink href="#contact">Contact Success</FooterLink>
              </ul>
            </div>

          </div>

          {/* Bottom Footer Section */}
          <div className="border-t border-[var(--brand-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-300">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <p className="font-sans text-[var(--text-muted)] transition-colors duration-300">
                &copy; {new Date().getFullYear()} TableTalk AI. Built with care for offline restaurants in India.
              </p>
              <p className="text-[10px] text-[var(--text-dim)] leading-none mt-0.5 transition-colors duration-300">
                Proudly engineered in Bengaluru & Mumbai 🇮🇳
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[var(--text-dim)] transition-colors duration-300">
              <a href="#privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
              <a href="#security" className="hover:text-[var(--foreground)] transition-colors">Security Standards</a>
              <a href="#cookies" className="hover:text-[var(--foreground)] transition-colors">Cookie Policy</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
