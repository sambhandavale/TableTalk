"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Globe, QrCode, Star } from "lucide-react";

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
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState({
    id: "",
    slug: "",
    name: "Mumbai Masala Bistro",
    cuisine: "Indian Fusion",
    location: "Bandra West, Mumbai",
    owner_email: "",
    health_score: 88,
  });
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [allInsights, setAllInsights] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [auditStatus, setAuditStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`http://localhost:8000/api/dashboard/${id}`);
      if (!resp.ok) throw new Error("Failed to fetch dashboard");
      const data = await resp.json();
      
      setRestaurant(data.restaurant || restaurant);
      setReviews(data.reviews || []);
      setInsights(data.insights || null);
      setAllInsights(data.all_insights || []);
      setCampaigns(data.campaigns || []);
      setCustomers(data.customers || []);
      setCompetitors(data.competitors || []);
      setAuditStatus(data.audit_status || {});
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

  // Render logic for different tabs
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewPanel 
            restaurant={restaurant} 
            reviews={reviews} 
            insights={insights} 
            auditStatus={auditStatus} 
          />
        );
      
      case "qr_reviews":
        return (
          <ReviewPanel
            reviews={reviews}
            sourceFilter="tabletalk"
            title="TableTalk Private Intercepts"
            subtitle="Internal feedback collected via your on-table QR codes before guests leave."
            icon={<QrCode className="w-5 h-5 text-[#10b981]" />}
            onApprove={handleApproveReply}
          >
            <QRDisplay 
              url={`http://localhost:3000/r/${restaurant.slug || restaurant.id}`}
              restaurantName={restaurant.name}
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
        return <AIInsights insights={insights} />;
        
      case "recommendations":
        return <Recommendations insights={insights} />;
        
      case "competitor_watch":
        return <CompetitorWatch competitors={competitors} />;
        
      case "customer_db":
        return <CustomerDatabase customers={customers} />;
        
      case "retention":
        return <RetentionCampaigns campaigns={campaigns} />;
        
      case "seo_health":
        return <SEOHealth auditStatus={auditStatus} />;

      case "settings":
        return <SettingsPanel restaurantId={restaurant.id} />;

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
        setActiveTab={setActiveTab} 
        restaurantName={restaurant.name}
        userEmail={restaurant.owner_email || "manager@mumbaimasala.in"}
        onSignOut={() => window.location.href = "/signin"}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto custom-scrollbar no-scrollbar bg-[#05020a]">
        
        <div className="w-full mx-auto p-8 relative z-20">
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
