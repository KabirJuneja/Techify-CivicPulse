import React from 'react';
import { UserPlus, ShieldAlert } from 'lucide-react';
import { Language, ModalType } from '../types';
import { translations } from '../translations';

interface CallToActionProps {
  language: Language;
  onOpenModal: (type: ModalType) => void;
}

export default function CallToAction({ language, onOpenModal }: CallToActionProps) {
  const t = translations[language].cta;

  return (
    <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-950 text-white rounded-[32px] p-8 sm:p-12 md:p-16 text-center space-y-6 md:space-y-8 shadow-xl border border-slate-900 overflow-hidden relative">
          
          {/* Subtle background glow circles for design depth */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-[64px] pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-[64px] pointer-events-none"></div>

          {/* Eyebrow Label */}
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-black tracking-widest uppercase border border-blue-500/20 select-none">
              {t.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto uppercase">
            {t.heading}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base font-semibold max-w-xl mx-auto leading-relaxed">
            {t.desc}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3.5 pt-4 max-w-md mx-auto">
            <button
              onClick={() => onOpenModal('join')}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <UserPlus className="w-4.5 h-4.5" />
              <span>{t.btnPrimary}</span>
            </button>
            <button
              onClick={() => onOpenModal('report')}
              className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              <ShieldAlert className="w-4.5 h-4.5 text-slate-300" />
              <span>{t.btnSecondary}</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
