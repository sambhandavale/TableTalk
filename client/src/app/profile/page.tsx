"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Save, 
  Clock, 
  DollarSign, 
  Globe, 
  MapPin, 
  Users,
  Compass,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  Shield,
  Layers
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("outlet");
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Restaurant ID/Slug reference
  const [restaurantId, setRestaurantId] = useState("mumbai-masala-bandra");

  // Rich Profile State
  const [formData, setFormData] = useState({
    name: "Mumbai Masala Bistro",
    cuisine: "Indian Fusion",
    location: "Bandra West, Mumbai",
    owner_contact: "owner@mumbaimasala.in",
    maps_url: "https://maps.google.com/?cid=mock-mumbai-masala",
    seating_capacity: 60,
    
    // Advanced fields
    contact_phone: "",
    business_hours: "12:00 PM - 11:30 PM",
    cost_for_two: 1200,
    pos_system: "Excel/Manual",
    instagram_handle: "",
    website_url: "",
    dining_duration_mins: 60,
    is_pure_veg: false,
    valet_parking: false
  });

  useEffect(() => {
    // Check if the user has an onboarded restaurant ID/slug in localStorage
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("tabletalk_restaurant_id") || 
                       localStorage.getItem("tabletalk_restaurant_slug");
      if (storedId) {
        setRestaurantId(storedId);
      }
      
      // Inherit document class theme
      const isLight = document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    }
  }, []);

  // Fetch current restaurant data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/onboard/${restaurantId}/status`);
        if (!response.ok) {
          throw new Error("Restaurant not found in database.");
        }
        const data = await response.json();
        
        // Merge with defaults
        if (data.restaurant) {
          setFormData(prev => ({
            ...prev,
            ...data.restaurant,
            // Ensure capacity and integers are correct
            seating_capacity: Number(data.restaurant.seating_capacity || 60),
            cost_for_two: Number(data.restaurant.cost_for_two || 1200),
            dining_duration_mins: Number(data.restaurant.dining_duration_mins || 60),
            is_pure_veg: Boolean(data.restaurant.is_pure_veg),
            valet_parking: Boolean(data.restaurant.valet_parking)
          }));
        }
      } catch (err) {
        console.warn("Could not fetch remote profile. Using seeded fallback values.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [restaurantId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`http://localhost:8000/api/onboard/${restaurantId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contact_phone: formData.contact_phone,
          business_hours: formData.business_hours,
          cost_for_two: Number(formData.cost_for_two),
          pos_system: formData.pos_system,
          instagram_handle: formData.instagram_handle,
          website_url: formData.website_url,
          dining_duration_mins: Number(formData.dining_duration_mins),
          is_pure_veg: formData.is_pure_veg,
          valet_parking: formData.valet_parking,
          seating_capacity: Number(formData.seating_capacity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not save profile details.");
      }

      setMessage({
        type: "success",
        text: "Outlet profile operational settings successfully saved in MongoDB!"
      });
      
      // Update stored ID if slug returned
      if (data.restaurant?.slug) {
        localStorage.setItem("tabletalk_restaurant_slug", data.restaurant.slug);
      }

    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to connect to the backend server. Make sure it is running on port 8000."
      });
    } finally {
      setIsSaving(false);
      // Auto clear success message
      setTimeout(() => {
        setMessage(prev => prev.type === "success" ? { type: "", text: "" } : prev);
      }, 5000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none dot-grid transition-colors duration-300">
      
      {/* Background Liquid Purple Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            className="w-9 h-9 rounded-full border border-[var(--orb-border)] bg-[var(--orb-bg)] flex items-center justify-center text-[var(--foreground)] hover:opacity-80 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <img 
            src={theme === "dark" ? "/assets/logos/logo_dark.svg" : "/assets/logos/logo_light.svg"} 
            alt="TableTalk" 
            className="h-6 w-auto object-contain transition-all duration-300"
          />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 text-[10px] text-brand-purple-text font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          General Settings
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 md:px-12 py-10 relative z-20 text-left">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
            </div>
            <span className="text-xs text-[var(--text-muted)] animate-pulse">Loading outlet profile...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Page Title */}
            <div>
              <span className="text-xs font-bold text-brand-purple-text uppercase tracking-widest block mb-1">Outlet Configurations</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                {formData.name} Profile
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed mt-1">
                Configure advanced operations metrics, POS integrations, business hours, and reservation table criteria to personalize campaigns.
              </p>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium animate-fadeIn ${
                message.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {message.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* TAB CONTROLLERS */}
            <div className="flex border-b border-[var(--brand-border)]">
              <button
                onClick={() => setActiveTab("outlet")}
                className={`px-5 py-3 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === "outlet" 
                    ? "text-[var(--foreground)]" 
                    : "text-[var(--text-dim)] hover:text-[var(--foreground)]"
                }`}
              >
                Outlet Profile
                {activeTab === "outlet" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-purple-text)]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("web")}
                className={`px-5 py-3 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === "web" 
                    ? "text-[var(--foreground)]" 
                    : "text-[var(--text-dim)] hover:text-[var(--foreground)]"
                }`}
              >
                Web & Socials
                {activeTab === "web" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-purple-text)]" />
                )}
              </button>
            </div>

            {/* ACTIVE TAB CONTENT CONTAINER */}
            <form onSubmit={handleSubmit} className="bg-[var(--brand-card)] border border-[var(--brand-border)] p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl space-y-8 transition-colors duration-300">
              
              {/* TAB 1: Outlet Details */}
              {activeTab === "outlet" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Grid 1: Basic Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Business Hours</label>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="text"
                          name="business_hours"
                          value={formData.business_hours}
                          onChange={handleInputChange}
                          placeholder="12:00 PM - 11:30 PM"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Average Cost for Two (INR)</label>
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="number"
                          name="cost_for_two"
                          value={formData.cost_for_two}
                          onChange={handleInputChange}
                          placeholder="1200"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Capacity & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Seating Capacity</label>
                      <div className="relative flex items-center">
                        <Users className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="number"
                          name="seating_capacity"
                          value={formData.seating_capacity}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Average Dining Duration (mins)</label>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="number"
                          name="dining_duration_mins"
                          value={formData.dining_duration_mins}
                          onChange={handleInputChange}
                          placeholder="60"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact WhatsApp & POS integration selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Alerts WhatsApp Phone</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                        <input 
                          type="tel"
                          name="contact_phone"
                          value={formData.contact_phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">POS System Integration</label>
                      <div className="relative flex items-center">
                        <select 
                          name="pos_system"
                          value={formData.pos_system}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-3 rounded-xl bg-[var(--brand-card)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] transition-all duration-300"
                        >
                          <option value="Excel/Manual">Excel / Manual Upload</option>
                          <option value="Petpooja">Petpooja (India)</option>
                          <option value="POSist">POSist / Prime</option>
                          <option value="Toast">Toast POS</option>
                          <option value="Square">Square Restaurant</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Operational Checkbox Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCheckboxChange("is_pure_veg", !formData.is_pure_veg)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        formData.is_pure_veg 
                          ? "bg-[var(--brand-purple-text)]/5 border-[var(--brand-purple-text)]/40 shadow-sm" 
                          : "bg-transparent border-[var(--brand-border)] hover:bg-[var(--orb-bg)]"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[var(--foreground)] block">Pure Vegetarian</span>
                        <span className="text-[9px] text-[var(--text-dim)] block mt-0.5">Outlet serves no meat concepts</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border transition-all ${
                        formData.is_pure_veg ? "bg-[var(--brand-purple-text)] border-[var(--brand-purple-text)]" : "bg-transparent border-[var(--orb-border)]"
                      }`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCheckboxChange("valet_parking", !formData.valet_parking)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        formData.valet_parking 
                          ? "bg-[var(--brand-purple-text)]/5 border-[var(--brand-purple-text)]/40 shadow-sm" 
                          : "bg-transparent border-[var(--brand-border)] hover:bg-[var(--orb-bg)]"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[var(--foreground)] block">Valet Parking Served</span>
                        <span className="text-[9px] text-[var(--text-dim)] block mt-0.5">Complimentary parking for VIPs</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border transition-all ${
                        formData.valet_parking ? "bg-[var(--brand-purple-text)] border-[var(--brand-purple-text)]" : "bg-transparent border-[var(--orb-border)]"
                      }`} />
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: Web & Socials */}
              {activeTab === "web" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Instagram Slogan / Handle</label>
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="text"
                        name="instagram_handle"
                        value={formData.instagram_handle}
                        onChange={handleInputChange}
                        placeholder="@spicegarden_mumbai"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Official Website URL</label>
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://www.spicegardenbistro.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">Google Maps Review Scraper Node URL</label>
                    <div className="relative flex items-center">
                      <Compass className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
                      <input 
                        type="url"
                        name="maps_url"
                        value={formData.maps_url}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] opacity-60 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <span className="text-[9px] text-[var(--text-dim)] block">
                      Google maps node scraping links are set during onboarding and cannot be altered once initial audit indexes are compiled.
                    </span>
                  </div>

                </div>
              )}

              {/* Submitting Control Row */}
              <div className="flex justify-between items-center pt-6 border-t border-[var(--brand-border-subtle)]">
                <span className="text-[10px] text-[var(--text-dim)] font-medium">
                  Linked to Outlet ID: <span className="font-mono text-brand-purple-text font-bold">{restaurantId}</span>
                </span>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-3 bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] border border-white/10 text-xs font-bold rounded-xl transition-all duration-300 shadow-md flex items-center gap-1.5 cursor-pointer transform active:scale-95 ${
                    isSaving ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#ffffff]" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
}
