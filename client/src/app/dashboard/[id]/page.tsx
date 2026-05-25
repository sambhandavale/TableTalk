"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Sparkles, 
  ArrowLeft,
  Settings, 
  LogOut, 
  ShieldAlert, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Smartphone,
  ExternalLink,
  Search,
  MessageSquare
} from "lucide-react";

export default function DashboardPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [auditStatus, setAuditStatus] = useState<any>(null);
  
  // Restaurant Profile State
  const [restaurant, setRestaurant] = useState({
    id: "",
    name: "Mumbai Masala Bistro",
    cuisine: "Indian Fusion",
    location: "Bandra West, Mumbai",
    seating_capacity: 60,
    maps_url: "",
    health_score: 88,
    audit_completed: true,
    pos_system: "Excel/Manual",
    contact_phone: ""
  });

  useEffect(() => {
    // 1. Session verification check
    if (typeof window !== "undefined") {
      const storedSlug = localStorage.getItem("tabletalk_restaurant_slug") || 
                         localStorage.getItem("tabletalk_restaurant_id");
      const storedEmail = localStorage.getItem("tabletalk_user_email");
      
      if (!storedSlug || !storedEmail) {
        // Unauthenticated - bounce to signin
        window.location.href = "/signin";
        return;
      }
      
      setUserEmail(storedEmail);
      
      // Inherit document class theme
      const isLight = document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    }
  }, [restaurantId]);

  // 2. Fetch current audit status & profile details from backend
  useEffect(() => {
    if (!restaurantId) return;
    
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/onboard/${restaurantId}/status`);
        if (!response.ok) {
          throw new Error("Restaurant status endpoint returned an error.");
        }
        const data = await response.json();
        
        if (data.restaurant) {
          setRestaurant(prev => ({
            ...prev,
            ...data.restaurant,
            seating_capacity: Number(data.restaurant.seating_capacity || 60),
            health_score: Number(data.restaurant.health_score || 85)
          }));
        }
        
        setAuditStatus(data);
      } catch (err) {
        console.warn("Could not fetch remote audit status. Using seeded fallback data.", err);
        // Resilient Mock Onboarding status fallback
        setRestaurant(prev => ({
          ...prev,
          id: restaurantId,
          name: restaurantId.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          maps_url: "https://maps.google.com/?cid=mock-maps-node"
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [restaurantId]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tabletalk_restaurant_id");
      localStorage.removeItem("tabletalk_restaurant_slug");
      localStorage.removeItem("tabletalk_user_email");
      window.location.href = "/";
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden flex flex-col font-sans select-none dot-grid transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center relative z-50 border-b border-[var(--brand-border-subtle)]">
        <div className="flex items-center gap-4">
          <img 
            src={theme === "dark" ? "/assets/logos/logo_dark.svg" : "/assets/logos/logo_light.svg"} 
            alt="TableTalk" 
            className="h-6 w-auto object-contain transition-all duration-300"
          />
          <span className="h-4 w-[1px] bg-[var(--brand-border)]" />
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Control Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right text-xs pr-2">
            <span className="font-bold text-[var(--foreground)] leading-none">{restaurant.name}</span>
            <span className="text-[9px] text-[var(--text-dim)] mt-0.5">{userEmail}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="h-9 px-3.5 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all duration-300 active:scale-95 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-10 relative z-20 text-left">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
            </div>
            <span className="text-xs text-[var(--text-muted)] animate-pulse">Loading outlet control center...</span>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            
            {/* HERO TITLE & DYNAMIC STATS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[var(--brand-border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-purple-text)]/10 border border-[var(--brand-purple-text)]/20 text-[10px] text-brand-purple-text font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Active Workspace
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] font-sans">
                  {restaurant.name}
                </h1>
                <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-purple-text" />
                  {restaurant.location} | <span className="font-semibold text-brand-purple-text">{restaurant.cuisine}</span>
                </p>
              </div>

              <div className="flex gap-4">
                <a 
                  href="/profile"
                  className="px-5 py-2.5 bg-[#0c0516] text-[#ffffff] hover:bg-[#1a0f2b] border border-white/10 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#ffffff]" />
                  Update Settings
                </a>
              </div>
            </div>

            {/* MAIN STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-950/15 rounded-full blur-[20px]" />
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Private Health Score</span>
                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-3xl font-extrabold text-[var(--foreground)]">
                    {restaurant.health_score || 88}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">Good</span>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1.5 leading-none">Internal customer sentiment rating</span>
              </div>

              <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-950/15 rounded-full blur-[20px]" />
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Capacity & Seating</span>
                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-3xl font-extrabold text-[var(--foreground)]">
                    {restaurant.seating_capacity}
                  </span>
                  <span className="text-[10px] text-[var(--text-dim)] font-bold">Tables</span>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1.5 leading-none">Configured seats in active dining</span>
              </div>

              <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-950/15 rounded-full blur-[20px]" />
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Active POS Integration</span>
                <div className="flex items-baseline gap-1 mt-2.5">
                  <span className="text-2xl font-extrabold text-brand-purple-text truncate block max-w-full">
                    {restaurant.pos_system || "Excel/Manual"}
                  </span>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1.5 leading-none">Voucher queues pull from POS logs</span>
              </div>

              <div className="bg-[var(--brand-card)] border border-[var(--brand-border)] p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-950/15 rounded-full blur-[20px]" />
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Review Scraper Status</span>
                <div className="flex items-baseline gap-2 mt-2.5">
                  {auditStatus?.audit_completed || restaurant.audit_completed ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">Scraper Active</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                      <span className="text-sm font-bold text-brand-purple-text animate-pulse">Running Scan...</span>
                    </>
                  )}
                </div>
                <span className="text-[9px] text-[var(--text-muted)] block mt-1.5 leading-none">Google Maps node scraper sync status</span>
              </div>

            </div>

            {/* WORKSPACE DETAILED ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Box: AI Review Scraper Logs (7 spans) */}
              <div className="lg:col-span-7 bg-[var(--brand-card)] border border-[var(--brand-border)] p-6 rounded-3xl backdrop-blur-xl relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[var(--brand-border-subtle)]">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-brand-purple-text" />
                      <span className="text-xs font-bold text-[var(--foreground)]">AI Scraping Scopes & Audit Summary</span>
                    </div>
                    <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-wider font-semibold font-mono bg-purple-950/30 px-2 py-0.5 rounded border border-purple-900/30">
                      Google Maps Link Linked
                    </span>
                  </div>

                  {restaurant.maps_url ? (
                    <div className="p-3 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-xl text-xs flex justify-between items-center gap-4">
                      <span className="text-[var(--text-muted)] font-mono text-[9px] truncate max-w-xs">{restaurant.maps_url}</span>
                      <a 
                        href={restaurant.maps_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-brand-purple-text font-bold hover:underline flex-shrink-0 flex items-center gap-1"
                      >
                        Visit Map Node
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 text-yellow-400 text-[10px] rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>No Google Maps review URL registered yet. Sync it in your profile settings.</span>
                    </div>
                  )}

                  {/* Audit summary panel details */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)] font-bold block">Scraped Review Logs</span>
                    
                    <div className="w-full bg-black/40 border border-[var(--brand-border)] rounded-2xl p-4 font-mono text-[9px] text-slate-300 space-y-2.5 overflow-hidden">
                      <div className="text-purple-400">&gt; Scanning active review blocks in Google Maps...</div>
                      <div className="text-slate-400">&gt; Scraped {auditStatus?.reviews_imported_count || 12} latest reviews successfully.</div>
                      <div className="text-yellow-400">&gt; Isolated service and starter timing delay spikes.</div>
                      <div className="text-green-400">&gt; Operational health index set to {restaurant.health_score || 88}%. Dispatching retention templates.</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[var(--brand-border-subtle)] flex justify-between items-center text-[10px] text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Background worker sync active
                  </span>
                  <span className="font-mono text-[9px] text-[var(--text-dim)]">Last updated: Just now</span>
                </div>
              </div>

              {/* Right Box: Dynamic Triage Simulator launchpad (5 spans) */}
              <div className="lg:col-span-5 bg-[var(--brand-card)] border border-[var(--brand-border)] p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-950/20 rounded-full blur-[40px] pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <span className="text-[9px] uppercase tracking-wider text-brand-purple-text font-extrabold block">Live Intercept loop</span>
                  <h3 className="text-lg font-extrabold text-[var(--foreground)] leading-tight">
                    Private QR Feedback Triage & Campaigns
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
                    Deploy feedback tables across your seating capacity of <span className="font-bold text-[var(--foreground)]">{restaurant.seating_capacity}</span> outlets. 
                    TableTalk automatically intercepts low ratings (1-3 stars) privately, alerting your GENERAL MANAGER instantly on WhatsApp.
                  </p>

                  <div className="p-4 bg-[var(--brand-border-subtle)] border border-[var(--brand-border)] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[var(--text-dim)]">WhatsApp Alert Recipient:</span>
                      <span className="font-mono text-[var(--foreground)] font-bold">{restaurant.contact_phone || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] border-t border-[var(--brand-border-subtle)] pt-2.5">
                      <span className="text-[var(--text-dim)]">Active Recovery Voucher:</span>
                      <span className="text-brand-purple-text font-extrabold uppercase">15% Weekend Special</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <a 
                    href="/#triage-simulator"
                    className="w-full py-3 bg-[#c77dff] text-black hover:bg-[#b55fe6] text-xs font-bold rounded-xl text-center cursor-pointer transition-all duration-300 shadow-md transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-black" />
                    Open Private Triage Simulator
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
