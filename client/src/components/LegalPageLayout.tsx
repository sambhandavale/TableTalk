import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function LegalPageLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-8 border-b border-[var(--brand-border-subtle)]">
        <a href="/" className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">{title}</h1>
        <p className="text-sm text-[var(--text-dim)]">Last Updated: {lastUpdated}</p>
      </header>
      <main className="w-full max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8 text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
          {children}
        </div>
      </main>
      <footer className="w-full border-t border-[var(--brand-border-subtle)] py-8 mt-12 text-center text-xs text-[var(--text-dim)]">
        &copy; {new Date().getFullYear()} TableTalk AI. All rights reserved.
      </footer>
    </div>
  );
}
