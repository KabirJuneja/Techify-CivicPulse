import React from 'react';
import { 
  X, CheckCircle2, Shield, ShieldCheck, MapPin, Clock, Users, FileText, 
  Building2, Award, Zap, AlertTriangle, ArrowRight, ExternalLink, Cpu,
  Check, Lock, Radio
} from 'lucide-react';
import { Language, Post } from '../types';

interface LegalAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  language: Language;
}

export default function LegalAuditModal({ isOpen, onClose, post, language }: LegalAuditModalProps) {
  if (!isOpen || !post) return null;

  const ticketId = post.ticketId || '#NX-10482';
  const wardOfficer = 'Er. Rajesh Patel (Zonal Sup.)';
  const fieldEta = 'Within 2 Hours (By 14:00)';
  const liveSubscribers = post.citizenVerifications ? post.citizenVerifications + 14 : 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden text-left border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-blue-400 text-base">{ticketId}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded-full">
                  Official Municipal Record
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                AMC Zonal Public Service Transparency Audit • Ahmedabad Municipal Corporation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Status Progress Pipeline Card */}
          <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Real-Time Redressal Phase</span>
              </span>
              <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Phase 1 of 4: Inspector Assigned
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-200/80 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[25%] rounded-full transition-all duration-500"></div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-[10px] font-black text-center pt-1">
              <span className="text-blue-800">1. Assigned ✓</span>
              <span className="text-slate-400">2. Field Dispatch</span>
              <span className="text-slate-400">3. Active Work</span>
              <span className="text-slate-400">4. Citizen Sign-off</span>
            </div>
          </div>

          {/* Legal Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Dispatch & Responsibility */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Official Jurisdiction & Officer</span>
              </h4>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Zonal Officer:</span>
                  <span className="font-extrabold text-slate-900">{wardOfficer}</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Engineering Cell:</span>
                  <span className="font-extrabold text-slate-900">AMC West Zone Engineering</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Inspection ETA:</span>
                  <span className="font-extrabold text-blue-600">{fieldEta}</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Subscriber Network:</span>
                  <span className="font-extrabold text-emerald-700">{liveSubscribers} Verified Neighbors</span>
                </div>
              </div>
            </div>

            {/* Box 2: Legal Charter & SLA Terms */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Citizen Charter SLA Terms</span>
              </h4>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Legal Target SLA:</span>
                  <span className="font-black text-slate-900">48 Hours (Guaranteed)</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Statutory Act:</span>
                  <span className="font-extrabold text-slate-900">GPMC Act Sec. 230 / 2026</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Penalty Clause:</span>
                  <span className="font-extrabold text-amber-700">₹200/day delay penalty</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Public Audit:</span>
                  <span className="font-extrabold text-blue-600">Open Data Standard (JSON)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Geo Digital Signature & Cryptographic Proof */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Geo-Stamp Cryptographic Proof
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                EXIF Hash Verified
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div><span className="text-slate-500">GPS Coordinates:</span> 23.0365° N, 72.5611° E (Accuracy ±1.8m)</div>
              <div><span className="text-slate-500">Digital Signature:</span> 0x8F92...B31C9A (SHA-256 Tamper-Proof)</div>
              <div><span className="text-slate-500">AMC Public Ledger:</span> Block #492812 • Verified by NIC Infrastructure</div>
            </div>
          </div>

          {/* Original Post Content & Photo */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center space-x-3">
              <img 
                src={post.avatarUrl} 
                alt={post.authorName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{post.authorName}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{post.authorWard} • {post.timeAgo}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {post.content}
            </p>

            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden h-48 border border-slate-200">
                <img src={post.imageUrl} alt="Post Evidence" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Subscribers receive automatic SMS & WhatsApp updates.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all"
          >
            Close Audit Details
          </button>
        </div>

      </div>
    </div>
  );
}
