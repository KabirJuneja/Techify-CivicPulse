import React from 'react';
import { ShieldCheck, CalendarCheck, Map, ArrowRight } from 'lucide-react';
import { Language, ModalType } from '../types';
import { translations } from '../translations';
import NagarXLogo from './NagarXLogo';
import realHeroImg from '../assets/images/ahmedabad_hero_real_1789766454218.jpg';

interface HeroProps {
  language: Language;
  onOpenModal: (type: ModalType) => void;
}

export default function Hero({ language, onOpenModal }: HeroProps) {
  const t = translations[language].hero;

  return (
    <section id="about" className="relative bg-white pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Section */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left">
            
            {/* Official Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-50/70 border border-blue-100/80 px-3.5 py-1.5 rounded-full select-none">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-extrabold text-blue-900 tracking-wide uppercase">
                {t.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05] uppercase">
              {t.heading1}
              <span className="block text-blue-600 mt-1 font-black">
                {t.heading2}
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              {t.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => onOpenModal('report')}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>{t.ctaPrimary.replace(' →', '')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onOpenModal('map')}
                className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base rounded-2xl border border-slate-200/85 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>{t.ctaSecondary.replace(' 🧭', '')}</span>
                <span>🧭</span>
              </button>
            </div>

            {/* Under-badge trust markers */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
                <span>{t.noAadhaar}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
                <CalendarCheck className="w-4.5 h-4.5 text-blue-500" />
                <span>{t.sla}</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Section */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 shadow-slate-200/80 animate-in fade-in slide-in-from-right-8 duration-500">
              <img 
                src={realHeroImg} 
                alt="Amdavad Municipal Corporation & BRTS Smart City Ahmedabad" 
                className="w-full h-auto object-cover aspect-[16/10] hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Official Brand Logo Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-slate-100 flex items-center space-x-2">
                <NagarXLogo size="sm" showTagline={false} />
              </div>
              
              {/* Floating Status Bar Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-inner">
                    <Map className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 tracking-tight leading-tight">
                      Bodakdev, Ward 8
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                      2 New Potholes Repaired Today
                    </span>
                  </div>
                </div>
                
                {/* Live Badge */}
                <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full select-none shrink-0">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-[9px] font-black text-emerald-700 tracking-wider uppercase">
                    {t.liveSync}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
