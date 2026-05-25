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
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("dark");
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
    mapsUrl: ""
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Stepper Validations
  const isStep1Valid = () => {
    return formData.email.includes("@") && formData.password.length >= 6 && formData.ownerName.trim() !== "";
  };

  const isStep2Valid = () => {
    return formData.restaurantName.trim() !== "" && formData.location.trim() !== "";
  };

  const isStep3Valid = () => {
    return formData.mapsUrl.startsWith("http://") || formData.mapsUrl.startsWith("https://");
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
      setApiError("");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.restaurantName,
          cuisine: formData.cuisine,
          location: formData.location,
          owner_contact: formData.ownerName,
          maps_url: formData.mapsUrl,
          seating_capacity: Number(formData.seatingCapacity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "An onboarding error occurred. Please try again.");
      }

      // Simulate a premium AI Audit scan sequence (visual loader)
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("tabletalk_restaurant_id", data.restaurant?.id || "");
          localStorage.setItem("tabletalk_restaurant_slug", data.restaurant?.slug || "");
          localStorage.setItem("tabletalk_user_email", data.account?.email || formData.email);
        }
        setIsSubmitting(false);
        setSuccessData(data);
        setStep(4);
      }, 4000);

    } catch (err: any) {
      setIsSubmitting(false);
      setApiError(err.message || "Could not connect to the backend server. Make sure it is running on port 8000.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none dot-grid transition-colors duration-300">
      
      {/* Background Liquid Purple Glows */}
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

      {/* MAIN SPLIT-PANE WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-20">
        
        {/* LEFT COLUMN: Visual sidecar (6 spans) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-[var(--brand-card)] border border-[var(--brand-border)] p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden text-left transition-all duration-300">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-950/30 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 text-[10px] text-brand-purple-text font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple-text animate-pulse" />
              General Manager Console
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[var(--foreground)]">
              Claim Your Outlet & Initialize AI Triage
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-light leading-relaxed">
              Create your business account to sync POS terminals, deploy review scraping agents, and set up negative feedback intercepts automatically.
            </p>
          </div>

          {/* Setup Progress Steps indicator */}
          <div className="space-y-4 pt-4 relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Onboarding Progress</span>
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                  step > 1 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : step === 1 ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text" : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                }`}>
                  {step > 1 ? "✓" : "1"}
                </div>
                <div>
                  <span className={`text-xs font-bold block leading-none ${step >= 1 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}>Create Account</span>
                  <span className="text-[9px] text-[var(--text-dim)] block mt-0.5">Secure credential mapping</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                  step > 2 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : step === 2 ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text" : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                }`}>
                  {step > 2 ? "✓" : "2"}
                </div>
                <div>
                  <span className={`text-xs font-bold block leading-none ${step >= 2 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}>Outlet Settings</span>
                  <span className="text-[9px] text-[var(--text-dim)] block mt-0.5">Restaurant details & capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                  step > 3 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : step === 3 ? "bg-brand-purple-text/20 border-brand-purple-text text-brand-purple-text" : "bg-transparent border-[var(--brand-border)] text-[var(--text-dim)]"
                }`}>
                  {step > 3 ? "✓" : "3"}
                </div>
                <div>
                  <span className={`text-xs font-bold block leading-none ${step >= 3 ? "text-[var(--foreground)]" : "text-[var(--text-dim)]"}`}>Google Maps Scan</span>
                  <span className="text-[9px] text-[var(--text-dim)] block mt-0.5">Scraper review hook dispatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Miniature Testimonial Card */}
          <div className="p-4 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-2xl relative z-10">
            <span className="text-[8px] uppercase tracking-wider text-[var(--brand-purple-text)] font-extrabold block">Spice Garden Bistro</span>
            <p className="text-[10px] text-[var(--text-muted)] italic font-light mt-1.5 leading-relaxed">
              "We deployed TableTalk last month and it intercepted three critical 1-star complaints regarding service delays on Bandra West. Diners left happy and Google Maps rating climbed!"
            </p>
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--brand-border-subtle)]">
              <span className="text-[9px] font-bold text-[var(--foreground)]">Amit K.</span>
              <span className="text-[8px] text-[var(--text-dim)]">• General Manager</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Stepper Form (7 spans) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Submitting Spinner screen */}
          {isSubmitting ? (
            <div className="w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-3xl p-10 backdrop-blur-xl text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--foreground)] animate-pulse">Dispatched AI Audit Agent...</h3>
                <p className="text-xs text-[var(--text-muted)] font-light max-w-sm mx-auto leading-relaxed">
                  Scanning Google Reviews at <span className="font-mono text-brand-purple-text block mt-1 truncate">{formData.mapsUrl}</span>
                </p>
              </div>
              
              {/* Fake agent log activity terminal block */}
              <div className="w-full max-w-md bg-black/60 border border-[var(--brand-border)] rounded-xl p-3 text-left font-mono text-[9px] text-slate-300 space-y-1.5 overflow-hidden h-24">
                <div className="text-purple-400">&gt; Initializing audit_agent.py on restaurant_id: pending</div>
                <div className="text-slate-400">&gt; Hooking Google Maps web scraper pipeline</div>
                <div className="text-yellow-400">&gt; [Gemini] extract review themes and metrics...</div>
                <div className="text-green-400">&gt; Scanned successfully. Calculating private customer health...</div>
              </div>
            </div>
          ) : step === 4 && successData ? (
            
            /* Success outcome screen */
            <div className="w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-3xl p-10 backdrop-blur-xl text-center space-y-8 shadow-2xl animate-fadeIn text-left min-h-[400px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--foreground)]">Onboarding Completed!</h3>
                  <p className="text-xs text-[var(--text-muted)]">Your business account is active and registered.</p>
                </div>
              </div>

              {/* Account summary pane */}
              <div className="p-5 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">Registered Email</span>
                    <span className="font-bold text-[var(--foreground)] block mt-1 truncate">{successData.account?.email || formData.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">Account Role</span>
                    <span className="font-bold text-[var(--foreground)] block mt-1">{successData.account?.role || "General Manager"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">Restaurant Name</span>
                    <span className="font-bold text-[var(--foreground)] block mt-1 truncate">{successData.restaurant?.name || formData.restaurantName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider block leading-none">Registered Cuisine</span>
                    <span className="font-bold text-[var(--foreground)] block mt-1">{successData.restaurant?.cuisine || formData.cuisine}</span>
                  </div>
                </div>
                
                <div className="border-t border-[var(--brand-border-subtle)] pt-3 text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-brand-purple-text flex-shrink-0" />
                  <span className="truncate">Google Review Scraper dispatched: <span className="font-mono text-[9px] text-[var(--text-dim)]">{formData.mapsUrl}</span></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href={`/dashboard/${successData.restaurant?.slug || successData.restaurant?.id || "mumbai-masala-bandra"}`}
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
            <form onSubmit={handleSubmit} className="w-full bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-left space-y-6 animate-fadeIn transition-colors duration-300">
              
              <div className="flex justify-between items-center pb-2 border-b border-[var(--brand-border-subtle)]">
                <span className="text-xs font-bold text-[var(--foreground)]">
                  Step {step} of 3
                </span>
                <span className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase font-semibold">
                  {step === 1 ? "Business Account Setup" : step === 2 ? "Restaurant Outlet Profile" : "AI Review Pipeline Setup"}
                </span>
              </div>

              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  {apiError}
                </div>
              )}

              {/* STEP 1: Account registration */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">GM / Owner Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        placeholder="Amit Kumar"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Business Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="manager@spicegarden.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Security Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
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
                    <span className="text-[9px] text-[var(--text-dim)] block">Must be at least 6 characters.</span>
                  </div>
                </div>
              )}

              {/* STEP 2: Restaurant Profile details */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Restaurant Name</label>
                      <div className="relative flex items-center">
                        <Utensils className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="text"
                          name="restaurantName"
                          value={formData.restaurantName}
                          onChange={handleInputChange}
                          placeholder="Spice Garden Bistro"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Cuisine Concept</label>
                      <div className="relative flex items-center">
                        <select 
                          name="cuisine"
                          value={formData.cuisine}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-3 rounded-xl bg-[var(--brand-card)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] transition-all duration-300"
                        >
                          <option value="Indian Fusion">Indian Fusion</option>
                          <option value="Multi-Cuisine Cafe">Multi-Cuisine Cafe</option>
                          <option value="Lounge & Grill">Lounge & Grill</option>
                          <option value="Coastal Seafood">Coastal Seafood</option>
                          <option value="Asian Diner">Asian Diner</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Physical Address / City Area</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Bandra West, Mumbai"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Seating Capacity</label>
                    <div className="relative flex items-center">
                      <Users className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="number"
                        name="seatingCapacity"
                        value={formData.seatingCapacity}
                        onChange={handleInputChange}
                        placeholder="60"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                        min="5"
                        max="1000"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Google Maps Audit Link */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Google Maps Reviews Link</label>
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="url"
                        name="mapsUrl"
                        value={formData.mapsUrl}
                        onChange={handleInputChange}
                        placeholder="https://maps.google.com/?cid=12345"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
                        required
                      />
                    </div>
                    <span className="text-[9px] text-[var(--text-dim)] block leading-relaxed">
                      Must be a valid HTTP or HTTPS link. TableTalk AI Scraper will scan public reviews on this business maps node to feed your dashboard simulator.
                    </span>
                  </div>

                  {/* Trust indicator bullet point */}
                  <div className="p-4 rounded-2xl bg-brand-purple-text/5 border border-brand-purple-text/10 text-[10px] text-[var(--text-muted)] space-y-1">
                    <span className="font-bold text-[var(--foreground)] block">What happens next?</span>
                    <p className="font-light leading-relaxed">
                      TableTalk launches an asynchronous background audit scraper task immediately upon submission. Within 5 seconds, our review extractor analyzes sentiment logs and updates your operational score privately.
                    </p>
                  </div>
                </div>
              )}

              {/* Step Navigation controls */}
              <div className="flex gap-4 pt-4 border-t border-[var(--brand-border-subtle)]">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 rounded-xl border border-[var(--orb-border)] text-[var(--foreground)] font-bold text-xs hover:bg-[var(--orb-bg)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
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
                        ? "bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] border border-white/10 shadow-md"
                        : "bg-[var(--orb-bg)] border border-[var(--brand-border-subtle)] text-[var(--text-dim)] cursor-not-allowed"
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
                    Submit & Dispatched Scraper
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
