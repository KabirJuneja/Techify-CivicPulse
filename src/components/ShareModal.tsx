import React, { useState } from 'react';
import { X, Copy, Check, Send, Mail, Link } from 'lucide-react';
import { Language } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function ShareModal({ isOpen, onClose, language }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Link className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-800 text-lg">
              {language === 'en' ? 'Share Initiative' : 'ઝુંબેશ શેર કરો'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {language === 'en' 
              ? 'Inspire your neighborhood society to join the Sabarmati Riverfront tree plantation drive. Share the link directly on your WhatsApp group.' 
              : 'તમારી સોસાયટીના સભ્યો અને પડોશીઓને સાબરમતી ગ્રીન ઝુંબેશમાં જોડાવા માટે પ્રેરિત કરો. નીચે આપેલ લિંક વોટ્સએપ પર શેર કરો.'}
          </p>

          {/* Copyable link field */}
          <div className="flex items-center space-x-2 border border-slate-200 bg-slate-50 rounded-xl p-2.5">
            <span className="text-xs text-slate-500 font-medium truncate flex-1 select-all">
              {shareUrl}
            </span>
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Share Channels */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Join the Sabarmati Riverfront Tree Plantation Drive this Saturday on NAGAR-X: ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-100/60 transition-all text-center"
            >
              <Send className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp Group</span>
            </a>
            
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Let's plant 1,200 saplings together at the Sabarmati Riverfront this Saturday! RSVP via NAGAR-X: ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs rounded-xl border border-blue-100/60 transition-all text-center"
            >
              <Send className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Share to X (Twitter)</span>
            </a>
          </div>

          {/* Footer lock note */}
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow"
          >
            {language === 'en' ? 'Close' : 'બંધ કરો'}
          </button>
        </div>

      </div>
    </div>
  );
}
