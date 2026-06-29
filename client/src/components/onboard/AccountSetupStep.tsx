import React from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface Props {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export default function AccountSetupStep({ formData, handleInputChange, showPassword, setShowPassword }: Props) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          GM / Owner Full Name
        </label>
        <div className="relative flex items-center">
          <User className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="Amit Kumar"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          Business Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="manager@spicegarden.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
          Security Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[var(--text-dim)] hover:text-[var(--foreground)]"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <span className="text-[12px] text-[var(--text-dim)] block">
          Must be at least 6 characters.
        </span>
      </div>
    </div>
  );
}
