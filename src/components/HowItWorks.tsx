import React from 'react';
import { Eye, Camera, Network, CheckSquare, Compass, Mic, Hourglass, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HowItWorksProps {
  language: Language;
}

export default function HowItWorks({ language }: HowItWorksProps) {
  const t = translations[language].howItWorks;

  const steps = [
    {
      num: "1",
      title: t.s1Title,
      desc: t.s1Desc,
      icon: <Eye className="w-5 h-5 text-blue-600" />,
      bottomIcon: <Compass className="w-3.5 h-3.5 text-blue-500 mr-1" />,
      bottomText: t.s1Link,
    },
    {
      num: "2",
      title: t.s2Title,
      desc: t.s2Desc,
      icon: <Camera className="w-5 h-5 text-blue-600" />,
      bottomIcon: <Mic className="w-3.5 h-3.5 text-blue-500 mr-1" />,
      bottomText: t.s2Link,
    },
    {
      num: "3",
      title: t.s3Title,
      desc: t.s3Desc,
      icon: <Network className="w-5 h-5 text-blue-600" />,
      bottomIcon: <Hourglass className="w-3.5 h-3.5 text-blue-500 mr-1" />,
      bottomText: t.s3Link,
    },
    {
      num: "4",
      title: t.s4Title,
      desc: t.s4Desc,
      icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
      bottomIcon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />,
      bottomText: t.s4Link,
      isGreen: true,
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Left-Right Distribution */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="space-y-3">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
              {t.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {t.heading}
            </h2>
          </div>
          <div className="md:max-w-md">
            <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div 
              key={step.num}
              className="relative bg-slate-50/50 rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:border-blue-200/80 transition-colors"
            >
              {/* Giant Background Number watermarked */}
              <span className="absolute right-4 top-1 text-[120px] font-black text-slate-100 leading-none select-none pointer-events-none -z-0">
                {step.num}
              </span>

              {/* Main content */}
              <div className="space-y-5 relative z-10 text-left">
                {/* Icon Wrapper */}
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                  {step.icon}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Badge Link */}
              <div className="mt-8 pt-4 border-t border-slate-100/70 flex items-center text-xs font-bold relative z-10">
                <div className={`flex items-center ${step.isGreen ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {step.bottomIcon}
                  <span>{step.bottomText}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
