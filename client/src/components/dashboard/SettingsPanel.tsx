import React, { useState, useEffect } from "react";
import { 
  Save, 
  Clock, 
  DollarSign, 
  Globe, 
  Users,
  Compass,
  CheckCircle,
  AlertCircle,
  Phone,
  Settings as SettingsIcon,
  Trash2,
  Plus,
  Hash,
  Target
} from "lucide-react";

export default function SettingsPanel({ businessId }: { businessId: string }) {
  const [activeTab, setActiveTab] = useState("outlet");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "Mumbai Masala Bistro",
    cuisine: "Indian Fusion",
    location: "Bandra West, Mumbai",
    owner_contact: "owner@mumbaimasala.in",
    maps_url: "",
    seating_capacity: 60,
    contact_phone: "",
    business_hours: "12:00 PM - 11:30 PM",
    cost_for_two: 1200,
    pos_system: "Excel/Manual",
    instagram_handle: "",
    website_url: "",
    dining_duration_mins: 60,
    is_pure_veg: false,
    valet_parking: false,
    has_incentives: false,
    coupons: [] as { discount_amount: string, coupon_code: string, quantity?: string, target_sentiment?: string }[]
  });

  useEffect(() => {
    if (!businessId) return;
    
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/onboard/${businessId}/status`);
        if (!response.ok) throw new Error("Business not found.");
        
        const data = await response.json();
        if (data.business) {
          setFormData(prev => ({
            ...prev,
            ...data.business,
            seating_capacity: Number(data.business.seating_capacity || 60),
            cost_for_two: Number(data.business.cost_for_two || 1200),
            dining_duration_mins: Number(data.business.dining_duration_mins || 60),
            is_pure_veg: Boolean(data.business.is_pure_veg),
            valet_parking: Boolean(data.business.valet_parking),
            has_incentives: Boolean(data.business.has_incentives),
            coupons: data.business.coupons || []
          }));
        }
      } catch (err) {
        console.warn("Using seeded fallback.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [businessId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`http://localhost:8000/api/onboard/${businessId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
          seating_capacity: Number(formData.seating_capacity),
          has_incentives: formData.has_incentives,
          coupons: formData.coupons
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      setMessage({ type: "success", text: "Settings saved successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save." });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setMessage(prev => prev.type === "success" ? { type: "", text: "" } : prev);
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-2 border-[#1e293b] border-t-[#a855f7] rounded-none animate-spin" />
        <span className="text-[10px] text-[#64748b]">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl w-full">
      
      <div className="pb-4 border-b border-[#1e293b]">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-1 text-[var(--foreground)]">
          <SettingsIcon className="w-4 h-4 text-[#a855f7]" />
          Outlet Configuration
        </h2>
        <p className="text-[11px] text-[#64748b]">
          Manage POS integrations, business hours, and operational metrics.
        </p>
      </div>

      {message.text && (
        <div className={`p-3 border flex items-center gap-2 text-[10px] font-semibold rounded-none ${
          message.type === "success" 
            ? "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]" 
            : "bg-[#f43f5e]/10 border-[#f43f5e]/20 text-[#f43f5e]"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* TAB CONTROLLERS */}
      <div className="flex border-b border-[#1e293b]">
        <button
          onClick={() => setActiveTab("outlet")}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold transition-colors border-b-2 ${
            activeTab === "outlet" ? "text-white border-[#a855f7]" : "text-[#64748b] border-transparent hover:text-white"
          }`}
        >
          Operations
        </button>
        <button
          onClick={() => setActiveTab("web")}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold transition-colors border-b-2 ${
            activeTab === "web" ? "text-white border-[#a855f7]" : "text-[#64748b] border-transparent hover:text-white"
          }`}
        >
          Web Integrations
        </button>
        <button
          onClick={() => setActiveTab("incentives")}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest font-semibold transition-colors border-b-2 ${
            activeTab === "incentives" ? "text-white border-[#a855f7]" : "text-[#64748b] border-transparent hover:text-white"
          }`}
        >
          Incentives
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0c0516] border border-[#1e293b] p-6 rounded-none space-y-6">
        
        {activeTab === "outlet" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Business Hours</label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                  <input 
                    type="text" name="business_hours" value={formData.business_hours} onChange={handleInputChange}
                    placeholder="12:00 PM - 11:30 PM" required
                    className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Cost for Two (INR)</label>
                <div className="relative flex items-center">
                  <DollarSign className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                  <input 
                    type="number" name="cost_for_two" value={formData.cost_for_two} onChange={handleInputChange}
                    required className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Seating Capacity</label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                  <input 
                    type="number" name="seating_capacity" value={formData.seating_capacity} onChange={handleInputChange}
                    required className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Dining Duration (mins)</label>
                <div className="relative flex items-center">
                  <Clock className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                  <input 
                    type="number" name="dining_duration_mins" value={formData.dining_duration_mins} onChange={handleInputChange}
                    required className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Alerts WhatsApp</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                  <input 
                    type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">POS System</label>
                <select 
                  name="pos_system" value={formData.pos_system} onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                >
                  <option value="Excel/Manual">Excel / Manual Upload</option>
                  <option value="Petpooja">Petpooja (India)</option>
                  <option value="POSist">POSist / Prime</option>
                  <option value="Toast">Toast POS</option>
                  <option value="Square">Square Business</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <button type="button" onClick={() => handleCheckboxChange("is_pure_veg", !formData.is_pure_veg)}
                className={`p-3 border text-left flex items-center justify-between transition-colors rounded-none ${
                  formData.is_pure_veg ? "bg-[#a855f7]/10 border-[#a855f7]" : "bg-[#1e293b]/10 border-[#1e293b]"
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-white block">Pure Vegetarian</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#64748b] block mt-0.5">No meat</span>
                </div>
                <div className={`w-3 h-3 border rounded-none transition-colors ${
                  formData.is_pure_veg ? "bg-[#a855f7] border-[#a855f7]" : "bg-transparent border-[#64748b]"
                }`} />
              </button>

              <button type="button" onClick={() => handleCheckboxChange("valet_parking", !formData.valet_parking)}
                className={`p-3 border text-left flex items-center justify-between transition-colors rounded-none ${
                  formData.valet_parking ? "bg-[#a855f7]/10 border-[#a855f7]" : "bg-[#1e293b]/10 border-[#1e293b]"
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-white block">Valet Parking</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#64748b] block mt-0.5">Complimentary</span>
                </div>
                <div className={`w-3 h-3 border rounded-none transition-colors ${
                  formData.valet_parking ? "bg-[#a855f7] border-[#a855f7]" : "bg-transparent border-[#64748b]"
                }`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "web" && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Instagram Handle</label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                <input 
                  type="text" name="instagram_handle" value={formData.instagram_handle} onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Website URL</label>
              <div className="relative flex items-center">
                <Globe className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                <input 
                  type="url" name="website_url" value={formData.website_url} onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Google Maps Node</label>
              <div className="relative flex items-center">
                <Compass className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                <input 
                  type="url" value={formData.maps_url} disabled
                  className="w-full pl-9 pr-3 py-2 bg-[#0c0516] border border-[#1e293b] text-xs text-[#64748b] cursor-not-allowed rounded-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "incentives" && (
          <div className="space-y-5">
            <div className="bg-[#1e293b]/20 p-4 border border-[#1e293b]">
              <h3 className="text-xs font-bold text-white mb-1">CRM Milestones & Rewards</h3>
              <p className="text-[10px] text-[#64748b] leading-relaxed">
                Configure your automated review milestone rewards. Customers who leave reviews frequently will unlock these dynamic vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <button type="button" onClick={() => handleCheckboxChange("has_incentives", !formData.has_incentives)}
                className={`p-3 border text-left flex items-center justify-between transition-colors rounded-none ${
                  formData.has_incentives ? "bg-[#a855f7]/10 border-[#a855f7]" : "bg-[#1e293b]/10 border-[#1e293b]"
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-white block">Enable CRM Incentives</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#64748b] block mt-0.5">Automated Rewards</span>
                </div>
                <div className={`w-3 h-3 border rounded-none transition-colors ${
                  formData.has_incentives ? "bg-[#a855f7] border-[#a855f7]" : "bg-transparent border-[#64748b]"
                }`} />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {formData.coupons.map((coupon, idx) => (
                <div key={idx} className="bg-[#1e293b]/10 border border-[#1e293b] p-4 relative space-y-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      const newCoupons = [...formData.coupons];
                      newCoupons.splice(idx, 1);
                      setFormData(prev => ({ ...prev, coupons: newCoupons }));
                    }}
                    className="absolute top-3 right-3 text-[#f43f5e] hover:text-[#f43f5e]/80 transition-colors"
                    disabled={!formData.has_incentives}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pr-6">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Discount Amount Description</label>
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                        <input 
                          type="text" 
                          value={coupon.discount_amount} 
                          onChange={(e) => {
                            const newCoupons = [...formData.coupons];
                            newCoupons[idx].discount_amount = e.target.value;
                            setFormData(prev => ({ ...prev, coupons: newCoupons }));
                          }}
                          placeholder="e.g. 15% OFF, Free Dessert"
                          className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none disabled:opacity-50"
                          disabled={!formData.has_incentives}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Coupon Code</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 w-3.5 h-3.5 text-[#64748b] font-mono font-bold text-xs">#</span>
                        <input 
                          type="text" 
                          value={coupon.coupon_code} 
                          onChange={(e) => {
                            const newCoupons = [...formData.coupons];
                            newCoupons[idx].coupon_code = e.target.value;
                            setFormData(prev => ({ ...prev, coupons: newCoupons }));
                          }}
                          placeholder="e.g. DELICIOUS15"
                          className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white uppercase focus:outline-none focus:border-[#a855f7] rounded-none disabled:opacity-50 font-mono"
                          disabled={!formData.has_incentives}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Stock Quantity</label>
                      <div className="relative flex items-center">
                        <Hash className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                        <input 
                          type="number" 
                          value={coupon.quantity !== undefined ? coupon.quantity : ""} 
                          onChange={(e) => {
                            const newCoupons = [...formData.coupons];
                            newCoupons[idx].quantity = e.target.value;
                            setFormData(prev => ({ ...prev, coupons: newCoupons }));
                          }}
                          placeholder="Unlimited"
                          className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none disabled:opacity-50 font-mono"
                          disabled={!formData.has_incentives}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold block">Target Rule</label>
                      <div className="relative flex items-center">
                        <Target className="absolute left-3 w-3.5 h-3.5 text-[#64748b]" />
                        <select 
                          value={coupon.target_sentiment || "all"} 
                          onChange={(e) => {
                            const newCoupons = [...formData.coupons];
                            newCoupons[idx].target_sentiment = e.target.value;
                            setFormData(prev => ({ ...prev, coupons: newCoupons }));
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-[#1e293b]/20 border border-[#1e293b] text-xs text-white focus:outline-none focus:border-[#a855f7] rounded-none disabled:opacity-50 appearance-none"
                          disabled={!formData.has_incentives}
                        >
                          <option value="all">Any Review</option>
                          <option value="positive">Positive Reviews Only (4-5★)</option>
                          <option value="negative">Negative Reviews Only (1-3★)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    coupons: [...prev.coupons, { discount_amount: "", coupon_code: "", quantity: "", target_sentiment: "all" }]
                  }));
                }}
                disabled={!formData.has_incentives}
                className="mt-2 px-4 py-2 border border-[#a855f7] bg-transparent text-[#a855f7] hover:bg-[#a855f7]/10 text-[10px] font-bold rounded-none flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Coupon
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[#1e293b]">
          <button
            type="submit" disabled={isSaving}
            className={`px-4 py-2 border border-[#a855f7] bg-[#a855f7]/10 text-[#a855f7] hover:bg-[#a855f7] hover:text-black text-[10px] font-bold rounded-none flex items-center gap-1.5 transition-colors ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
              <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-none animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-3 h-3" /> Save Changes</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
