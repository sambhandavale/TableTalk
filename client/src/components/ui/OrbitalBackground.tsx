import React from "react";

export default function OrbitalBackground() {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[750px] aspect-square border border-white/[0.04] rounded-full pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] aspect-square border border-white/[0.08] rounded-full border-dashed animate-spin-slow pointer-events-none"
        style={{ animationDuration: "50s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] aspect-square border border-[var(--brand-purple-text)]/10 rounded-full animate-spin-slow pointer-events-none"
        style={{ animationDirection: "reverse", animationDuration: "40s" }}
      />
    </>
  );
}
