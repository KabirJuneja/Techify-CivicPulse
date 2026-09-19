import React, { useState } from 'react';
import { X, Check, Calendar, MapPin, QrCode, ClipboardCheck } from 'lucide-react';
import { Language } from '../types';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmRSVP: () => void;
}

export default function RsvpModal({ isOpen, onClose, language, onConfirmRSVP }: RsvpModalProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', society: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Name and Phone are required!');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketId(`VOL-SAB-${Math.floor(100 + Math.random() * 900)}`);
      setSuccess(true);
      onConfirmRSVP();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-800 text-lg">
              {language === 'en' ? 'Volunteer Registration' : 'સ્વયંસેવક નોંધણી'}
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
        <div className="p-6">
          {success ? (
            /* Success Ticket Pass */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-black text-emerald-900 text-lg">
                  {language === 'en' ? 'Registration Confirmed!' : 'નોંધણી સફળ રહી!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Thank you for stepping up to make Ahmedabad cleaner.' : 'અમદાવાદને સ્વચ્છ બનાવવા પહેલ કરવા બદલ આભાર.'}
                </p>
              </div>

              {/* Pass Visual */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass ID</span>
                    <div className="text-sm font-black text-slate-800">{ticketId}</div>
                  </div>
                  <div className="bg-white p-1 border border-slate-200 rounded">
                    <QrCode className="w-8 h-8 text-slate-800" />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Event:</span>
                    <span className="text-slate-700 font-black ml-1">Sabarmati Riverfront Green Drive</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Volunteer Name:</span>
                    <span className="text-slate-700 font-black ml-1">{formData.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-1 text-[11px] text-blue-600 font-extrabold bg-blue-50 border border-blue-100 p-2 rounded-lg">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Meeting Point: Riverfront Promenade (West Zone), 7:00 AM</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all shadow-md"
              >
                {language === 'en' ? 'Done' : 'પૂર્ણ'}
              </button>
            </div>
          ) : (
            /* RSVP Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs text-slate-500 leading-relaxed font-semibold">
                {language === 'en' 
                  ? 'Join SEWA youth volunteers and AMC sanitation teams in planting 1,200 native saplings. Register below to receive your digital entry pass and safety guidelines.' 
                  : '૧,૨૦૦ દેશી રોપાઓ વાવવાની આ ઝુંબેશમાં જોડાવવા માટે તમારું નામ અને મોબાઈલ નંબર દાખલ કરી સ્વયંસેવક પાસ મેળવો.'}
              </div>

              {/* Name */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'en' ? 'Your Full Name' : 'તમારું પૂરું નામ'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ketan Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'en' ? 'Your Phone Number' : 'મોબાઈલ નંબર'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm"
                />
              </div>

              {/* Society / Area */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'en' ? 'Neighborhood/Society Name (Optional)' : 'સોસાયટી/વિસ્તારનું નામ (વૈકલ્પિક)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Radhe Heights, Naranpura"
                  value={formData.society}
                  onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:border-slate-300 transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'રદ કરો'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{language === 'en' ? 'Registering...' : 'નોંધણી ચાલુ છે...'}</span>
                    </>
                  ) : (
                    <span>{language === 'en' ? 'Register Now' : 'નોંધણી કરો'}</span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
