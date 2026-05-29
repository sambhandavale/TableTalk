"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Sun,
  Moon,
  Shield,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

export default function SignInPage() {
  const [theme, setTheme] = useState("dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== "undefined") {
      const storedSlug = localStorage.getItem("tabletalk_restaurant_slug") || 
                         localStorage.getItem("tabletalk_restaurant_id");
      const storedEmail = localStorage.getItem("tabletalk_user_email");
      if (storedSlug && storedEmail) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch("http://localhost:8000/api/onboard/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or security password.");
      }

      // Write session details to storage
      if (typeof window !== "undefined") {
        localStorage.setItem("tabletalk_restaurant_id", data.business?.id || "");
        localStorage.setItem("tabletalk_restaurant_slug", data.business?.slug || "");
        localStorage.setItem("tabletalk_user_email", data.user?.email || email);
      }

      setSuccess(true);
      
      // Navigate to dashboard
      setTimeout(() => {
        const targetId = data.business?.slug || data.business?.id;
        window.location.href = `/dashboard/${targetId}`;
      }, 1500);

    } catch (err: any) {
      setIsSubmitting(false);
      setApiError(err.message || "Could not connect to the backend server. Make sure it is running on port 8000.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none dot-grid transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center relative z-50">
        <a href="/" className="flex items-center gap-1">
          <img 
            src={theme === "dark" ? "/assets/logos/logo_dark.svg" : "/assets/logos/logo_light.svg"} 
            alt="TableTalk" 
            className="h-6 w-auto object-contain transition-all duration-300"
          />
        </a>

        <button
          onClick={toggleTheme}
          className="h-9 px-3.5 rounded-full border border-[var(--orb-border)] bg-[var(--orb-bg)] flex items-center justify-center text-[var(--foreground)] cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600" />
          )}
        </button>
      </header>

      {/* MAIN SPLIT-PANE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-20">
        
        {/* LEFT COLUMN: Visual sidecar */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-[var(--brand-card)] border border-[var(--brand-border)] p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden text-left transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-950/30 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 text-[10px] text-brand-purple-text font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-brand-purple-text" />
              Manager Control Center
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[var(--foreground)] font-sans">
              Welcome back to TableTalk
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-light leading-relaxed">
              Log in to access your operational analytics, manage private triage intercepts, and adjust automated retention marketing campaigns.
            </p>
          </div>

          {/* Quick Metrics display */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--brand-border-subtle)] relative z-10">
            <div>
              <span className="text-[18px] font-extrabold text-[var(--foreground)] block">98%</span>
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block mt-1 font-semibold">Diners Retained</span>
            </div>
            <div>
              <span className="text-[18px] font-extrabold text-[var(--foreground)] block">+45%</span>
              <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block mt-1 font-semibold">Maps SEO growth</span>
            </div>
          </div>

          {/* Mini-features check list */}
          <div className="space-y-2.5 pt-2 relative z-10">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[var(--text-muted)] font-light">Real-Time POS integration syncing</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[var(--text-muted)] font-light">Google Maps Review Scraper loop</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[var(--text-muted)] font-light">WhatsApp apology intercept campaigns</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sign In Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {success ? (
            <div className="w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-3xl p-10 backdrop-blur-xl text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[380px] animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-bounce">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-[var(--foreground)]">Authentication Successful!</h3>
                <p className="text-xs text-[var(--text-muted)] animate-pulse">
                  Redirecting to your control dashboard...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl text-left space-y-6 animate-fadeIn transition-colors duration-300">
              
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[var(--foreground)]">Business Sign In</h2>
                <p className="text-xs text-[var(--text-muted)] font-light">Enter your general manager credentials to enter the workspace.</p>
              </div>

              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-fadeIn">
                  {apiError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Business Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@yourrestaurant.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Security Password</label>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[var(--text-dim)] hover:text-[var(--foreground)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] border border-white/10 text-xs font-bold rounded-xl text-center cursor-pointer transition-all duration-300 shadow-md transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Authenticating Account...
                    </>
                  ) : (
                    <>
                      Sign In to Workspace
                      <ArrowRight className="w-4 h-4 text-[#ffffff]" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 border-t border-[var(--brand-border-subtle)]">
                <p className="text-[10px] text-[var(--text-dim)]">
                  Don't have a business account?{" "}
                  <a href="/onboard" className="text-brand-purple-text font-bold hover:underline">
                    Claim your outlet and register
                  </a>
                </p>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}
