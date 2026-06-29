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
import RatingStep from "@/components/review/RatingStep";
import ReviewFormStep from "@/components/review/ReviewFormStep";
import SuccessStep from "@/components/review/SuccessStep";

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
  const [dinerBirthdate, setDinerBirthdate] = useState("");
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
        diner_email: dinerEmail || null,
        diner_birthdate: dinerBirthdate || null
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
          <RatingStep
            rating={rating}
            setRating={setRating}
            hoverRating={hoverRating}
            setHoverRating={setHoverRating}
            setStep={setStep}
          />
        )}

        {/* STEP 2: REVIEW DETAILS FORM */}
        {step === 2 && (
          <ReviewFormStep
            rating={rating}
            setStep={setStep}
            text={text}
            setText={setText}
            dinerName={dinerName}
            setDinerName={setDinerName}
            visitorType={visitorType}
            setVisitorType={setVisitorType}
            dinerPhone={dinerPhone}
            setDinerPhone={setDinerPhone}
            dinerEmail={dinerEmail}
            setDinerEmail={setDinerEmail}
            dinerBirthdate={dinerBirthdate}
            setDinerBirthdate={setDinerBirthdate}
            dishInput={dishInput}
            setDishInput={setDishInput}
            orderedItems={orderedItems}
            handleAddDish={handleAddDish}
            handleRemoveDish={handleRemoveDish}
            handleKeyDown={handleKeyDown}
            startVoiceRecording={startVoiceRecording}
            isRecording={isRecording}
            isExtracting={isExtracting}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* STEP 3: SUCCESS & VOUCHER REDIRECTION */}
        {step === 3 && (
          <SuccessStep
            rating={rating}
            text={text}
            business={business}
            voucherCode={voucherCode}
            copied={copied}
            handleCopyAndRedirect={handleCopyAndRedirect}
          />
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
