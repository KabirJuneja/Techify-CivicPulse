import React from 'react';
import { AreaChart, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface PublicPulseProps {
  language: Language;
}

export default function PublicPulse({ language }: PublicPulseProps) {
  const t = translations[language].pulse;

  const stats = [
    {
      num: "1,420+",
      label: t.stat1Title.includes("1,420") ? "Resolved Issues" : "ઉકેલાયેલા પ્રશ્નો",
      desc: t.stat1Desc.split(' • ')[1] || t.stat1Desc,
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      progress: "85%",
    },
    {
      num: "48 / 48",
      label: t.stat2Title.includes("48") ? "AMC Wards" : "AMC વોર્ડ્સ",
      desc: t.stat2Desc.split(' • ')[1] || t.stat2Desc,
      icon: <AreaChart className="w-5 h-5 text-blue-400" />,
      progress: "100%",
    },
    {
      num: "64,000+",
      label: t.stat3Title.includes("64,000") ? "Active Citizens" : "સક્રિય નાગરિકો",
      desc: t.stat3Desc.split(' • ')[1] || t.stat3Desc,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      progress: "92%",
    },
  ];

  return (
    <section id="city-pulse" className="bg-slate-950 text-white py-16 md:py-20 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/10 text-xs font-bold text-blue-400 uppercase tracking-widest border border-blue-500/20">
              {t.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15] text-white uppercase">
              {t.heading}
            </h2>
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Right Stat Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {stats.map((stat) => (
              <div 
                key={stat.num}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 text-left hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {stat.num}
                  </span>
                  <div className="p-2 bg-slate-800/60 rounded-xl">
                    {stat.icon}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-200 block">
                    {stat.label}
                  </span>
                  <p className="text-slate-500 text-[11px] font-semibold">
                    {stat.desc}
                  </p>
                </div>

                {/* Loading Visual Progress Line */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    style={{ width: stat.progress }}
                    className="bg-blue-500 h-full rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
