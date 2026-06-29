"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  MapPin,
  Utensils,
  CheckCircle,
  Eye,
  EyeOff,
  Layers,
  Globe,
  Users,
  ChevronDown,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import AccountSetupStep from "@/components/onboard/AccountSetupStep";
import BusinessProfileStep from "@/components/onboard/BusinessProfileStep";
import ReviewPipelineStep from "@/components/onboard/ReviewPipelineStep";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [apiError, setApiError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ownerName: "",
    restaurantName: "",
    cuisine: "Indian Fusion",
    location: "",
    seatingCapacity: 60,
    mapsUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Stepper Validations
  const isStep1Valid = () => {
    return (
      formData.email.includes("@") &&
      formData.password.length >= 6 &&
      formData.ownerName.trim() !== ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.restaurantName.trim() !== "" && formData.location.trim() !== ""
    );
  };

  const isStep3Valid = () => {
    return (
      formData.mapsUrl.startsWith("http://") ||
      formData.mapsUrl.startsWith("https://")
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
      setApiError("");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setApiError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch("http://localhost:8000/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.restaurantName,
          cuisine: formData.cuisine,
          location: formData.location,
          owner_contact: formData.ownerName,
          maps_url: formData.mapsUrl,
          seating_capacity: Number(formData.seatingCapacity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "An onboarding error occurred. Please try again.",
        );
      }

      // Simulate a premium AI Audit scan sequence (visual loader)
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "tabletalk_restaurant_id",
            data.business?.id || "",
          );
          localStorage.setItem(
            "tabletalk_restaurant_slug",
            data.business?.slug || "",
          );
          localStorage.setItem(
            "tabletalk_user_email",
            data.account?.email || formData.email,
          );
        }
        setIsSubmitting(false);
        setSuccessData(data);
        setStep(4);
      }, 4000);
    } catch (err: any) {
      setIsSubmitting(false);
      setApiError(
        err.message ||
          "Could not connect to the backend server. Make sure it is running on port 8000.",
      );
    }
  };

  return (
    <div
      className="relative min-h-screen text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none transition-colors duration-300"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 15%, transparent 30%), url("/assets/background/tables1.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Liquid Purple Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center relative z-50">
        <a href="/" className="flex items-center gap-1">
          <img
            src="/assets/logos/logo_dark.svg"
            alt="TableTalk"
            className="h-6 w-auto object-contain transition-all duration-300"
          />
        </a>
      </header>

      {/* MAIN SPLIT-PANE WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        {/* LEFT COLUMN: Visual sidecar (6 spans) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12 bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden text-left transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-950/30 rounded-full blur-[50px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[var(--foreground)]">
              Claim Your Outlet & Initialize AI Triage
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-light leading-relaxed">
              Create your business account to sync POS terminals, deploy review
              scraping agents, and set up negative feedback intercepts
              automatically.
            </p>
          </div>

          {/* Setup Progress Steps indicator */}
          <div className="space-y-4 pt-4 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">
              Onboarding Progress
            </span>
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    step > 1
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : step === 1
                        ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text"
                        : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                  }`}
                >
                  {step > 1 ? "✓" : "1"}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block leading-none ${step >= 1 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}
                  >
                    Create Account
                  </span>
                  <span className="text-[12px] text-[var(--text-dim)] block mt-0.5">
                    Secure credential mapping
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    step > 2
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : step === 2
                        ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text"
                        : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                  }`}
                >
                  {step > 2 ? "✓" : "2"}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block leading-none ${step >= 2 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}
                  >
                    Outlet Settings
                  </span>
                  <span className="text-[12px] text-[var(--text-dim)] block mt-0.5">
                    Business details & capacity
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                    step > 3
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : step === 3
                        ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text"
                        : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                  }`}
                >
                  {step > 3 ? "✓" : "3"}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block leading-none ${step >= 3 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}
                  >
                    Google Maps Scan
                  </span>
                  <span className="text-[12px] text-[var(--text-dim)] block mt-0.5">
                    Scraper review hook dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Miniature Testimonial Card */}
          <div className="p-4 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-2xl relative z-10">
            <span className="text-[12px] uppercase tracking-wider text-[var(--brand-purple-text)] font-extrabold block">
              Spice Garden Bistro
            </span>
            <p className="text-[10px] text-[var(--text-muted)] italic font-light mt-1.5 leading-relaxed">
              "We deployed TableTalk last month and it intercepted three
              critical 1-star complaints regarding service delays on Bandra
              West. Diners left happy and Google Maps rating climbed!"
            </p>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--brand-border-subtle)]">
              <span className="text-[12px] font-bold text-[var(--foreground)]">
                Amit K.
              </span>
              <span className="text-[12px] text-[var(--text-dim)]">
                • General Manager
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Stepper Form (7 spans) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Submitting Spinner screen */}
          {isSubmitting ? (
            <div className="w-full bg-black/40 border border-white/10 rounded-3xl p-10 backdrop-blur-md text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--foreground)] animate-pulse">
                  Dispatched AI Audit Agent...
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-light max-w-sm mx-auto leading-relaxed">
                  Scanning Google Reviews at{" "}
                  <span className="font-mono text-brand-purple-text block mt-1 truncate">
                    {formData.mapsUrl}
                  </span>
                </p>
              </div>

              {/* Fake agent log activity terminal block */}
              <div className="w-full max-w-md bg-black/60 border border-[var(--brand-border)] rounded-xl p-3 text-left font-mono text-[12px] text-slate-300 space-y-1.5 overflow-hidden h-24">
                <div className="text-purple-400">
                  &gt; Initializing audit_agent.py on business_id: pending
                </div>
                <div className="text-slate-400">
                  &gt; Hooking Google Maps web scraper pipeline
                </div>
                <div className="text-yellow-400">
                  &gt; [Gemini] extract review themes and metrics...
                </div>
                <div className="text-green-400">
                  &gt; Scanned successfully. Calculating private customer
                  health...
                </div>
              </div>
            </div>
          ) : step === 4 && successData ? (
            /* Success outcome screen */
            <div className="w-full bg-black/40 border border-white/10 rounded-3xl p-10 backdrop-blur-md text-center space-y-8 shadow-2xl animate-fadeIn text-left min-h-[400px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--foreground)]">
                    Onboarding Completed!
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Your business account is active and registered.
                  </p>
                </div>
              </div>

              {/* Account summary pane */}
              <div className="p-5 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">
                      Registered Email
                    </span>
                    <span className="font-bold text-[var(--foreground)] block mt-1 truncate">
                      {successData.account?.email || formData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">
                      Account Role
                    </span>
                    <span className="font-bold text-[var(--foreground)] block mt-1">
                      {successData.account?.role || "General Manager"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">
                      Business Name
                    </span>
                    <span className="font-bold text-[var(--foreground)] block mt-1 truncate">
                      {successData.business?.name || formData.restaurantName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">
                      Registered Cuisine
                    </span>
                    <span className="font-bold text-[var(--foreground)] block mt-1">
                      {successData.business?.cuisine || formData.cuisine}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[var(--brand-border-subtle)] pt-3 text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-brand-purple-text flex-shrink-0" />
                  <span className="truncate">
                    Google Review Scraper dispatched:{" "}
                    <span className="font-mono text-[12px] text-[var(--text-dim)]">
                      {formData.mapsUrl}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={`/dashboard/${successData.business?.slug || successData.business?.id || "mumbai-masala-bandra"}`}
                  className="flex-1 py-3.5 bg-[#c77dff] text-black hover:bg-[#b55fe6] text-xs font-bold rounded-xl text-center cursor-pointer transition-all duration-300 shadow-md transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  Proceed to Manager Dashboard
                  <ArrowRight className="w-4 h-4 text-black" />
                </a>
                <a
                  href="/"
                  className="flex-1 py-3.5 bg-transparent text-[var(--foreground)] hover:bg-[var(--orb-bg)] border border-[var(--brand-border)] text-xs font-bold rounded-xl text-center cursor-pointer transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  Return to Home
                </a>
              </div>
            </div>
          ) : (
            /* Active Form Stepper Card */
            <form
              onSubmit={handleSubmit}
              className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-left space-y-6 animate-fadeIn transition-colors duration-300"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[var(--brand-border-subtle)]">
                <span className="text-xs font-bold text-[var(--foreground)]">
                  Step {step} of 3
                </span>
                <span className="text-[10px] text-white tracking-wider uppercase font-semibold">
                  {step === 1
                    ? "Business Account Setup"
                    : step === 2
                      ? "Business Outlet Profile"
                      : "AI Review Pipeline Setup"}
                </span>
              </div>

              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  {apiError}
                </div>
              )}

              {/* STEP 1: Account registration */}
              {step === 1 && (
                <AccountSetupStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}

              {/* STEP 2: Business Profile details */}
              {step === 2 && (
                <BusinessProfileStep
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                />
              )}

              {/* STEP 3: Google Maps Audit Link */}
              {step === 3 && (
                <ReviewPipelineStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              )}

              {/* Step Navigation controls */}
              <div className="flex gap-4 pt-4 border-t border-[var(--brand-border-subtle)]">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 rounded-xl border border-[var(--orb-border)] text-white font-bold text-xs hover:bg-[var(--orb-bg)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                      (step === 1 ? isStep1Valid() : isStep2Valid())
                        ? "bg-[#0c0516] text-white hover:bg-[#1a0f2b] border border-white/10 shadow-md"
                        : "bg-[var(--orb-bg)] border border-[var(--brand-border-subtle)] text-white cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStep3Valid()}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isStep3Valid()
                        ? "bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] border border-white/10 shadow-md shadow-purple-950/20"
                        : "bg-[var(--orb-bg)] border border-[var(--brand-border-subtle)] text-[var(--text-dim)] cursor-not-allowed"
                    }`}
                  >
                    Submit & Dispatch Scraper
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
