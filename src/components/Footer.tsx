import React from 'react';
import { Globe, Phone, Info, ShieldAlert, Accessibility, Database } from 'lucide-react';
import { Language, ModalType } from '../types';
import { translations } from '../translations';
import NagarXLogo from './NagarXLogo';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenModal: (type: ModalType) => void;
}

export default function Footer({ language, onLanguageChange, onOpenModal }: FooterProps) {
  const t = translations[language].footer;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  const footerLinks = [
    { label: t.linkAbout, icon: <Info className="w-3.5 h-3.5" /> },
    { label: t.linkAccess, icon: <Accessibility className="w-3.5 h-3.5" /> },
    { label: t.linkPrivacy, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { label: t.linkRecords, icon: <Database className="w-3.5 h-3.5" /> },
  ];

  return (
    <footer className="bg-slate-100 border-t border-slate-200 select-none">
      
      {/* Dynamic Language Selection & Helpline Bar */}
      <div className="bg-blue-50/70 border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Language Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{t.langLabel}</span>
            </div>
            
            <div className="flex items-center p-1 bg-slate-200/60 rounded-xl border border-slate-300/30">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Helpline and Toll free info */}
          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-1 text-xs font-bold text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>{t.tollFree}</span>
            </div>
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>{t.seniorHelp}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top links row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          
          {/* Identity */}
          <div className="flex items-center space-x-3">
            <NagarXLogo size="sm" showTagline={true} />
            <span className="text-xs text-slate-400 font-semibold hidden lg:inline-block">— {t.desc}</span>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onOpenModal('join')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Bottom row: Copyright & Nominal status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400">
          <p className="text-center sm:text-left leading-relaxed max-w-md">
            {t.copyright}
          </p>
          
          {/* Grid operational status */}
          <div className="flex items-center space-x-1.5 shrink-0 bg-emerald-50 border border-emerald-100/60 px-3 py-1 rounded-full text-emerald-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span>{t.gridStatus.replace('City Grid Status: ', '')}</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
