"use client";

import React, { useState } from "react";

export default function FaqAccordion() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const faqs = [
    {
      id: "001",
      question: "Diners leave quietly and post 1-star public reviews",
      answer: "TableTalk intercepts negative dining ratings at the point-of-experience via our smart QR bill tent, capturing complaints privately and notifying floor captains immediately so you can fix the issue before the customer exits the door."
    },
    {
      id: "002",
      question: "No way to contact or retrieve past physical customers",
      answer: "When customers leave a contact detail in exchange for a dynamic loyalty coupon, our retention agent automatically segments them into VIPs, At-Risk, or Lost cohorts and dispatches targeted apology vouchers to bring them back."
    },
    {
      id: "003",
      question: "Reputation declines quietly because Google reviews are ignored",
      answer: "Posting consistent replies to public reviews boosts local Google Maps SEO visibility. Our response agent continuously watches listings, auto-drafts brand-matching response templates, and lets you approve and post in one tap."
    },
    {
      id: "004",
      question: "Blind to operational and food-quality patterns",
      answer: "Our pattern analysis agent aggregates sentiment trends over time. It tells you exactly which dish drives 5-star ratings (e.g. highlight Mutton Biryani on Google) and which time slots experience delays, translating graphs into operational action checklists."
    }
  ];

  return (
    <section id="faq" className="py-24 max-w-5xl mx-auto px-6 md:px-12 relative z-10 border-t border-white/[0.04]">
      <div className="text-left space-y-4 mb-16">
        <span className="text-xs font-bold text-[#c77dff] uppercase tracking-widest block">Operational FAQ</span>
        <h3 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight leading-tight max-w-2xl">
          We help solve some of offline brands' biggest reputation & retention challenges
        </h3>
      </div>

      {/* Stateful Accordion List */}
      <div className="border-t border-white/[0.06] divide-y divide-white/[0.06] text-left">
        {faqs.map((item, idx) => {
          const isOpen = openFaqIdx === idx;
          const toggleOpen = () => setOpenFaqIdx(isOpen ? null : idx);
          return (
            <div key={item.id} className="py-6 font-sans">
              <button
                onClick={toggleOpen}
                className="w-full flex items-center justify-between text-left gap-6 group cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="text-[10px] font-mono font-bold text-white/30 tracking-widest group-hover:text-[#c77dff] transition-colors">
                    {item.id}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#c77dff] transition-colors leading-snug">
                    {item.question}
                  </h4>
                </div>
                <span className="text-lg text-white/40 group-hover:text-white font-light pl-4 select-none transition-transform">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              
              {/* Expandable Panel */}
              <div 
                className={`grid transition-all duration-300 ease-in-out overflow-hidden text-xs text-white/60 font-light leading-relaxed pl-12 md:pl-20 ${
                  isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-3xl pb-2">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
