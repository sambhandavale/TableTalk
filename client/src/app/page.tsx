"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

// Import modular sub-components
import HeroSection from "../components/HeroSection";
import FeatureGrowth from "../components/FeatureGrowth";
import FeatureInsights from "../components/FeatureInsights";
import AgentLoop from "../components/AgentLoop";
import TriageSimulator from "../components/TriageSimulator";
import FaqAccordion from "../components/FaqAccordion";
import Header from "../components/Header";
import RotatingBadge from "../components/RotatingBadge";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function TableTalkLandingPage() {
  const [theme, setTheme] = useState("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSlug, setUserSlug] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSlug =
        localStorage.getItem("tabletalk_restaurant_slug") ||
        localStorage.getItem("tabletalk_restaurant_id");
      const storedEmail = localStorage.getItem("tabletalk_user_email");
      if (storedSlug && storedEmail) {
        setIsLoggedIn(true);
        setUserSlug(storedSlug);
        setUserEmail(storedEmail);
        // Seamlessly auto-redirect GM to their active control center
        window.location.href = `/dashboard/${storedSlug}`;
      }
    }
  }, []);

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

      {/* Invisible placeholder to prevent layout shift */}
      <div
        className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 border-b border-transparent invisible pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-7" />
      </div>

      {/* Floating Header Container */}
      <Header
        theme={theme}
        isScrolled={isScrolled}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userSlug={userSlug}
        authDropdownOpen={authDropdownOpen}
        setAuthDropdownOpen={setAuthDropdownOpen}
      />

      {/* HERO PREVIEW BLOCK */}
      <HeroSection />

      {/* ROTATING BADGE SECTION */}
      <RotatingBadge />

      {/* PRODUCT FEATURES & SUITES */}
      <FeatureGrowth />
      <FeatureInsights />

      {/* COOPERATIVE AGENT ORCHESTRATION LOOP */}
      <AgentLoop />

      {/* STATEFUL INTERACTIVE SIMULATOR */}
      <TriageSimulator />

      {/* CUSTOMER TESTIMONIAL STORIES */}
      <Testimonials />

      {/* STATEFUL QNA ACCORDION CHALLENGES */}
      <FaqAccordion />

      {/* FOOTER */}
      <Footer theme={theme} />
    </div>
  );
}
