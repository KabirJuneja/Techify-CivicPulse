import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Phone, Calendar, Clock, Download, 
  Users, CheckCircle2, AlertTriangle, Check, X, FileText, 
  Megaphone, Info, Sparkles, MapPin, ArrowRight, Bell, ChevronRight,
  Shield, HelpCircle, Heart, UserPlus, FileSpreadsheet
} from 'lucide-react';
import { Language, Post } from '../types';
import sanjayPatelAvatar from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';

interface CityHubPageProps {
  language: Language;
  posts: Post[];
  onOpenReportModal: () => void;
}

export default function CityHubPage({
  language,
  posts,
  onOpenReportModal
}: CityHubPageProps) {

  // Active section tab
  const [activeSection, setActiveSection] = useState<'all' | 'committees' | 'dos_donts' | 'notices'>('all');

  // Committee join state
  const [committeeJoined, setCommitteeJoined] = useState<Record<string, boolean>>({
    c2: true // Navrangpura Monsoon & Drainage Action Committee joined by default
  });

  // Book Ward Hearing Modal state
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [hearingDate, setHearingDate] = useState('2026-09-22');
  const [hearingTime, setHearingTime] = useState('11:00 AM');
  const [hearingTopic, setHearingTopic] = useState('Water pressure and drainage chamber clearance in Swastik Society');
  const [hearingBooked, setHearingBooked] = useState(false);

  // Volunteer registration state
  const [registeredVolunteer, setRegisteredVolunteer] = useState(false);

  // Ward Alerts Subscription state
  const [isSubscribedAlerts, setIsSubscribedAlerts] = useState(true);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleCommittee = (id: string, name: string) => {
    setCommitteeJoined(prev => {
      const isJoined = !prev[id];
      showToast(isJoined ? `Joined ${name}! Welcome to Ward 12 Taskforce.` : `Left ${name}`);
      return { ...prev, [id]: isJoined };
    });
  };

  const handleBookHearing = (e: React.FormEvent) => {
    e.preventDefault();
    setHearingBooked(true);
    setTimeout(() => {
      setHearingBooked(false);
      setShowHearingModal(false);
      showToast('Ward Hearing Slot Confirmed! Pass sent to SMS & Email.');
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      
      {/* =========================================
          TOP OFFICER & DESK HEADER BANNER (IMAGE #1)
          ========================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-7 shadow-2xs space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Officer Avatar & Contact Details */}
          <div className="flex items-start md:items-center space-x-4">
            <div className="relative shrink-0">
              <img 
                src={sanjayPatelAvatar} 
                alt="Er. Sanjay Patel" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-wider">
                  WARD 12 (NAVRANGPURA CENTRAL)
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>AMC Verified Official</span>
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Er. Sanjay Patel
              </h1>

              <p className="text-xs font-extrabold text-slate-600">
                Zonal Executive Engineer & Designated Ward Inspector
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 pt-0.5">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mon–Sat 09:00–17:00 IST</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ward Control Desk: <strong className="text-slate-900 font-extrabold">+91 (079) 2656-1212</strong> (Ext: 1204)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Top Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowHearingModal(true)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Ward Hearing</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('ward-directive-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                showToast("Jumped to Today's Official Directive Notice");
              }}
              className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-xl border border-blue-100 transition-all flex items-center space-x-1.5"
            >
              <Megaphone className="w-4 h-4 text-blue-600" />
              <span>Today's Notice</span>
            </button>
          </div>

        </div>


        {/* THREE METRIC BLOCKS INSIDE HEADER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block leading-none">12</span>
              <span className="text-[11px] font-bold text-slate-500">Official Citizen Committees</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block leading-none">84%</span>
              <span className="text-[11px] font-bold text-slate-500">30-Day SLA Resolution Rate</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block leading-none">4 Teams</span>
              <span className="text-[11px] font-bold text-slate-500">Active Field Crews Today</span>
            </div>
          </div>

        </div>

      </div>


      {/* =========================================
          CATEGORY NAV TAB BAR
          ========================================= */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-extrabold">
        
        <button
          onClick={() => setActiveSection('all')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeSection === 'all'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Overview & All Feeds
        </button>

        <button
          onClick={() => setActiveSection('committees')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeSection === 'committees'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Inspector Committees (3)
        </button>

        <button
          onClick={() => setActiveSection('dos_donts')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeSection === 'dos_donts'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Civic Do's & Don'ts
        </button>

        <button
          onClick={() => setActiveSection('notices')}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeSection === 'notices'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Ward Public Notices
        </button>

      </div>


      {/* =========================================
          MAIN HIGHLIGHT BANNER: OFFICIAL WARD DIRECTIVE
          ========================================= */}
      {(activeSection === 'all' || activeSection === 'notices') && (
        <div id="ward-directive-box" className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs font-extrabold">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Megaphone className="w-3 h-3" />
                <span>OFFICIAL WARD DIRECTIVE</span>
              </span>
              <span className="text-slate-400">Issued today at 08:30 AM • Navrangpura North Sub-Zone</span>
            </div>

            <span className="font-mono text-slate-400 text-[11px]">
              Ref: AMC/W12/HEALTH/2025-04
            </span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Door-to-Door Dengue Larvae & Vector Inspection Protocol
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              Door-to-door dengue larvae vector inspection starts this Thursday morning across Swastik Society, St. Xavier's High School Road, and Commerce Six Road neighborhoods. Residents are requested to grant exterior tank and rooftop access to authorized AMC municipal health field workers carrying verifiable QR photo credentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-semibold text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Endorsed by Ward Inspector Sanjay Patel</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">Health Grievance Helpline: <strong className="text-white font-extrabold">155303</strong></span>
            </div>

            <button 
              onClick={() => showToast('Downloading Official Dengue Inspection Route Map PDF...')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl border border-white/10 transition-all flex items-center space-x-2 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download Inspection Route (PDF)</span>
            </button>
          </div>

        </div>
      )}


      {/* =========================================
          SECTION 2: OFFICIAL INSPECTOR-LED COMMITTEES (IMAGE #2)
          ========================================= */}
      {(activeSection === 'all' || activeSection === 'committees') && (
        <div className="space-y-4 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                CIVIC PARTICIPATORY GOVERNANCE
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Official Inspector-Led Ward Committees
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-semibold max-w-md">
              Direct dialogue channels monitored daily by Er. Sanjay Patel and AMC Ward 12 engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* COMMITTEE CARD 1 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-extrabold rounded-full border border-blue-100">
                    Sanitation & Enforcement
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">👥 420 residents</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  Ward 12 Cleanliness & Waste Vigilance Taskforce
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Dedicated to monitoring commercial black-spot dumpers, night-shift garbage clearance, and coordinating bin logistics along C.G. Road commercial corridors.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] font-extrabold text-slate-700 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Created & Monitored By Er. Sanjay Patel (Ward Inspector)</span>
                </div>

                <button
                  onClick={() => toggleCommittee('c1', 'Ward 12 Cleanliness & Waste Vigilance Taskforce')}
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow-xs ${
                    committeeJoined.c1 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {committeeJoined.c1 ? '✓ Joined • Active Member' : '👥 Join Official Group'}
                </button>
              </div>
            </div>

            {/* COMMITTEE CARD 2 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-extrabold rounded-full border border-blue-100">
                    Infrastructure & Stormwater
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">👥 680 residents</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  Navrangpura Monsoon & Drainage Action Committee
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Real-time field updates on stormwater catch-basin de-silting, micro-drainage chamber clearance, and reporting localized monsoon waterlogging choke points.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] font-extrabold text-slate-700 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Led by Engineering Lead AMC Drainage Junior Engineer</span>
                </div>

                <button
                  onClick={() => toggleCommittee('c2', 'Navrangpura Monsoon & Drainage Action Committee')}
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow-xs ${
                    committeeJoined.c2 
                      ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {committeeJoined.c2 ? '✓ Joined • Active Member' : '👥 Join Official Group'}
                </button>
              </div>
            </div>

            {/* COMMITTEE CARD 3 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-extrabold rounded-full border border-blue-100">
                    Public Safety & Mobility
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">👥 315 residents</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  Senior Citizen Walking & Safety Committee
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Prioritizing footpath encroachments, rapid street lamp repairs around public parks, and zebra crossing signals near Law Garden and Gujarat University.
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] font-extrabold text-blue-900 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Coordinated Jointly Ward Office & Navrangpura Police</span>
                </div>

                <button
                  onClick={() => toggleCommittee('c3', 'Senior Citizen Walking & Safety Committee')}
                  className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow-xs ${
                    committeeJoined.c3 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {committeeJoined.c3 ? '✓ Joined • Active Member' : '👥 Join Official Group'}
                </button>
              </div>
            </div>

          </div>

          {/* CITIZEN FACT BAR */}
          <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center font-black shrink-0 border border-blue-200">
                💡
              </div>
              <span>
                <strong>Ward Citizen Fact:</strong> Reports submitted with GPS tag and street landmark resolve <strong className="text-blue-900 font-black">3.2 days faster</strong> than non-contextual entries.
              </span>
            </div>

            <button 
              onClick={() => showToast('Photo Protocol Guide: Include street sign or shop board for fast dispatch')}
              className="text-xs font-black text-blue-700 hover:underline shrink-0"
            >
              Read Photo Protocol →
            </button>
          </div>

        </div>
      )}


      {/* =========================================
          SECTION 3: CIVIC GUIDELINES: WHAT TO DO & WHAT NOT TO DO (IMAGE #3)
          ========================================= */}
      {(activeSection === 'all' || activeSection === 'dos_donts') && (
        <div className="space-y-4 pt-2">
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              CITY BY-LAWS & COMPLIANCE STANDARDS
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Civic Guidelines: What to Do & What NOT to Do
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Ward 12 Municipal Enforcement Code guidelines approved under AMC Act Section 376. Please adhere to prevent penalty notices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* RULE SET 01 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  🗑️
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">RULE SET 01</span>
                  <h3 className="font-black text-slate-900 text-sm">Waste Segregation</h3>
                </div>
              </div>

              {/* DO THIS BOX */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-blue-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO THIS</span>
                </span>
                
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Keep <strong className="text-emerald-700 font-extrabold">green bins</strong> strictly for organic kitchen & food waste; <strong className="text-blue-700 font-extrabold">blue bins</strong> for paper, milk bags & dry recyclables.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Put bins out during morning door-to-door AMC tipper round between <strong className="text-slate-900 font-extrabold">07:00 AM – 10:00 AM</strong>.</span>
                  </li>
                </ul>
              </div>

              {/* DO NOT DO THIS BOX */}
              <div className="p-4 bg-red-50/60 border border-red-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-red-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO NOT DO THIS</span>
                </span>

                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Never mix construction debris (malba) with household garbage. Call <strong className="text-slate-900 font-extrabold">155303</strong> for special debris pickup.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Do not burn garden clippings or dry leaves on roadside curbs. Fine: <strong className="text-red-800 font-extrabold">₹1,500</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RULE SET 02 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  📷
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">RULE SET 02</span>
                  <h3 className="font-black text-slate-900 text-sm">Reporting Protocol</h3>
                </div>
              </div>

              {/* DO THIS BOX */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-blue-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO THIS</span>
                </span>

                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Capture a clear daytime photo showing the broader street context and landmark (e.g. pole number or shop board).</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Select the exact category tag (e.g. Streetlight Fault vs Fallen Wire) to dispatch the correct squad.</span>
                  </li>
                </ul>
              </div>

              {/* DO NOT DO THIS BOX */}
              <div className="p-4 bg-red-50/60 border border-red-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-red-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO NOT DO THIS</span>
                </span>

                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Avoid extreme close-ups of cracks or potholes with no visual reference for field staff to pinpoint.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Do not submit civil boundary or neighbor disputes as urgent municipal incidents.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RULE SET 03 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  🅿️
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block">RULE SET 03</span>
                  <h3 className="font-black text-slate-900 text-sm">Footpaths & Parking</h3>
                </div>
              </div>

              {/* DO THIS BOX */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-blue-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO THIS</span>
                </span>

                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Park vehicles strictly inside designated white road markings and parallel slots.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>Leave ramp accesses unhindered for wheelchair users, baby strollers, and elderly citizens.</span>
                  </li>
                </ul>
              </div>

              {/* DO NOT DO THIS BOX */}
              <div className="p-4 bg-red-50/60 border border-red-100 rounded-2xl space-y-2 text-xs font-semibold text-slate-700">
                <span className="text-red-800 font-black uppercase text-[10px] flex items-center space-x-1">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DO NOT DO THIS</span>
                </span>

                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Never park two-wheelers over stormwater intake catch basins or emergency fire hydrants.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-black">✕</span>
                    <span>Do not erect private advertisement displays or decorative ramp planters over public walkways.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* =========================================
          SECTION 4: FIELD DRIVES & TIMELINES (IMAGE #4)
          ========================================= */}
      {(activeSection === 'all' || activeSection === 'notices') && (
        <div className="space-y-4 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                FIELD DRIVES & TIMELINES
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Ward Operational Announcements
              </h2>
            </div>

            <button
              onClick={() => {
                setIsSubscribedAlerts(prev => !prev);
                showToast(isSubscribedAlerts ? 'Unsubscribed from Ward Alerts' : 'Subscribed to Ward Operational Alerts (SMS & Email)');
              }}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center space-x-2 border shadow-2xs ${
                isSubscribedAlerts 
                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4 text-blue-600" />
              <span>{isSubscribedAlerts ? '📡 Subscribed to Ward Alerts ✓' : 'Subscribe to Ward Alerts'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* ANNOUNCEMENT CARD 1 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-extrabold rounded-full border border-blue-100">
                    Infrastructure Schedule
                  </span>
                  <span className="text-xs font-black text-slate-900">Scheduled for Saturday</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  Overhead Water Tank Maintenance & Pressure Upgrades
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Main pressure testing for the University Sub-station feeder line will occur this Saturday between 13:00 and 16:30. Water delivery pressure may fluctuate in Gulbai Tekra and surrounding areas.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-lg">
                    Affected Societies: 18 complexes
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-[11px] font-extrabold rounded-lg border border-blue-100">
                    Water tankers on standby
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                <span>Posted by Water Works Dept.</span>
                <button 
                  onClick={() => showToast('Opening Gulbai Tekra Water Tanker Standby Locations Map')}
                  className="text-blue-600 font-black hover:underline"
                >
                  View Map Zones
                </button>
              </div>
            </div>

            {/* ANNOUNCEMENT CARD 2 */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 text-left flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-100">
                    Green Ward Initiative
                  </span>
                  <span className="text-xs font-black text-slate-900">Ongoing until Sunday</span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  Community Native Tree Plantation at Parimal Garden Corridor
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Join Er. Sanjay Patel and AMC Parks department for the Indigenous Neem and Gulmohar sapling drive. Free compost distribution for registered Ward 12 societies.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-extrabold rounded-lg">
                    Target: 350 Saplings
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-lg">
                    Community Volunteer Drive
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                <span>Parks & Gardens Wing</span>
                <button 
                  onClick={() => {
                    setRegisteredVolunteer(true);
                    showToast('Registered as Parimal Garden Plantation Volunteer!');
                  }}
                  className={`font-black hover:underline ${registeredVolunteer ? 'text-emerald-700 font-extrabold' : 'text-blue-600'}`}
                >
                  {registeredVolunteer ? 'Registered as Volunteer ✓' : 'Register as Volunteer'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* =========================================
          BOOK WARD HEARING MODAL
          ========================================= */}
      {showHearingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Book Ward Officer Grievance Hearing</span>
              </h3>
              <button onClick={() => setShowHearingModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Schedule a 10-minute 1-on-1 slot with Er. Sanjay Patel at the Ward 12 Municipal Desk (Navrangpura Central).
            </p>

            <form onSubmit={handleBookHearing} className="space-y-3 text-xs font-bold text-slate-800">
              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-black mb-1">Select Hearing Date</label>
                <input
                  type="date"
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-black mb-1">Select Available Time Slot</label>
                <select
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>10:00 AM (Slot 1)</option>
                  <option>11:00 AM (Slot 2)</option>
                  <option>02:30 PM (Slot 3)</option>
                  <option>04:00 PM (Slot 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-black mb-1">Grievance Topic Summary</label>
                <textarea
                  rows={3}
                  value={hearingTopic}
                  onChange={(e) => setHearingTopic(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe civic issue..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHearingModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md"
                >
                  {hearingBooked ? 'Slot Confirmed!' : 'Confirm Hearing Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
