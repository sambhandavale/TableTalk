"use client";

import React from "react";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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

export default function Footer({ theme }: { theme: string }) {
  return (
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
                src={
                  theme === "dark"
                    ? "/assets/logos/logo_dark.svg"
                    : "/assets/logos/logo_light.svg"
                }
                alt="TableTalk"
                className="h-7 w-auto object-contain transition-all duration-300"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed max-w-sm transition-colors duration-300">
              Making offline business operations profitable using autonomous
              AI customer intelligence, private triage loops, and automated
              retention marketing.
            </p>
          </div>

          {/* Col 2: Product Suites (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">
              Product Suites
            </h5>
            <ul className="space-y-2.5 font-light transition-colors duration-300">
              <FooterLink href="#insights-suite">
                Multi-Unit Insights
              </FooterLink>
              <FooterLink href="#triage-simulator">
                Feedback Intercept
              </FooterLink>
              <FooterLink href="#growth-suite">Retention Vouchers</FooterLink>
              <FooterLink href="#agent-orchestration">
                SEO Map Booster
              </FooterLink>
            </ul>
          </div>

          {/* Col 3: Developer APIs (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">
              Developer APIs
            </h5>
            <ul className="space-y-2.5 font-light transition-colors duration-300">
              <FooterLink href="/api-docs">
                <span className="flex items-center gap-1.5">
                  API Reference
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </span>
              </FooterLink>
              <FooterLink href="/developer">Developer Docs</FooterLink>
              <FooterLink href="/status">System Status</FooterLink>
              <FooterLink href="/webhooks">Webhook Portal</FooterLink>
            </ul>
          </div>

          {/* Col 4: Company & Trust (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider transition-colors duration-300">
              Company & Trust
            </h5>
            <ul className="space-y-2.5 font-light transition-colors duration-300">
              <FooterLink href="/about">About TableTalk</FooterLink>
              <FooterLink href="/security">Security Standards</FooterLink>
              <FooterLink href="mailto:hello@tabletalk.com">
                Contact Success
              </FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="border-t border-[var(--brand-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-300">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <p className="font-sans text-[var(--text-muted)] transition-colors duration-300">
              &copy; {new Date().getFullYear()} TableTalk AI. Built with care
              for offline businesses in India.
            </p>
            <p className="text-[10px] text-[var(--text-dim)] leading-none mt-0.5 transition-colors duration-300">
              Proudly engineered in Mumbai 🇮🇳
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[var(--text-dim)] transition-colors duration-300">
            <a
              href="/privacy"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/security"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Security Standards
            </a>
            <a
              href="/cookies"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
