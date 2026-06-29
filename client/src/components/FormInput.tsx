import React, { forwardRef, InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={props.id} className="text-[10px] font-bold text-[var(--foreground)] uppercase tracking-wider block">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && <Icon className="absolute left-3.5 w-4 h-4 text-[var(--text-dim)]" aria-hidden="true" />}
          <input
            ref={ref}
            aria-label={label || props.name}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl bg-[var(--orb-bg)] border border-[var(--orb-border)] text-xs text-[var(--foreground)] placeholder-white focus:outline-none focus:border-[var(--brand-purple-text)] focus:ring-1 focus:ring-[var(--brand-purple-text)]/20 transition-all duration-300 ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p id={`${props.id}-error`} className="text-[10px] text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
