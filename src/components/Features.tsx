import React from 'react';
import { AlertTriangle, Users, ShieldCheck, CheckCircle2, UserCheck, Eye } from 'lucide-react';
import { Language, ModalType } from '../types';
import { translations } from '../translations';

interface FeaturesProps {
  language: Language;
  onOpenModal: (type: ModalType) => void;
}

export default function Features({ language, onOpenModal }: FeaturesProps) {
  const t = translations[language].features;

  return (
    <section id="features" className="bg-slate-50/50 py-16 md:py-24 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {t.heading}
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Report */}
          <div 
            onClick={() => onOpenModal('report')}
            className="group bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-blue-300 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  {t.f1Title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {t.f1Desc}
                </p>
              </div>
            </div>
            
            {/* Bottom Link Badge */}
            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center space-x-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
              <span>{t.f1Link}</span>
            </div>
          </div>

          {/* Card 2: Connect */}
          <div 
            onClick={() => onOpenModal('join')}
            className="group bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-blue-300 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  {t.f2Title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {t.f2Desc}
                </p>
              </div>
            </div>
            
            {/* Bottom Link Badge */}
            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center space-x-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <UserCheck className="w-4 h-4 shrink-0 text-blue-500" />
              <span>{t.f2Link}</span>
            </div>
          </div>

          {/* Card 3: Transparent Updates */}
          <div 
            onClick={() => onOpenModal('map')}
            className="group bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-blue-300 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  {t.f3Title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {t.f3Desc}
                </p>
              </div>
            </div>
            
            {/* Bottom Link Badge */}
            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center space-x-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <Eye className="w-4 h-4 shrink-0 text-blue-500" />
              <span>{t.f3Link}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
