import React from "react";
import { Globe } from "lucide-react";

interface Props {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ReviewPipelineStep({ formData, handleInputChange }: Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          Google Maps Reviews Link
        </label>
        <div className="relative flex items-center">
          <Globe className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="url"
            name="mapsUrl"
            value={formData.mapsUrl}
            onChange={handleInputChange}
            placeholder="https://maps.google.com/?cid=12345"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            required
          />
        </div>
        <span className="text-[12px] text-[var(--text-dim)] block leading-relaxed">
          Must be a valid HTTP or HTTPS link. TableTalk AI Scraper
          will scan public reviews on this business maps node to
          feed your dashboard simulator.
        </span>
      </div>

      {/* Trust indicator bullet point */}
      <div className="p-4 rounded-2xl bg-brand-purple-text/5 border border-brand-purple-text/10 text-[10px] text-[var(--text-muted)] space-y-1">
        <span className="font-bold text-[var(--foreground)] block">
          What happens next?
        </span>
        <p className="font-light leading-relaxed">
          TableTalk launches an asynchronous background audit
          scraper task immediately upon submission. Within 5
          seconds, our review extractor analyzes sentiment logs and
          updates your operational score privately.
        </p>
      </div>
    </div>
  );
}
