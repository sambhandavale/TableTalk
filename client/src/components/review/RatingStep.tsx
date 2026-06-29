import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  setRating: (r: number) => void;
  hoverRating: number;
  setHoverRating: (r: number) => void;
  setStep: (s: number) => void;
}

export default function RatingStep({ rating, setRating, hoverRating, setHoverRating, setStep }: Props) {
  return (
    <div className="py-6 flex flex-col items-center space-y-6 animate-fadeIn">
      <h2 className="text-sm font-semibold text-center text-[#cbd5e1]">
        How was your experience with us today?
      </h2>
      
      {/* Interactive Glowing Stars */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              setRating(star);
              setStep(2);
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform active:scale-95 duration-100 focus:outline-none"
          >
            <Star 
              className={`w-10 h-10 transition-colors ${
                star <= (hoverRating || rating)
                  ? "text-[#f59e0b] fill-[#f59e0b] filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  : "text-[#334155]"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      <p className="text-[10px] text-[#64748b] uppercase tracking-wider text-center">
        Tap a star to begin your review
      </p>
    </div>
  );
}
