"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Star, 
  Smile, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Plus, 
  X, 
  ChevronRight, 
  ArrowRight,
  Mic,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CustomerReviewPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [business, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review Form States
  const [step, setStep] = useState(1); // 1: Rating, 2: Feedback Details, 3: Success/Voucher
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [visitorType, setVisitorType] = useState<"first-time" | "returning">("first-time");
  const [dinerName, setDinerName] = useState("");
  const [dinerPhone, setDinerPhone] = useState("");
  const [dinerEmail, setDinerEmail] = useState("");
  const [dishInput, setDishInput] = useState("");
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");

  // Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      setIsExtracting(true);

      try {
        const resp = await fetch("http://localhost:8000/api/reviews/extract-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.diner_name && data.diner_name !== "Anonymous") setDinerName(data.diner_name);
          if (data.visitor_type) setVisitorType(data.visitor_type);
          if (data.ordered_items && data.ordered_items.length > 0) setOrderedItems((prev) => [...new Set([...prev, ...data.ordered_items])]);
          if (data.cleaned_review_text) setText(data.cleaned_review_text);
        }
      } catch (err) {
        console.error("Failed to extract voice data", err);
      } finally {
        setIsExtracting(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Fetch business details on load
  useEffect(() => {
    if (!slug) return;
    const fetchRestaurant = async () => {
      try {
        const resp = await fetch(`http://localhost:8000/api/dashboard/${slug}`);
        if (!resp.ok) throw new Error("Business not found");
        const data = await resp.json();
        setRestaurant(data.business);
        
        // Track the scan
        try {
          await fetch(`http://localhost:8000/api/dashboard/track-scan/${data.business.id}`, {
            method: "POST"
          });
        } catch (e) {
          console.error("Failed to track scan", e);
        }
      } catch (err: any) {
        console.error(err);
        setError("We couldn't locate this business. Please check the scan code or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [slug]);

  const handleAddDish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = dishInput.trim();
    if (trimmed && !orderedItems.includes(trimmed)) {
      setOrderedItems([...orderedItems, trimmed]);
      setDishInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddDish();
    }
  };

  const handleRemoveDish = (indexToRemove: number) => {
    setOrderedItems(orderedItems.filter((_, i) => i !== indexToRemove));
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a855f7", "#c084fc", "#e9d5ff"]
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#a855f7", "#c084fc", "#e9d5ff"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please leave a brief comment about your experience.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const reviewPayload = {
        restaurant_slug: slug,
        rating,
        text,
        ordered_items: orderedItems,
        visitor_type: visitorType,
        diner_name: dinerName || "Anonymous",
        diner_phone: dinerPhone || null,
        diner_email: dinerEmail || null
      };

      const resp = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload)
      });

      if (!resp.ok) throw new Error("Submission failed");
      const data = await resp.json();

      setVoucherCode(data.triage?.reward_code || "");
      setSubmitSuccess(true);
      setStep(3);

      if (rating >= 4) {
        triggerConfetti();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAndRedirect = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    // Redirect to Google Maps review page
    const mapsUrl = business?.maps_url || "https://maps.google.com";
    
    setTimeout(() => {
      window.open(mapsUrl, "_blank", "noopener,noreferrer");
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05020a] text-white">
        <div className="w-10 h-10 border-2 border-[#1e293b] border-t-[#a855f7] rounded-none animate-spin mb-4" />
        <span className="text-xs text-[#64748b] tracking-wider uppercase font-semibold">Aligning workspace...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#05020a] text-white px-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#ef4444]" />
        <h2 className="text-lg font-bold">Business Not Found</h2>
        <p className="text-xs text-[#94a3b8] max-w-sm leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#a855f7]/20 border border-[#a855f7] hover:bg-[#a855f7] hover:text-black transition-colors rounded-none text-xs font-bold uppercase tracking-widest"
        >
          Retry Scan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05020a] text-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden selection:bg-[#a855f7]/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#a855f7]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#10b981]/5 blur-[150px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-[#0c0516]/80 backdrop-blur-xl border border-[#1e293b] p-6 relative z-10 flex flex-col rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center space-y-3 border-b border-[#1e293b] pb-5 pt-2">
          <img src="/assets/logos/logo_dark.svg" alt="TableTalk" className="h-4 w-auto opacity-80" />
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              {business?.name}
            </h1>
            <p className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold">
              {business?.cuisine} • {business?.location}
            </p>
          </div>
        </div>

        {/* STEP 1: RATING SELECTION */}
        {step === 1 && (
          <div className="py-6 flex flex-col items-center space-y-6 animate-fadeIn">
            <h2 className="text-sm font-semibold text-center text-[#cbd5e1]">
              How was your experience with us today?
            </h2>
            
            {/* Interactive Glowing Stars */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRating(star);
                    setStep(2);
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-95 duration-100 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-[#f59e0b] fill-[#f59e0b] filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : "text-[#334155]"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#64748b] uppercase tracking-wider text-center">
              Tap a star to begin your review
            </p>
          </div>
        )}

        {/* STEP 2: REVIEW DETAILS FORM */}
        {step === 2 && (
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
                  className="text-[9px] text-[#a855f7] hover:underline font-bold uppercase tracking-wider ml-2"
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
                  <p className="text-[9.5px] text-[#f87171] leading-relaxed">
                    We sincerely apologize that we fell short. Your feedback is sent directly to the owner privately so we can correct this immediately.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 p-3 flex gap-2">
                <Smile className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#10b981]">Unlock Milestone Rewards!</h4>
                  <p className="text-[9.5px] text-[#34d399] leading-relaxed">
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
              
              {/* Diner Name & Visitor Segment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={dinerName}
                    onChange={(e) => setDinerName(e.target.value)}
                    className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Visitor Status</label>
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

              {/* Email & Phone Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Phone Number (For rewards)</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={dinerPhone}
                    onChange={(e) => setDinerPhone(e.target.value)}
                    className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={dinerEmail}
                    onChange={(e) => setDinerEmail(e.target.value)}
                    className="w-full bg-[#0c0516] border border-[#1e293b] p-2 text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none transition-colors"
                  />
                </div>
              </div>

              {/* Multi-Select Tags for Dishes Ordered */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">What dishes did you order?</label>
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

              {/* Review Text Area */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold block">
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
        )}

        {/* STEP 3: SUCCESS & VOUCHER REDIRECTION */}
        {step === 3 && (
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
                    <p className="text-[9.5px] text-[#94a3b8] leading-relaxed">
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
                <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--brand-purple-text)]/10 flex items-center justify-center rounded-none font-mono text-[9px] uppercase tracking-widest text-[var(--brand-purple-text)]">
                  Gift
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-bold">Your Milestone Reward Voucher</span>
                <div className="text-lg font-mono font-bold tracking-widest text-white border-2 border-dashed border-[#1e293b] px-4 py-1.5 bg-[#05020a]">
                  {voucherCode}
                </div>
                <span className="text-[8px] text-[#64748b] uppercase tracking-widest mt-1">Show this screen on your next visit to redeem!</span>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="text-[#64748b] hover:text-white text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              Submit another review <ArrowRight className="w-3 h-3" />
            </button>

          </div>
        )}

      </div>

      {/* Styled Inline FadeIn Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
