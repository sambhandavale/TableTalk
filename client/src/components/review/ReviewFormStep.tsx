import React from "react";
import { Star, Smile, AlertTriangle, X, Plus, ChevronRight, Mic, Loader2 } from "lucide-react";

interface Props {
  rating: number;
  setStep: (s: number) => void;
  text: string;
  setText: (t: string) => void;
  dinerName: string;
  setDinerName: (n: string) => void;
  visitorType: "first-time" | "returning";
  setVisitorType: (v: "first-time" | "returning") => void;
  dinerPhone: string;
  setDinerPhone: (p: string) => void;
  dinerEmail: string;
  setDinerEmail: (e: string) => void;
  dinerBirthdate: string;
  setDinerBirthdate: (b: string) => void;
  dishInput: string;
  setDishInput: (d: string) => void;
  orderedItems: string[];
  handleAddDish: (e?: React.FormEvent) => void;
  handleRemoveDish: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  startVoiceRecording: () => void;
  isRecording: boolean;
  isExtracting: boolean;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export default function ReviewFormStep({
  rating,
  setStep,
  text, setText,
  dinerName, setDinerName,
  visitorType, setVisitorType,
  dinerPhone, setDinerPhone,
  dinerEmail, setDinerEmail,
  dinerBirthdate, setDinerBirthdate,
  dishInput, setDishInput,
  orderedItems, handleAddDish, handleRemoveDish, handleKeyDown,
  startVoiceRecording, isRecording, isExtracting,
  handleSubmit, isSubmitting
}: Props) {
  return (
    <div className="py-5 space-y-5 animate-fadeIn">
      {/* Selected Star Display */}
      <div className="flex items-center justify-between bg-[#1e293b]/20 border border-[#1e293b] px-3 py-2">
        <span className="text-xs text-[#cbd5e1] font-semibold">Selected Rating</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#334155]"}`} 
              />
            ))}
          </div>
          <button 
            onClick={() => setStep(1)} 
            className="text-[12px] text-[#a855f7] hover:underline font-bold uppercase tracking-wider ml-2"
          >
            Change
          </button>
        </div>
      </div>

      {/* Private Intercept Header Alert */}
      {rating <= 3 ? (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-3 flex gap-2">
          <AlertTriangle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#ef4444]">Private Intercept Active</h4>
            <p className="text-[12px] text-[#f87171] leading-relaxed">
              We sincerely apologize that we fell short. Your feedback is sent directly to the owner privately so we can correct this immediately.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#10b981]/10 border border-[#10b981]/30 p-3 flex gap-2">
          <Smile className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#10b981]">Unlock Milestone Rewards!</h4>
            <p className="text-[12px] text-[#34d399] leading-relaxed">
              We are thrilled! Share your feedback below. If you reach a review milestone, you'll instantly unlock an exclusive reward coupon!
            </p>
          </div>
        </div>
      )}

      {/* Form Inputs */}
      <div className="space-y-3.5 relative">
        {/* Voice Recording Button */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={startVoiceRecording}
            disabled={isRecording || isExtracting}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-full border transition-all ${
              isRecording 
                ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                : isExtracting
                  ? "bg-[#a855f7]/20 border-[#a855f7] text-[#a855f7]"
                  : "bg-[#1e293b]/50 border-[#1e293b] text-[#cbd5e1] hover:bg-[#a855f7]/10 hover:border-[#a855f7] hover:text-[#a855f7]"
            }`}
          >
            {isExtracting ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Mic className={`w-8 h-8 ${isRecording ? "animate-bounce" : ""}`} />
            )}
          </button>
          <div className="text-center absolute w-full top-20 pointer-events-none">
            {isRecording && <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-[#05020a] px-2 py-0.5">Listening... Speak now</span>}
            {isExtracting && <span className="text-[10px] text-[#a855f7] font-bold uppercase tracking-widest bg-[#05020a] px-2 py-0.5">Extracting AI details...</span>}
          </div>
        </div>
        <div className="text-center pb-2">
          <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">Tap to auto-fill form with voice, tell us what you ate and how was it.</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={dinerName}
              onChange={(e) => setDinerName(e.target.value)}
              className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Visitor Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisitorType("first-time")}
                className={`py-2 text-[10px] font-bold uppercase tracking-wider border rounded-none transition-colors ${
                  visitorType === "first-time"
                    ? "bg-[#a855f7]/10 border-[#a855f7] text-[#a855f7]"
                    : "border-[#1e293b] text-[#64748b] hover:bg-[#1e293b]/20"
                }`}
              >
                First-Time
              </button>
              <button
                type="button"
                onClick={() => setVisitorType("returning")}
                className={`py-2 text-[10px] font-bold uppercase tracking-wider border rounded-none transition-colors ${
                  visitorType === "returning"
                    ? "bg-[#a855f7]/10 border-[#a855f7] text-[#a855f7]"
                    : "border-[#1e293b] text-[#64748b] hover:bg-[#1e293b]/20"
                }`}
              >
                Returning
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Phone Number (For rewards)</label>
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={dinerPhone}
              onChange={(e) => setDinerPhone(e.target.value)}
              className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={dinerEmail}
              onChange={(e) => setDinerEmail(e.target.value)}
              className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold">Date of Birth (Optional)</label>
            <input
              type="date"
              value={dinerBirthdate}
              onChange={(e) => setDinerBirthdate(e.target.value)}
              className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors custom-date-input"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">What dishes did you order?</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {orderedItems.map((dish, idx) => (
              <span 
                key={idx} 
                className="text-[10px] bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#c084fc] pl-2 pr-1.5 py-0.5 flex items-center gap-1"
              >
                {dish}
                <button 
                  type="button" 
                  onClick={() => handleRemoveDish(idx)}
                  className="hover:text-white"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Type dish & hit Enter (e.g. Filter Coffee)"
              value={dishInput}
              onChange={(e) => setDishInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
            />
            <button
              type="button"
              onClick={() => handleAddDish()}
              className="p-2 border-y border-r border-[#1e293b] bg-[#1e293b]/50 hover:bg-[#a855f7] hover:text-black transition-colors rounded-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block">
            {rating <= 3 ? "What could we have improved?" : "Tell us what you loved!"}
          </label>
          <textarea
            placeholder={rating <= 3 ? "Starters were cold, service was delayed, etc." : "Biryani was exceptionally aromatic, polite hospitality, amazing atmosphere!"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-[#0c0516] border border-[#1e293b] p-3 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none min-h-[80px] leading-snug resize-none transition-colors"
          />
        </div>
      </div>

      {/* Submission Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border transition-all ${
          isSubmitting
            ? "bg-[#1e293b]/50 border-[#1e293b] text-[#64748b] cursor-not-allowed"
            : "bg-white text-black border-white hover:bg-transparent hover:text-white"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-none animate-spin" />
            Submitting Feedback...
          </>
        ) : (
          <>
            Submit Review
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
