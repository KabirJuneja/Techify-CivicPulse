import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface TestimonialsProps {
  language: Language;
}

export default function Testimonials({ language }: TestimonialsProps) {
  const t = translations[language].voices;

  const cards = [
    {
      stars: 5,
      quote: t.t1Quote,
      translation: t.t1Translation,
      initials: "હ",
      avatarBg: "bg-blue-100 text-blue-800",
      author: t.t1Author,
      role: t.t1Role,
    },
    {
      stars: 5,
      quote: t.t2Quote,
      translation: t.t2Translation,
      initials: "P",
      avatarBg: "bg-indigo-100 text-indigo-800",
      author: t.t2Author,
      role: t.t2Role,
    },
    {
      stars: 5,
      quote: t.t3Quote,
      translation: t.t3Translation,
      initials: "R",
      avatarBg: "bg-purple-100 text-purple-800",
      author: t.t3Author,
      role: t.t3Role,
    },
  ];

  return (
    <section className="bg-slate-50/55 py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
            {t.heading}
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/70 p-7 shadow-sm hover:shadow-md hover:border-blue-200/50 transition-all text-left flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Star Ratings */}
                <div className="flex items-center space-x-1">
                  {[...Array(card.stars)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>

                {/* Primary Quote */}
                <div className="relative">
                  <p className="text-slate-800 text-sm font-black leading-relaxed relative z-10 font-gujarati">
                    {card.quote}
                  </p>
                </div>

                {/* English translation or secondary annotation */}
                {card.translation && (
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed border-t border-slate-50 pt-3.5">
                    {card.translation}
                  </p>
                )}
              </div>

              {/* User Bio Footer */}
              <div className="flex items-center space-x-3.5 mt-8 pt-4 border-t border-slate-100/60">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm select-none shrink-0 ${card.avatarBg}`}>
                  {card.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-slate-800 truncate">
                    {card.author}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 truncate mt-0.5">
                    {card.role}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
