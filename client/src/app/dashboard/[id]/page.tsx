"use client";

import React, { useState, useEffect, useReducer } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { Globe, QrCode, Star, Menu, Loader2 } from "lucide-react";
import Image from "next/image";

import Sidebar from "@/components/dashboard/Sidebar";
import ModeSelector from "@/components/dashboard/ModeSelector";
import dynamic from "next/dynamic";

const OverviewPanel = dynamic(() => import("@/components/dashboard/OverviewPanel"), { loading: () => <p>Loading...</p> });
const ReviewPanel = dynamic(() => import("@/components/dashboard/ReviewPanel"), { loading: () => <p>Loading...</p> });
const QRDisplay = dynamic(() => import("@/components/dashboard/QRDisplay"), { loading: () => <p>Loading...</p> });
const SettingsPanel = dynamic(() => import("@/components/dashboard/SettingsPanel"), { loading: () => <p>Loading...</p> });
const AIInsights = dynamic(() => import("@/components/dashboard/AIInsights"), { loading: () => <p>Loading...</p> });
const Recommendations = dynamic(() => import("@/components/dashboard/Recommendations"), { loading: () => <p>Loading...</p> });
const CompetitorWatch = dynamic(() => import("@/components/dashboard/CompetitorWatch"), { loading: () => <p>Loading...</p> });
const CustomerDatabase = dynamic(() => import("@/components/dashboard/CustomerDatabase"), { loading: () => <p>Loading...</p> });
const RetentionCampaigns = dynamic(() => import("@/components/dashboard/RetentionCampaigns"), { loading: () => <p>Loading...</p> });
const SEOHealth = dynamic(() => import("@/components/dashboard/SEOHealth"), { loading: () => <p>Loading...</p> });

import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Business, Review, Insight, Campaign, Customer, Competitor } from "@/types";

interface DashboardState {
  business: Business;
  reviews: Review[];
  insights: any;
  allInsights: any[];
  campaigns: Campaign[];
  customers: Customer[];
  competitors: Competitor[];
  auditStatus: any;
  qrStats: any;
  seoStats: any;
  chartData: any[];
  healthSparkline: any[];
  isRefreshingInsights: boolean;
  isLoading: boolean;
}

const initialState: DashboardState = {
  business: { id: "", slug: "", name: "", cuisine: "", location: "", owner_email: "", health_score: 0 },
  reviews: [],
  insights: null,
  allInsights: [],
  campaigns: [],
  customers: [],
  competitors: [],
  auditStatus: {},
  qrStats: null,
  seoStats: null,
  chartData: [],
  healthSparkline: [],
  isRefreshingInsights: false,
  isLoading: true,
};

