import React from "react";
import { Utensils, MapPin, Users } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
  formData: any;
  setFormData: (val: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function BusinessProfileStep({ formData, setFormData, handleInputChange }: Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
            Business Name
          </label>
          <div className="relative flex items-center">
            <Utensils className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleInputChange}
              placeholder="Spice Garden Bistro"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
            Cuisine Concept
          </label>
          <div className="relative flex items-center">
            <CustomSelect
              value={formData.cuisine}
              onChange={(val) => setFormData((prev: any) => ({ ...prev, cuisine: val }))}
              options={[
                "Indian Fusion",
                "Multi-Cuisine Cafe",
                "Lounge & Grill",
                "Coastal Seafood",
                "Asian Diner",
                "Continental & European",
                "Italian Pizzeria",
                "Mexican Cantina",
                "Fast Food & Burgers",
                "Bakery & Desserts",
              ]}
              className="w-full px-3.5 py-3 rounded-xl bg-[var(--brand-card)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--brand-purple-text)] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          Physical Address / City Area
        </label>
        <div className="relative flex items-center">
          <MapPin className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Bandra West, Mumbai"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          Seating Capacity
        </label>
        <div className="relative flex items-center">
          <Users className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleInputChange}
            placeholder="60"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            min="5"
            max="1000"
            required
          />
        </div>
      </div>
    </div>
  );
}
