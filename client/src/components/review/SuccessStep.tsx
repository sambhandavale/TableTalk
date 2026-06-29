import React from "react";
import { CheckCircle, Smile, Copy, ExternalLink, ArrowRight } from "lucide-react";

interface Props {
  rating: number;
  text: string;
  business: any;
  voucherCode: string;
  copied: boolean;
  handleCopyAndRedirect: () => void;
}

export default function SuccessStep({ rating, text, business, voucherCode, copied, handleCopyAndRedirect }: Props) {
  return (
    <div className="py-6 flex flex-col items-center text-center space-y-6 animate-fadeIn">
      {/* Header Success Icon */}
      <div className="w-12 h-12 bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
        <CheckCircle className="w-6 h-6 text-[#10b981]" />
      </div>

      <div className="space-y-1">
        <h2 className="text-md font-bold text-white">Review Submitted Successfully!</h2>
        <p className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
          Thank you for your valuable feedback
        </p>
      </div>

      {/* DYNAMIC FUNNEL REDIRECTION MODAL CARD FOR 4-5 STAR REVIEWS */}
      {rating >= 4 ? (
        <div className="w-full bg-[#1e293b]/20 border border-[#1e293b] p-4 flex flex-col items-center space-y-4">
          <div className="flex gap-2 items-start text-left">
            <Smile className="w-5 h-5 text-[#a855f7] mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white">Share on Google!</h4>
              <p className="text-[12px] text-[#94a3b8] leading-relaxed">
                As a thank you, copy your review text to your clipboard and paste it on Google Maps to support our business!
              </p>
            </div>
          </div>

          <div className="w-full p-2 bg-[#0c0516] border border-[#1e293b] text-left">
            <p className="text-[10px] text-[#cbd5e1] leading-snug italic line-clamp-3">
              "{text}"
            </p>
          </div>

          <button
            onClick={handleCopyAndRedirect}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border transition-all ${
              copied 
                ? "bg-[#10b981]/20 border-[#10b981] text-[#10b981]"
                : "bg-[#a855f7] border-[#a855f7] text-black hover:bg-transparent hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Text Copied! Opening Google Maps...
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy & Paste on Google Maps
                <ExternalLink className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      ) : (
        // 1-3 Star Private Intercept Apology Message
        <p className="text-xs text-[#94a3b8] leading-relaxed max-w-xs">
          Your comments have been compiled and sent straight to the business owner. Our team has already been notified to rectify this immediately. We appreciate your helpful feedback.
        </p>
      )}

      {/* Voucher Card Code Box */}
      {voucherCode && (
        <div className="w-full bg-gradient-to-r from-[#a855f7]/10 to-[#10b981]/5 border border-[#1e293b] p-4 flex flex-col items-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--brand-purple-text)]/10 flex items-center justify-center rounded-none font-mono text-[12px] uppercase tracking-widest text-[var(--brand-purple-text)]">
            Gift
          </div>
          <span className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Your Milestone Reward Voucher</span>
          <div className="text-lg font-mono font-bold tracking-widest text-white border-2 border-dashed border-[#1e293b] px-4 py-1.5 bg-[#05020a]">
            {voucherCode}
          </div>
          <span className="text-[12px] text-[#64748b] uppercase tracking-widest mt-1">Show this screen on your next visit to redeem!</span>
        </div>
      )}

      <button
        onClick={() => window.location.reload()}
        className="text-[#64748b] hover:text-white text-[12px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
      >
        Submit another review <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