type Action = 
  | { type: "SET_DATA"; payload: Partial<DashboardState> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESHING_INSIGHTS"; payload: boolean }
  | { type: "UPDATE_REVIEW"; payload: { id: string; review: Partial<Review> } }
  | { type: "RESET_FALLBACK" };

function dashboardReducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, ...action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_REFRESHING_INSIGHTS":
      return { ...state, isRefreshingInsights: action.payload };
    case "UPDATE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map(r => r.id === action.payload.id ? { ...r, ...action.payload.review } : r)
      };
    case "RESET_FALLBACK":
      return {
        ...state,
        reviews: [],
        insights: null,
        allInsights: [],
        campaigns: [],
        customers: [],
        competitors: [],
      };
    default:
      return state;
  }
}

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params?.id as string;
  
  const { userEmail, logout } = useAuth();

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTabState] = useState(tabParam);
  const [managerMode, setManagerMode] = useState("all");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  };

  const fetchDashboardData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const data = await api.get(`/dashboard/${id}?mode=${managerMode}`);
      
      dispatch({ type: "SET_DATA", payload: {
        business: data.business || state.business,
        reviews: Array.isArray(data.reviews) ? data.reviews : (data.reviews?.items || []),
        insights: data.insights || null,
        allInsights: data.all_insights || [],
        campaigns: data.campaigns || [],
        customers: data.customers || [],
        competitors: data.competitors || [],
        auditStatus: data.audit_status || {},
        qrStats: data.qr_stats || null,
        seoStats: data.seo_stats || null,
        chartData: data.chart_data || [],
        healthSparkline: data.health_sparkline || [],
      }});
    } catch (err) {
      console.warn("Failed to fetch real data from backend. Falling back to empty state.", err);
      dispatch({ type: "RESET_FALLBACK" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    if (id) fetchDashboardData();
  }, [id, managerMode]);

  // Real-time SSE listener for background processing updates
  useEffect(() => {
    if (!id) return;
    
    // Connect to the new SSE stream endpoint
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/dashboard/${id}/stream`);
    
    eventSource.onmessage = (event) => {
      // When the backend signals that the background audit is complete
      if (event.data === 'reload') {
        console.log("SSE: Background processing completed. Reloading dashboard...");
        fetchDashboardData();
      }
    };
    
    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };
    
    // Cleanup the connection if the user navigates away
    return () => {
      eventSource.close();
    };
  }, [id]);

  const handleApproveReply = async (reviewId: string, finalContent: string) => {
    try {
      await api.post(`/reviews/${reviewId}/approve`, { final_reply_content: finalContent });
      
      dispatch({ type: "UPDATE_REVIEW", payload: { id: reviewId, review: { owner_approved_reply: true, final_reply_content: finalContent } } });
    } catch (err) {
      console.error(err);
      alert("Failed to dispatch reply.");
    }
  };

  const handleRefreshInsights = async () => {
    if (!state.business?.slug) return;
    dispatch({ type: "SET_REFRESHING_INSIGHTS", payload: true });
    try {
      const data = await api.post(`/insights/${state.business.slug}/trigger?mode=unified`);
      
      dispatch({ type: "SET_DATA", payload: { insights: data.insights } });
    } catch (error: any) {
      console.error("Failed to refresh insights", error);
      alert(error.message || "The AI model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.");
    } finally {
      dispatch({ type: "SET_REFRESHING_INSIGHTS", payload: false });
    }
  };

  // Render logic for different tabs
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPanel 
            business={state.business} 
            reviews={state.reviews} 
            insights={state.insights} 
            auditStatus={state.auditStatus} 
            chartData={state.chartData}
            healthSparkline={state.healthSparkline}
            mode={managerMode}
          />
        );
      
      case "qr_reviews":
        return (
          <ReviewPanel
            businessSlug={state.business.slug || state.business.id}
            sourceFilter="qr"
            title="TableTalk Private Intercepts"
            subtitle="Internal feedback collected via your on-table QR codes before guests leave."
            icon={<QrCode className="w-5 h-5 text-[#10b981]" />}
            onApprove={handleApproveReply}
          >
            <QRDisplay 
              url={`http://localhost:3000/b/${state.business.slug || state.business.id}`}
              restaurantName={state.business.name}
              qrStats={state.qrStats}
            />
          </ReviewPanel>
        );

      case "google_reviews":
        return (
          <ReviewPanel
            businessSlug={state.business.slug || state.business.id}
            sourceFilter="google"
            title="Google Maps Dispatch Queue"
            subtitle="Public reviews waiting for your approval. AI drafts are pre-generated."
            icon={<Globe className="w-5 h-5 text-[#3b82f6]" />}
            onApprove={handleApproveReply}
          />
        );

      case "other_reviews":
        return (
          <ReviewPanel
            businessSlug={state.business.slug || state.business.id}
            sourceFilter="yelp"
            title="Yelp & Other Platforms"
            subtitle="Reviews from secondary platforms."
            icon={<Star className="w-5 h-5 text-[#f59e0b]" />}
            onApprove={handleApproveReply}
          />
        );
        
      case "ai_insights":
        return <AIInsights insights={state.insights} onRefresh={handleRefreshInsights} isRefreshing={state.isRefreshingInsights} mode={managerMode} />;
        
      case "recommendations":
        return <Recommendations insights={state.insights} reviews={state.reviews} mode={managerMode} />;
        
      case "competitor_watch":
        return <CompetitorWatch competitors={state.competitors} />;
        
      case "customer_db":
        return <CustomerDatabase customers={state.customers} reviews={state.reviews} />;
        
      case "retention":
        return <RetentionCampaigns campaigns={state.campaigns} business={state.business} setActiveTab={setActiveTab} />;
        
      case "seo_health":
        return <SEOHealth auditStatus={state.auditStatus} seoStats={state.seoStats} insights={state.insights} />;

      case "settings":
        return <SettingsPanel businessId={state.business.id} />;

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <h2 className="text-xl font-bold text-[#64748b]">Under Construction</h2>
            <p className="text-xs text-[#475569] mt-2">This module is currently being developed.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05020a] overflow-hidden selection:bg-[#a855f7]/30 selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileOpen(false); // Auto-close on mobile
        }} 
        restaurantName={state.business.name}
        userEmail={userEmail || state.business.owner_email || "manager@mumbaimasala.in"}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onSignOut={logout}
      />

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar no-scrollbar bg-[#05020a]">
        
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-[#0c0516] border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 text-white hover:bg-[#1e293b]/50 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Image src="/assets/logos/logo_dark.svg" alt="TableTalk" width={120} height={16} className="h-4 w-auto object-contain" />
          </div>
        </div>

        <div className="w-full mx-auto p-4 md:p-8 relative z-20">
          {state.isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <div className="w-8 h-8 border-2 border-[#1e293b] border-t-[#a855f7] rounded-full animate-spin" />
              <span className="text-[10px] text-[#64748b]">Loading workspace...</span>
            </div>
          ) : (
            <>
              {state.auditStatus && state.auditStatus.audit_completed === false && (
                <div className="mb-6 p-4 bg-[#1e293b]/50 border border-[#334155] rounded-lg flex items-center gap-3 shadow-lg">
                  <Loader2 className="w-5 h-5 text-[#3b82f6] animate-spin" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Agents are currently scraping and analyzing your reviews...</h3>
                    <p className="text-xs text-[#94a3b8]">This can take up to 2 minutes. The dashboard will automatically refresh when complete.</p>
                  </div>
                </div>
              )}
              {["overview"].includes(activeTab) && (
                <ModeSelector activeMode={managerMode} onModeChange={setManagerMode} />
              )}
              {renderActiveTab()}
            </>
          )}
        </div>
      </main>

    </div>
  );
}
