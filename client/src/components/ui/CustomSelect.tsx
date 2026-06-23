"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[] | string[];
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  dropdownClassName = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions = options.map(opt => 
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value) || normalizedOptions[0];

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between text-left transition-colors duration-200 outline-none ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        <span className="truncate pr-2">{selectedOption?.label || value}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full min-w-max mt-1.5 py-1 bg-[#0c0516]/90 border border-[#1e293b] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-fadeIn ${dropdownClassName}`}>
          <ul className="max-h-60 overflow-y-auto custom-scrollbar no-scrollbar text-left text-[11px] font-medium">
            {normalizedOptions.map((opt, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors duration-150 ${
                    value === opt.value
                      ? "bg-[#a855f7] text-white font-bold"
                      : "text-[var(--foreground)] hover:bg-[#1e293b]"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
