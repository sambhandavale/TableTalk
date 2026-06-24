"use client";

import React from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

interface HeaderProps {
  theme: string;
  isScrolled: boolean;
  isLoggedIn: boolean;
  userEmail: string;
  userSlug: string;
  authDropdownOpen: boolean;
  setAuthDropdownOpen: (open: boolean) => void;
}

export default function Header({
  theme,
  isScrolled,
  isLoggedIn,
  userEmail,
  userSlug,
  authDropdownOpen,
  setAuthDropdownOpen,
}: HeaderProps) {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out flex justify-center pointer-events-none ${
        isScrolled ? "pt-4 px-4" : "pt-0 px-0"
      }`}
    >
      <header
        className={`relative w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center transition-all duration-500 ease-out pointer-events-auto ${
          isScrolled
            ? "py-3 bg-[var(--background)]/70 backdrop-blur-xl border border-[var(--brand-border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            : "py-6 bg-transparent border-b border-[var(--brand-border-subtle)] rounded-none shadow-none"
        }`}
      >
        {/* Left Side: Logo */}
        <div className="flex items-center relative z-20">
          <img
            src={
              theme === "dark"
                ? "/assets/logos/logo_dark.svg"
                : "/assets/logos/logo_light.svg"
            }
            alt="TableTalk"
            className="h-7 w-auto object-contain transition-all duration-300"
          />
        </div>

        {/* Center Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-10">
          <a
            href="#triage-simulator"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] font-bold transition-colors"
          >
            Platform
          </a>
          <a
            href="#growth-suite"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] font-bold transition-colors"
          >
            Growth Suite
          </a>
          <a
            href="#testimonials"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] font-bold transition-colors"
          >
            Customer Stories
          </a>
        </div>

        {/* Navigation Buttons Container */}
        <div className="flex items-center gap-3 relative z-20">
          {/* Dynamic Authentication Portal */}
          <div className="relative">
            <button
              onClick={() => {
                setAuthDropdownOpen(!authDropdownOpen);
              }}
              className="h-10 px-5 flex-shrink-0 rounded-full border border-[var(--orb-border)] bg-[var(--orb-bg)] hover:bg-[var(--orb-border)] hover:border-[var(--text-muted)] flex items-center gap-2.5 text-xs font-bold text-[var(--foreground)] cursor-pointer transition-all duration-300 shadow-sm outline-none"
            >
              <span className="text-[var(--text-muted)] font-medium">
                {isLoggedIn ? "Account Hub" : "Sign In"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[var(--text-dim)] transition-transform duration-300 ${authDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {authDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setAuthDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-68 rounded-2xl bg-[var(--brand-card)] border border-[var(--brand-border)] p-2 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn text-left">
                  <div className="p-3 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-xl space-y-2.5">
                    {isLoggedIn ? (
                      <>
                        <div className="space-y-0.5">
                          <span className="text-[8px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">
                            General Manager
                          </span>
                          <span className="text-xs font-extrabold text-[var(--foreground)] block truncate">
                            {userEmail}
                          </span>
                        </div>
                        <a
                          href={`/dashboard/${userSlug}`}
                          onClick={() => setAuthDropdownOpen(false)}
                          className="w-full py-2 bg-gradient-to-r from-[#c77dff] to-[#9d4edd] text-black hover:opacity-95 rounded-lg text-[10px] font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-1 cursor-pointer border border-purple-300/10"
                        >
                          Go to Dashboard
                          <ArrowUpRight className="w-3 h-3 text-black" />
                        </a>
                        <button
                          onClick={() => {
                            setAuthDropdownOpen(false);
                            if (typeof window !== "undefined") {
                              localStorage.removeItem(
                                "tabletalk_restaurant_id",
                              );
                              localStorage.removeItem(
                                "tabletalk_restaurant_slug",
                              );
                              localStorage.removeItem("tabletalk_user_email");
                              window.location.reload();
                            }
                          }}
                          className="w-full text-center text-[9px] text-red-400 hover:underline pt-0.5 block cursor-pointer"
                        >
                          Sign Out of Session
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-0.5">
                          <span className="text-[8px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">
                            GM Control Hub
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] font-light block leading-tight">
                            Access review scraper audits & campaigns
                          </span>
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <a
                            href="/onboard"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="w-full py-2 bg-gradient-to-r from-[var(--brand-purple-text)] to-[#9d4edd] text-white hover:opacity-95 rounded-lg text-[10px] font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-1 cursor-pointer border border-white/5"
                          >
                            Get started
                            <ArrowUpRight className="w-3 h-3 text-white" />
                          </a>
                          <a
                            href="/signin"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="w-full py-2 bg-transparent text-[var(--foreground)] hover:bg-[var(--orb-bg)] border border-[var(--brand-border)] rounded-lg text-[10px] font-bold transition-all duration-300 flex items-center justify-center cursor-pointer"
                          >
                            Sign In to Account
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
