"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { Globe, QrCode, Star, Menu } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import OverviewPanel from "@/components/dashboard/OverviewPanel";
import ReviewPanel from "@/components/dashboard/ReviewPanel";
import QRDisplay from "@/components/dashboard/QRDisplay";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import AIInsights from "@/components/dashboard/AIInsights";
import Recommendations from "@/components/dashboard/Recommendations";
import CompetitorWatch from "@/components/dashboard/CompetitorWatch";
import CustomerDatabase from "@/components/dashboard/CustomerDatabase";
import RetentionCampaigns from "@/components/dashboard/RetentionCampaigns";
import SEOHealth from "@/components/dashboard/SEOHealth";

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params?.id as string;

  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTabState] = useState(tabParam);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  };
  const [business, setRestaurant] = useState({
    id: "",
    slug: "",
    name: "",
    cuisine: "",
    location: "",
    owner_email: "",
    health_score: 0,
  });
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [allInsights, setAllInsights] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [auditStatus, setAuditStatus] = useState<any>({});
  const [qrStats, setQrStats] = useState<any>(null);
  const [seoStats, setSeoStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [healthSparkline, setHealthSparkline] = useState<any[]>([]);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/dashboard/${id}`);
      if (!resp.ok) throw new Error("Failed to fetch dashboard");
      const data = await resp.json();
      
      setRestaurant(data.business || business);
      setReviews(data.reviews || []);
      setInsights(data.insights || null);
      setAllInsights(data.all_insights || []);
      setCampaigns(data.campaigns || []);
      setCustomers(data.customers || []);
      setCompetitors(data.competitors || []);
      setAuditStatus(data.audit_status || {});
      setQrStats(data.qr_stats || null);
      setSeoStats(data.seo_stats || null);
      setChartData(data.chart_data || []);
      setHealthSparkline(data.health_sparkline || []);
    } catch (err) {
      console.warn("Failed to fetch real data from backend. Falling back to empty state.", err);
      // Empty Fallback
      setReviews([]);
      setInsights(null);
      setAllInsights([]);
      setCampaigns([]);
      setCustomers([]);
      setCompetitors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDashboardData();
  }, [id]);

  const handleApproveReply = async (reviewId: string, finalContent: string) => {
    try {
      const resp = await fetch(`http://localhost:8000/api/reviews/${reviewId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_reply_content: finalContent })
      });
      if (!resp.ok) throw new Error("Failed to approve reply");
      
      setReviews(prev => prev.map(r => 
        r.id === reviewId 
          ? { ...r, owner_approved_reply: true, final_reply_content: finalContent } 
          : r
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to dispatch reply.");
    }
  };

  const handleRefreshInsights = async () => {
    if (!business?.slug) return;
    setIsRefreshingInsights(true);
    try {
      const response = await fetch(`http://localhost:8000/api/insights/${business.slug}/trigger`, {
        method: "POST",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "AI Processing Failed. Please try again later.");
      }
      const data = await response.json();
      setInsights(data.insights);
    } catch (error: any) {
      console.error("Failed to refresh insights", error);
      alert(error.message || "The AI model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.");
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  // Render logic for different tabs
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPanel 
            business={business} 
            reviews={reviews} 
            insights={insights} 
            auditStatus={auditStatus} 
            chartData={chartData}
            healthSparkline={healthSparkline}
          />
        );
      
      case "qr_reviews":
        return (
          <ReviewPanel
            reviews={reviews}
            sourceFilter="qr"
            title="TableTalk Private Intercepts"
            subtitle="Internal feedback collected via your on-table QR codes before guests leave."
            icon={<QrCode className="w-5 h-5 text-[#10b981]" />}
            onApprove={handleApproveReply}
          >
            <QRDisplay 
              url={`http://localhost:3000/b/${business.slug || business.id}`}
              restaurantName={business.name}
              qrStats={qrStats}
            />
          </ReviewPanel>
        );

      case "google_reviews":
        return (
          <ReviewPanel
            reviews={reviews}
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
            reviews={reviews}
            sourceFilter="yelp"
            title="Yelp & Other Platforms"
            subtitle="Reviews from secondary platforms."
            icon={<Star className="w-5 h-5 text-[#f59e0b]" />}
            onApprove={handleApproveReply}
          />
        );
        
      case "ai_insights":
        return <AIInsights insights={insights} onRefresh={handleRefreshInsights} isRefreshing={isRefreshingInsights} />;
        
      case "recommendations":
        return <Recommendations insights={insights} reviews={reviews} />;
        
      case "competitor_watch":
        return <CompetitorWatch competitors={competitors} />;
        
      case "customer_db":
        return <CustomerDatabase customers={customers} reviews={reviews} />;
        
      case "retention":
        return <RetentionCampaigns campaigns={campaigns} business={business} setActiveTab={setActiveTab} />;
        
      case "seo_health":
        return <SEOHealth auditStatus={auditStatus} seoStats={seoStats} />;

      case "settings":
        return <SettingsPanel businessId={business.id} />;

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
        restaurantName={business.name}
        userEmail={business.owner_email || "manager@mumbaimasala.in"}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onSignOut={() => {
          localStorage.removeItem("tabletalk_restaurant_id");
          localStorage.removeItem("tabletalk_restaurant_slug");
          localStorage.removeItem("tabletalk_user_email");
          router.push("/signin");
        }}
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
            <img src="/assets/logos/logo_dark.svg" alt="TableTalk" className="h-4 object-contain" />
          </div>
        </div>

        <div className="w-full mx-auto p-4 md:p-8 relative z-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <div className="w-8 h-8 border-2 border-[#1e293b] border-t-[#a855f7] rounded-none animate-spin" />
              <span className="text-[10px] text-[#64748b]">Loading workspace...</span>
            </div>
          ) : (
            <>
              {renderActiveTab()}
            </>
          )}
        </div>
      </main>

    </div>
  );
}
