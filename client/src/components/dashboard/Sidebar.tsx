import React, { useState } from "react";
import {
  LayoutDashboard,
  QrCode,
  Globe,
  Star,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  BrainCircuit,
  Lightbulb,
  Crosshair,
  Users,
  PieChart,
  Megaphone,
  Inbox,
  Bell,
  Activity,
  Store,
  Printer,
  CreditCard,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  restaurantName: string;
  userEmail: string;
  onSignOut: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  restaurantName,
  userEmail,
  onSignOut,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    reviews: true,
    intelligence: true,
    customers: true,
    reputation: true,
    settings: false,
  });

  const isEffectivelyCollapsed = isCollapsed && !isMobileOpen;

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const NavItem = ({ tab, icon: Icon, label, disabled = false }: any) => {
    const isActive = activeTab === tab;
    return (
      <button
        title={isEffectivelyCollapsed ? label : undefined}
        onClick={() => !disabled && setActiveTab(tab)}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-none transition-none ${
          isEffectivelyCollapsed ? "justify-center" : "justify-between"
        } ${
          isActive
            ? "bg-[#1e293b]/50 text-white"
            : disabled
              ? "text-[#475569] cursor-not-allowed"
              : "text-[#94a3b8] hover:bg-[#1e293b]/30 hover:text-white"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${isEffectivelyCollapsed ? "justify-center w-full" : ""}`}
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {!isEffectivelyCollapsed && (
            <span className="text-xs font-medium">{label}</span>
          )}
        </div>
      </button>
    );
  };

  const SectionHeader = ({
    sectionKey,
    label,
  }: {
    sectionKey: keyof typeof openSections;
    label: string;
  }) => {
    const isOpen = openSections[sectionKey];
    if (isEffectivelyCollapsed)
      return <div className="w-full h-px bg-[#1e293b] my-4" />;

    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between px-2 mb-1.5 mt-4 group"
      >
        <span className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold flex items-center gap-2 group-hover:text-white transition-colors">
          {label}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-[#64748b] group-hover:text-white" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#64748b] group-hover:text-white" />
        )}
      </button>
    );
  };

  return (
    <div
      className={`
        flex flex-col bg-[#0c0516] border-r border-[#1e293b] z-50 rounded-none h-full 
        transition-all duration-300 ease-in-out
        ${isEffectivelyCollapsed ? "w-16" : "w-64"}
        fixed md:relative inset-y-0 left-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header / Logo */}
      <div
        className={`p-4 border-b border-[#1e293b] flex flex-col gap-1.5 ${isEffectivelyCollapsed ? "items-center" : ""}`}
      >
        <div className="flex items-center justify-between w-full">
          {!isEffectivelyCollapsed ? (
            <img
              src="/assets/logos/logo_dark.svg"
              alt="TableTalk"
              className="h-5 w-auto opacity-95 hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="w-6 h-6 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs mx-auto">
              T
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Desktop Collapse Toggle */}
            <button
              className="hidden md:flex text-[#64748b] hover:text-white"
              onClick={() => setIsCollapsed(!isEffectivelyCollapsed)}
            >
              {isEffectivelyCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Toggle */}
            <button
              className="md:hidden text-[#64748b] hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isEffectivelyCollapsed && (
          <div className="text-[12px] text-[var(--text-dim)] uppercase tracking-wider font-semibold truncate mt-0.5">
            {restaurantName} • Control Center
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 flex flex-col px-3 overflow-y-auto no-scrollbar space-y-1 custom-scrollbar">
        {/* Main Menu */}
        {!isEffectivelyCollapsed && (
          <span className="text-[12px] uppercase tracking-widest text-[#64748b] font-bold block px-2 mb-1.5">
            Main Menu
          </span>
        )}
        <NavItem tab="overview" icon={LayoutDashboard} label="Overview" />

        {/* Reviews Section */}
        <SectionHeader sectionKey="reviews" label="Reviews" />
        {openSections.reviews && (
          <div className="space-y-0.5 ml-1 border-l border-[#1e293b] pl-2">
            <NavItem tab="qr_reviews" icon={QrCode} label="TableTalk QR" />
            <NavItem tab="google_reviews" icon={Globe} label="Google Maps" />
            <NavItem tab="other_reviews" icon={Star} label="Yelp & Others" />
          </div>
        )}

        {/* Intelligence Section */}
        <SectionHeader sectionKey="intelligence" label="Intelligence" />
        {openSections.intelligence && (
          <div className="space-y-0.5 ml-1 border-l border-[#1e293b] pl-2">
            <NavItem
              tab="ai_insights"
              icon={BrainCircuit}
              label="AI Insights"
            />
            <NavItem
              tab="recommendations"
              icon={Lightbulb}
              label="Recommendations"
            />
            <NavItem
              tab="competitor_watch"
              icon={Crosshair}
              label="Competitor Watch"
            />
          </div>
        )}

        {/* Customers Section */}
        <SectionHeader sectionKey="customers" label="Customers" />
        {openSections.customers && (
          <div className="space-y-0.5 ml-1 border-l border-[#1e293b] pl-2">
            <NavItem tab="customer_db" icon={Users} label="Customer Database" />
            <NavItem tab="segments" icon={PieChart} label="Segments" disabled />
            <NavItem
              tab="retention"
              icon={Megaphone}
              label="Retention Campaigns"
            />
          </div>
        )}

        {/* Reputation Section */}
        <SectionHeader sectionKey="reputation" label="Reputation" />
        {openSections.reputation && (
          <div className="space-y-0.5 ml-1 border-l border-[#1e293b] pl-2">
            <NavItem
              tab="response_queue"
              icon={Inbox}
              label="Response Queue"
              disabled
            />
            <NavItem
              tab="review_alerts"
              icon={Bell}
              label="Review Alerts"
              disabled
            />
            <NavItem tab="seo_health" icon={Activity} label="SEO Health" />
          </div>
        )}

        {/* Settings Section */}
        <SectionHeader sectionKey="settings" label="Settings" />
        {openSections.settings && (
          <div className="space-y-0.5 ml-1 border-l border-[#1e293b] pl-2 mb-4">
            <NavItem tab="settings" icon={Store} label="Business Profile" />
            <NavItem
              tab="qr_print"
              icon={Printer}
              label="QR Kit & Print"
              disabled
            />
            <NavItem
              tab="team"
              icon={UserCheck}
              label="Team Members"
              disabled
            />
            <NavItem tab="billing" icon={CreditCard} label="Billing" disabled />
          </div>
        )}
      </div>

      {/* Footer / User Profile */}
      <div
        className={`p-4 pb-12 border-t border-[#1e293b] flex flex-col gap-3 ${isEffectivelyCollapsed ? "items-center" : ""}`}
      >
        {!isEffectivelyCollapsed && (
          <div className="px-2 flex flex-col truncate">
            <span className="text-xs text-[var(--foreground)] font-medium truncate">
              Manager Access
            </span>
            <span className="text-[10px] text-[#64748b] truncate">
              {userEmail}
            </span>
          </div>
        )}
        <button
          onClick={onSignOut}
          title={isEffectivelyCollapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-2 px-2 py-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 transition-none rounded-none text-left ${isEffectivelyCollapsed ? "justify-center w-full" : "w-full"}`}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!isEffectivelyCollapsed && (
            <span className="text-xs font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
}
