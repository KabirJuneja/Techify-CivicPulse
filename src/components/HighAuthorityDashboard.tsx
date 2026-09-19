import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Download, Megaphone, CheckCircle2, Clock, 
  AlertCircle, Sparkles, Filter, ChevronDown, MapPin, Wrench, Zap, 
  Trash2, Droplets, Flame, Users, ArrowUpRight, Activity, ArrowRight,
  Radio, Check, RefreshCw, Layers, Compass, Eye, Map, AlertTriangle
} from 'lucide-react';
import { Language, Post } from '../types';
import wasteSpillageImg from '../assets/images/evidence_waste_spillage_1789743181414.jpg';
import resolvedImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import NagarXLogo from './NagarXLogo';

interface HighAuthorityDashboardProps {
  language: Language;
  posts: Post[];
  onBackToFeed: () => void;
  onOpenReportModal: () => void;
}

export default function HighAuthorityDashboard({
  language,
  posts,
  onBackToFeed,
  onOpenReportModal
}: HighAuthorityDashboardProps) {
  
  // Department & Priority Filters
  const [selectedDept, setSelectedDept] = useState('All Department');
  const [selectedWard, setSelectedWard] = useState('Ward 14 (Navrangpura)');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState('All Active');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('Alert: Emergency water pipe repair on CG Road. Traffic diverted via Commerce College.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Status Update Modal State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [assignedCrew, setAssignedCrew] = useState('Civil Roads Unit 4B');
  const [statusAction, setStatusAction] = useState('In-Progress');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setShowBroadcastModal(false);
    }, 2000);
  };

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      
      {/* =========================================
          TOP EXECUTIVE BANNER
          ========================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <NagarXLogo size="lg" variant="icon" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Ahmedabad Municipal Corporation (AMC)
                </h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Live Dispatch Active</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500 mt-1">
                <span>Logged in as: <strong className="text-slate-900 font-extrabold">Sanjay Patel</strong> (Executive Engineer - Ward 14 Navrangpura)</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Shift 08:00 - 18:00 IST</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Exporting 1,842 civic reports as CSV file...')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl border border-slate-200 transition-all flex items-center space-x-2 shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Reports (CSV)</span>
            </button>

            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-red-500/20 active:scale-95"
            >
              <Megaphone className="w-4 h-4" />
              <span>Ward Broadcast Alert</span>
            </button>
          </div>

        </div>
      </div>


      {/* =========================================
          EXECUTIVE SUMMARY METRICS CARDS (4-GRID)
          ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              TOTAL REPORTS THIS WEEK
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900">1,842</span>
            <div className="flex items-center space-x-1 text-xs font-extrabold text-blue-600 mt-1">
              <span>↗ +12.4%</span>
              <span className="text-slate-400 font-bold">vs. previous 7 days</span>
            </div>
          </div>

          <div className="w-full bg-blue-100 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[70%]"></div>
          </div>
        </div>

        {/* Card 2: Resolved Issues */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              RESOLVED ISSUES
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900">1,510</span>
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-600 mt-1">
              <span className="text-emerald-600 font-extrabold">82% SLA Met</span>
              <span>within standard 48 hrs</span>
            </div>
          </div>

          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[82%]"></div>
          </div>
        </div>

        {/* Card 3: Under Review / Active */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              UNDER REVIEW / ACTIVE
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-slate-900">248</span>
            <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 mt-1">
              <span className="text-amber-600 font-extrabold">2.4 hrs</span>
              <span>avg initial dispatch</span>
            </div>
          </div>

          <div className="w-full bg-amber-100 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[40%]"></div>
          </div>
        </div>

        {/* Card 4: Critical Hazards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              CRITICAL / URGENT HAZARDS
            </span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black text-red-600">14</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-black rounded-full">
                14 Crews On-Site
              </span>
              <span className="text-xs font-bold text-slate-500">Immediate protocols</span>
            </div>
          </div>

          <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full w-[100%] animate-pulse"></div>
          </div>
        </div>

      </div>


      {/* =========================================
          MAIN WORKSPACE (LEFT FEED + RIGHT AI/ACTIONS)
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Ward Citizen Reports List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base">Ward Citizen Reports</h3>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-black rounded-full border border-blue-100">
                  Navrangpura #14
                </span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Kanban
                </button>
              </div>
            </div>

            {/* Dropdown Filters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-slate-700">
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Department</option>
                <option>Roads & Engineering</option>
                <option>Solid Waste Management</option>
                <option>Torrent Power / Streetlights</option>
                <option>Hydraulics & Water</option>
              </select>

              <select 
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>Ward 14 (Navrangpura)</option>
                <option>Ward 12 (Central)</option>
                <option>Ward 15 (Vastrapur)</option>
              </select>

              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Priorities</option>
                <option>Critical / Hazard</option>
                <option>High Priority</option>
                <option>Medium Priority</option>
              </select>

              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Active (18)</option>
                <option>In-Progress</option>
                <option>Assigned</option>
                <option>Resolved & Verified</option>
              </select>
            </div>
          </div>

          {/* Incident Report Cards Stack */}
          <div className="space-y-4">
            
            {/* INCIDENT CARD 1: Severe Road Pothole */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 hover:border-blue-300 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-blue-700 text-xs">#NX-10482</span>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full border border-amber-200">
                    High Priority
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    👍 42 citizen endorsements
                  </span>
                </div>

                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  <span>In-Progress</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                  Reported 3 hrs ago by Citizen #8192
                </span>
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  Severe Road Pothole & Caved Asphalt
                </h3>
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Navrangpura HL Commerce College Crossroad, Underpass...</span>
                </div>
              </div>

              {/* Crew & Target Info */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-extrabold text-slate-700">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Crew: Unit 4B (Civil Roadwork)</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-500">Target: <strong className="text-slate-900">Today 17:00 IST</strong></span>
                  <button 
                    onClick={() => setEditingPostId('#NX-10482')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg text-[11px] transition-all flex items-center space-x-1"
                  >
                    <span>Update Status</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* INCIDENT CARD 2: Streetlight Array Failure */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 hover:border-slate-300 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-blue-700 text-xs">#NX-10490</span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-extrabold rounded-full border border-slate-200">
                    Medium Priority
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    👍 18 citizen endorsements
                  </span>
                </div>

                <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-black rounded-full">
                  Assigned
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                  Reported 5 hrs ago
                </span>
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  Streetlight Array Failure (4 Successive Poles D...)
                </h3>
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Vastrapur Lake Outer Jogging Ring Road, North Gate</span>
                </div>
              </div>

              {/* Crew & Target Info */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-extrabold text-slate-700">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Crew: Electrical Div Substation #3</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-500">Assigned: <strong className="text-slate-900">1 hr ago</strong></span>
                  <button 
                    onClick={() => setEditingPostId('#NX-10490')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-lg text-[11px] transition-all flex items-center space-x-1 border border-slate-200"
                  >
                    <span>Update Status</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* INCIDENT CARD 3: Solid Waste Overflow (Resolved) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-blue-700 text-xs">#NX-10495</span>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full">
                    High Priority
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    👍 35 citizen endorsements
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full inline-flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolved & Verified</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Closed by Inspector R. Dave</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-700 block mb-0.5">
                  Cleared at 11:20 AM
                </span>
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  Solid Waste Overflow & Commercial Dumpe...
                </h3>
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Law Garden Khau Gali & Evening Craft Market Perime...</span>
                </div>
              </div>

              {/* Resolved Work Proof Box */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={resolvedImg} alt="Proof" className="w-12 h-10 object-cover rounded-lg border border-emerald-200" />
                  <div>
                    <span className="text-xs font-black text-slate-900 block">AMC Sanitation Unit 12</span>
                    <span className="text-[10px] text-emerald-700 font-bold">GPS Tagged • 23.027°N 72.561°E</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Viewing high-res Inspection Photo Proof')}
                  className="text-xs font-black text-blue-600 hover:underline"
                >
                  View Full Proof
                </button>
              </div>
            </div>

            {/* INCIDENT CARD 4: Critical Water Pipe Burst (Emergency) */}
            <div className="bg-red-50/50 rounded-2xl border border-red-200 p-5 shadow-2xs space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-red-700 text-xs">#NX-10582</span>
                  <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full animate-pulse">
                    ● Critical / Hazard
                  </span>
                  <span className="text-[11px] font-bold text-slate-600">
                    👍 57 citizen endorsements
                  </span>
                </div>

                <span className="px-3 py-1 bg-red-200/80 text-red-900 text-xs font-black rounded-full">
                  Emergency Dispatch
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-red-600 block mb-0.5">
                  Reported 45 mins ago
                </span>
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  Main Potable Water Pipe Burst & Road Wate...
                </h3>
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>C.G. Road near Municipal Market Intersection</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-red-100 text-red-900 text-[11px] font-extrabold rounded-lg border border-red-200">
                  🔥 Immediate Valve Shutoff Dispatched
                </span>

                <button 
                  onClick={() => alert('Launching Emergency Hydraulics Intervene Protocol')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1"
                >
                  <span>Intervene ⚡</span>
                </button>
              </div>
            </div>

            {/* Dynamic Citizen Post Render (If new post submitted) */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-blue-700">{post.ticketId || '#NX-10482'}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                    post.isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {post.isResolved ? 'Resolved & Verified' : 'Under Review'}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm">{post.content}</h4>
                <div className="text-[11px] font-semibold text-slate-500">
                  Author: {post.authorName} ({post.authorWard})
                </div>
              </div>
            ))}

          </div>


          {/* Incident Heatmap & Vehicle Tracking Card (Image #3) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
                  <Map className="w-4 h-4 text-blue-600" />
                  <span>Ward 14 Incident Heatmap & Vehicle Tracking</span>
                </h3>
              </div>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                8 Active AMC Vehicles in Sector
              </span>
            </div>

            {/* Visual Heatmap Box */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-blue-100/60 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="absolute left-6 top-4 text-[10px] font-bold text-slate-600">Shilaj / Thaltej</div>
              <div className="absolute right-6 top-4 text-[10px] font-bold text-slate-600">Civil Hospital Ahmedabad</div>

              {/* Pulsing Heat Density */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/30 rounded-full animate-ping absolute"></div>
                <div className="px-3 py-1 bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-lg border border-slate-700 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>High reporting density around Ashram Road corridor</span>
                </div>
              </div>

              <button 
                onClick={() => alert('Opening Full Expanded Interactive Ward GIS Map')}
                className="absolute bottom-3 right-3 px-3 py-1.5 bg-white text-blue-700 font-extrabold text-[11px] rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-1"
              >
                <span>Open Expanded Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: NAGAR AI Intelligence & Supervisory Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Panel 1: NAGAR AI Assistant v3.2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  🤖
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xs leading-none">NAGAR AI</h3>
                  <span className="text-[10px] text-slate-400 font-bold">City Intelligence Engine v3.2</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">
                Online
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Recommendation 1 */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
                <h4 className="font-extrabold text-blue-900 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pre-Dispatch Inspection: Ashram Road</span>
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Predictive model signals 87% chance of road wear and sinkhole after last night's 42mm localized rainfall. Crew recommendation: Inspect stormwater runoffs at Vadaj junction.
                </p>
                <button 
                  onClick={() => alert('Auto-Dispatching Civil Crew to Vadaj Junction')}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] rounded-lg shadow-2xs"
                >
                  Auto-Dispatch Crew
                </button>
              </div>

              {/* Recommendation 2 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-600" />
                  <span>Route Optimization: West Zone</span>
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Dynamic routing deployed to 12 AMC compactor trucks saved 18% fuel and cleared 4 tonnes of early market refuse before peak school traffic.
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                  <span>Telemetry: 100% On Schedule</span>
                  <button className="text-blue-600 font-extrabold hover:underline">Inspect Route</button>
                </div>
              </div>

              {/* Recommendation 3 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                <h4 className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Duplicate Report Clustering</span>
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  AI grouped 9 separate citizen submissions into incident #NX-10482 (Pothole at HL Crossroad).
                </p>
              </div>

            </div>
          </div>

          {/* Panel 2: SUPERVISORY QUICK ACTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              SUPERVISORY QUICK ACTIONS
            </span>

            <div className="space-y-2">
              <button 
                onClick={onOpenReportModal}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-extrabold text-slate-800 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Dispatch Field Crew</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => setShowBroadcastModal(true)}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-extrabold text-slate-800 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-amber-600" />
                  <span>Broadcast Citizen Notice</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => alert('Verifying 3 pending field resolution photos')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-extrabold text-slate-800 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verify Resolution Photos</span>
                </div>
                <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Panel 3: Ward 14 Ready Crews */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Ward 14 Ready Crews
              </span>
              <span className="text-xs font-extrabold text-blue-600">5 Available</span>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-800 font-bold">Civil Roads Unit 4B</span>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Dispatched (HL)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-800 font-bold">Electrical Quick Repair 2</span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Idle / Ready
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-800 font-bold">Sanitation Compactor 08</span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Idle / Ready
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-slate-800 font-bold">Hydraulics Jetting Van 1</span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Idle / Ready
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Broadcast Alert Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-red-600" />
                <span>Ward Broadcast Emergency Alert</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              This message will be sent as an SMS alert and push notification to all 2,840 registered citizens in Ward 14 Navrangpura.
            </p>

            <textarea
              rows={3}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBroadcastSubmit}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md"
              >
                {broadcastSent ? 'Broadcast Dispatched!' : 'Send Emergency Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
