import React, { useState } from 'react';
import { MapPin, Users, Calendar, Sparkles, Share2, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Language, ModalType } from '../types';
import { translations } from '../translations';

interface GrassrootsSpotlightProps {
  language: Language;
  onOpenModal: (type: ModalType) => void;
  volunteerCount: number;
  hasRSVPed: boolean;
}

export default function GrassrootsSpotlight({ language, onOpenModal, volunteerCount, hasRSVPed }: GrassrootsSpotlightProps) {
  const t = translations[language].grassroots;

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-10 text-left">
          <div className="space-y-3">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
              {t.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {t.heading}
            </h2>
          </div>
          <button 
            onClick={() => onOpenModal('join')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1 whitespace-nowrap"
          >
            <span>{t.viewAll}</span>
          </button>
        </div>

        {/* Major Initiative Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-6xl mx-auto">
          
          {/* Left Column: Image with Badge Overlay */}
          <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-full min-h-[320px] bg-slate-100 overflow-hidden">
            <img 
              src="/src/assets/images/sabarmati_riverfront_drive_1789740233986.jpg" 
              alt="Volunteers planting trees along Sabarmati Riverfront" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Live Indicator / Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 bg-blue-600 border border-blue-500 text-white px-3.5 py-1.5 rounded-full select-none shadow">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black tracking-wide uppercase">
                {t.badge}
              </span>
            </div>
          </div>

          {/* Right Column: Text & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between text-left space-y-6">
            
            {/* Location & Title */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 text-xs font-bold text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t.location}</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {t.title}
              </h3>
              
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {t.desc}
              </p>
            </div>

            {/* Quick Stats Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Volunteers Stat Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center space-x-3.5 text-left">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-inner shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-800 tracking-tight">
                    {volunteerCount}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.volunteers}
                  </span>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-blue-50/55 border border-blue-100/50 rounded-2xl p-4 flex items-center space-x-3.5 text-left">
                <div className="p-2.5 bg-blue-100/60 text-blue-700 rounded-xl shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-blue-900 leading-tight">
                    {t.timeLabel}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mt-0.5">
                    {t.timeValue}
                  </span>
                </div>
              </div>

            </div>

            {/* Event CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-100">
              {hasRSVPed ? (
                <button
                  disabled
                  className="flex-1 px-5 py-3.5 bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2"
                >
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  <span>RSVP Confirmed (Joined)</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenModal('rsvp')}
                  className="flex-1 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{t.rsvpBtn}</span>
                </button>
              )}
              
              <button
                onClick={() => onOpenModal('share')}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200/90 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{t.shareBtn}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
