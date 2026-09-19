import React, { useState } from 'react';
import { 
  Navigation, MapPin, RefreshCw, AlertTriangle, Phone, CheckCircle2, 
  Clock, Shield, Camera, Truck, ChevronRight, Eye, MessageSquare, 
  Share2, ThumbsUp, X, Sparkles, Map, List, Search, Crosshair,
  UserCheck, Heart, ExternalLink, Activity, Info, Droplets
} from 'lucide-react';
import { Language, Post } from '../types';

// Assets
import wireHazardImg from '../assets/images/evidence_wire_hazard_1789743199289.jpg';
import wasteSpillImg from '../assets/images/evidence_waste_spillage_1789743181414.jpg';
import resolvedImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';

interface NearbyPageProps {
  language: Language;
  posts: Post[];
  onOpenReportModal: () => void;
}

export default function NearbyPage({
  language,
  posts,
  onOpenReportModal
}: NearbyPageProps) {

  // Search Perimeter filter
  const [perimeter, setPerimeter] = useState<'500m' | '1km' | '3km' | '5km'>('500m');

  // Category Filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'roads' | 'waste' | 'civic' | 'alerts'>('all');

  // View Mode
  const [viewMode, setViewMode] = useState<'feed' | 'map'>('feed');

  // Interactive states
  const [waterNoticeDismissed, setWaterNoticeDismissed] = useState(false);
  const [upvotedCard1, setUpvotedCard1] = useState(false);
  const [upvotesCard1, setUpvotesCard1] = useState(12);
  const [showTankerModal, setShowTankerModal] = useState(false);
  const [tankerAddress, setTankerAddress] = useState('Lane #3, Commerce Six Road, Navrangpura');
  const [tankerRequested, setTankerRequested] = useState(false);
  const [whistleNotif, setWhistleNotif] = useState(false);
  const [auditLogModal, setAuditLogModal] = useState(false);
  const [guardContactModal, setGuardContactModal] = useState(false);
  const [iKnowFamilyModal, setIKnowFamilyModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpvote = () => {
    if (upvotedCard1) {
      setUpvotedCard1(false);
      setUpvotesCard1(prev => prev - 1);
      showToast('Removed upvote');
    } else {
      setUpvotedCard1(true);
      setUpvotesCard1(prev => prev + 1);
      showToast('Upvoted! AMC Electrical Squad notified of high priority.');
    }
  };

  const handleTankerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTankerRequested(true);
    setTimeout(() => {
      setTankerRequested(false);
      setShowTankerModal(false);
      showToast('Emergency AMC Water Tanker requested! Ticket #WTR-9042 dispatched.');
    }, 1200);
  };

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">

      {/* =========================================
          TOP PROXIMITY RADAR HEADER BANNER (IMAGE #1)
          ========================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                <span>LIVE PROXIMITY RADAR</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold">WARD-12-AHM</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              What's Happening Nearby?
            </h1>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 pt-0.5">
              <span className="flex items-center space-x-1 text-slate-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Navrangpura Central</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px] flex items-center space-x-1">
                <Crosshair className="w-3 h-3 text-emerald-600" />
                <span>GPS Accurate ±3m</span>
              </span>
              <button 
                onClick={() => showToast('GPS recalibrated to current device coordinates')}
                className="text-blue-600 font-bold hover:underline text-[11px]"
              >
                Change Spot ⚙
              </button>
            </div>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => {
                setViewMode('feed');
                showToast('Switched to Live Feed View');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                viewMode === 'feed'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Feed View</span>
            </button>

            <button
              onClick={() => {
                setViewMode('map');
                showToast('Opening GPS Radar Map View...');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map Overlay</span>
            </button>

            <button
              onClick={() => showToast('Refreshed live nearby incident telemetry')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
              title="Refresh Radar Feed"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* ACTIVE SEARCH PERIMETER RADAR PILLS */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-[10px] font-black uppercase text-slate-400 mr-1 tracking-wider">
            ACTIVE SEARCH PERIMETER
          </span>

          <button
            onClick={() => { setPerimeter('500m'); showToast('Filter set to 500m Walking Distance'); }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              perimeter === '500m'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🚶</span>
            <span>500m (Walking)</span>
          </button>

          <button
            onClick={() => { setPerimeter('1km'); showToast('Filter set to 1 km Neighborhood'); }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              perimeter === '1km'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📍</span>
            <span>1 km (Neighborhood)</span>
          </button>

          <button
            onClick={() => { setPerimeter('3km'); showToast('Filter set to 3 km Ward Area'); }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              perimeter === '3km'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🚘</span>
            <span>3 km (Ward Area)</span>
          </button>

          <button
            onClick={() => { setPerimeter('5km'); showToast('Filter set to 5 km Zone'); }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              perimeter === '5km'
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🌐</span>
            <span>5 km (Zone)</span>
          </button>
        </div>

      </div>


      {/* =========================================
          PRIORITY WARD NOTICE BANNER (IMAGE #1)
          ========================================= */}
      {!waterNoticeDismissed && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
          
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded-2xl flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                  PRIORITY WARD NOTICE
                </span>
                <span className="text-slate-400 font-mono text-[11px]">Valid: Tomorrow 6:00 AM – 9:00 AM</span>
              </div>

              <p className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed max-w-2xl">
                <strong className="text-white font-extrabold">AMC Water Supply maintenance on Commerce Six Road</strong> scheduled for tomorrow morning. Low water pressure expected in lanes #2, #3, and #4.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setShowTankerModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Request Tanker</span>
            </button>

            <button
              onClick={() => {
                setWaterNoticeDismissed(true);
                showToast('Dismissed priority ward notice');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-all"
              title="Dismiss Notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}


      {/* =========================================
          CATEGORY FILTER CHIPS BAR
          ========================================= */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-extrabold">
        
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Nearby (14)
        </button>

        <button
          onClick={() => setActiveCategory('roads')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeCategory === 'roads'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Roads & Lights (6)
        </button>

        <button
          onClick={() => setActiveCategory('waste')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeCategory === 'waste'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Waste Pickups (3)
        </button>

        <button
          onClick={() => setActiveCategory('civic')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeCategory === 'civic'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Civic Services (3)
        </button>

        <button
          onClick={() => setActiveCategory('alerts')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeCategory === 'alerts'
              ? 'bg-blue-600 text-white shadow-xs font-black'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Neighbor Alerts (2)
        </button>

      </div>


      {/* MAP OVERLAY IF MAP VIEW SELECTED */}
      {viewMode === 'map' && (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
            <Map className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black">GPS Proximity Map Overlay Active</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Interactive 500m proximity pins mapped onto Navrangpura Ward 12 GIS layer.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs font-mono text-slate-300 space-y-2 max-w-md mx-auto">
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-amber-400">⚡ Pole #NW-89 Wire Hazard</span>
              <span className="text-slate-400">250m Away</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-emerald-400">♻️ Green Waste Cleared</span>
              <span className="text-slate-400">400m Away</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2">
              <span className="text-blue-400">🐾 Lost Golden Retriever</span>
              <span className="text-slate-400">600m Away</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400">🏥 AMC Mobile Health Van</span>
              <span className="text-slate-400">800m Away</span>
            </div>
          </div>

          <button 
            onClick={() => setViewMode('feed')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md"
          >
            Switch back to Card Feed View
          </button>
        </div>
      )}


      {/* =========================================
          MAIN TWO-COLUMN GRID LAYOUT
          ========================================= */}
      {viewMode === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================
              LEFT COLUMN: INCIDENT CARDS (8 COLS)
              ========================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* -----------------------------------------
                CARD 1: BROKEN STREETLIGHT (IMAGE #1)
                ----------------------------------------- */}
            {(activeCategory === 'all' || activeCategory === 'roads') && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-4 hover:border-blue-300 transition-all text-left">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs shrink-0">
                      ⚡
                    </span>
                    <h3 className="font-black text-slate-900 text-sm md:text-base">
                      Broken Streetlight & Exposed Low Wire
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-black">
                    <span className="px-2.5 py-0.5 bg-red-50 text-red-700 rounded-full border border-red-100 uppercase">
                      ● High Priority
                    </span>
                    <span className="text-slate-400 font-semibold">22 mins ago</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>HL College Lane #3, near Saraswati Dairy • <strong className="text-slate-800 font-extrabold">250m away</strong></span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Pole #NW-89 knocked by a delivery tempo. Pole wiring is hanging down into pedestrian clearance. Hazard reported for evening joggers and students.
                </p>

                {/* PHOTO & FIELD ACTION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                  
                  {/* Photo Attachment */}
                  <div className="md:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                    <img 
                      src={wireHazardImg} 
                      alt="Exposed wire hazard" 
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[10px] font-black rounded-lg">
                      Citizen Photo Attachment
                    </span>
                  </div>

                  {/* AMC Field Action Status Box */}
                  <div className="md:col-span-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-200/60 pb-2">
                        <span className="text-slate-700 flex items-center space-x-1">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>AMC Field Action</span>
                        </span>
                        <span className="font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          #TKT-24982
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 text-xs font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned Unit:</span>
                          <span className="text-slate-900 font-extrabold text-right">West Zone Electrical Dept</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">Lineman Status:</span>
                          <span className="text-blue-800 font-black text-right flex items-center space-x-1">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                            <span>Dispatched on site</span>
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">Estimated Fix:</span>
                          <span className="text-slate-900 font-black">ETA 2 hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold block text-right">Dispatch in Progress (65%)</span>
                    </div>
                  </div>

                </div>

                {/* CARD FOOTER INTERACTION BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                  <button
                    onClick={handleUpvote}
                    className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                      upvotedCard1
                        ? 'bg-blue-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>I see this too (+{upvotesCard1} upvotes)</span>
                  </button>

                  <div className="flex items-center space-x-4 text-slate-500 text-[11px]">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>142 views</span>
                    </span>
                    <button 
                      onClick={() => showToast('Opening 4 Notes from Electrical Supervisor')}
                      className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-extrabold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>4 notes</span>
                    </button>
                    <button 
                      onClick={() => showToast('Copied hazard alert link to clipboard')}
                      className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-extrabold"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Alert</span>
                    </button>
                  </div>
                </div>

              </div>
            )}


            {/* -----------------------------------------
                CARD 2: GREEN WASTE CONTAINER CLEARED (IMAGE #2)
                ----------------------------------------- */}
            {(activeCategory === 'all' || activeCategory === 'waste') && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-4 hover:border-blue-300 transition-all text-left">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                      ♻️
                    </span>
                    <h3 className="font-black text-slate-900 text-sm md:text-base">
                      Green Waste Container Cleared
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-black">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Resolved Today</span>
                    </span>
                    <span className="text-slate-400 font-semibold">10:15 AM</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Navrangpura Post Office Corner, C.G. Road • <strong className="text-slate-800 font-extrabold">400m away</strong></span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Overfilled dry horticulture bin reported earlier this morning was emptied and surrounding sidewalk power-swept by AMC Sanitation Route #09.
                </p>

                {/* BLUE SUPERVISED RESOLUTION AUDIT BOX */}
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-blue-900 block text-xs">Supervised Resolution Recorded</span>
                      <span className="text-slate-600 text-[11px]">Inspected by Ward Sanitary Inspector H. Mehta • Cleanliness Squad #4</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setAuditLogModal(true)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-800 font-black text-xs rounded-xl border border-blue-200 shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    View Audit Log
                  </button>
                </div>

                {/* FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-semibold text-slate-500">
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified by 6 nearby neighbors</span>
                  </span>

                  <button 
                    onClick={() => showToast('Flagged C.G. Road Post Office corner for daily double-pickup schedule')}
                    className="text-blue-600 font-black hover:underline"
                  >
                    Report Recurring Waste
                  </button>
                </div>

              </div>
            )}


            {/* -----------------------------------------
                CARD 3: NEIGHBOR ALERT: LOST GOLDEN RETRIEVER (IMAGE #2)
                ----------------------------------------- */}
            {(activeCategory === 'all' || activeCategory === 'alerts') && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-4 hover:border-blue-300 transition-all text-left">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-xs shrink-0">
                      🐾
                    </span>
                    <h3 className="font-black text-slate-900 text-sm md:text-base">
                      Neighbor Alert: Lost Golden Retriever
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-black">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full border border-blue-100 uppercase">
                      Community Safe Notice
                    </span>
                    <span className="text-slate-400 font-semibold">45 mins ago</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Near Mithakhali Underpass • <strong className="text-slate-800 font-extrabold">600m away</strong></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Photo of Golden Retriever */}
                  <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80" 
                      alt="Lost Golden Retriever Leo" 
                      className="w-full h-36 object-cover"
                    />
                  </div>

                  {/* Description & Tags */}
                  <div className="md:col-span-8 space-y-2.5">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Seen wandering safely near the underpass stairs around 8:45 AM wearing a royal blue reflective collar. Responded to name "Leo". Currently with guard at Shanti Tower gate.
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-lg">
                        Tag: Blue Collar
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 text-[11px] font-extrabold rounded-lg border border-blue-100">
                        Friendly / Leash Trained
                      </span>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setGuardContactModal(true)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                    >
                      Contact Society Guard
                    </button>

                    <button
                      onClick={() => setIKnowFamilyModal(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all"
                    >
                      I Know The Family
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500">
                    Posted by R. Trivedi (Resident)
                  </span>
                </div>

              </div>
            )}


            {/* -----------------------------------------
                CARD 4: AMC MOBILE HEALTH VAN ACTIVE (IMAGE #2 & #3)
                ----------------------------------------- */}
            {(activeCategory === 'all' || activeCategory === 'civic') && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-4 hover:border-blue-300 transition-all text-left">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                      🏥
                    </span>
                    <h3 className="font-black text-slate-900 text-sm md:text-base">
                      AMC Mobile Health Van Active
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-black">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full border border-blue-100 uppercase">
                      Free Civic Health Camp
                    </span>
                    <span className="text-slate-500 font-bold">Till 4:00 PM Today</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Navrangpura Community Hall, Stadium Rd • <strong className="text-slate-800 font-extrabold">800m away</strong></span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Free preventative health screening for senior citizens and local residents. Rapid blood sugar tests, blood pressure profiling, and essential generic medicines available at zero charge.
                </p>

                {/* 4 METRIC PILL CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">General Doctor</span>
                    <span className="text-xs font-black text-slate-900 block">2 On Duty</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Average Wait</span>
                    <span className="text-xs font-black text-slate-900 block">&lt; 10 Mins</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Cost</span>
                    <span className="text-xs font-black text-emerald-700 block">Free (Govt)</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Eligibility</span>
                    <span className="text-xs font-black text-slate-900 block">All Residents</span>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => showToast('Opening GPS Navigation to Stadium Rd Community Hall')}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-xl border border-blue-100 flex items-center space-x-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Get Directions (800m)</span>
                  </button>

                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    Health Van Reg: GJ-01-CZ-8821
                  </span>
                </div>

              </div>
            )}

          </div>


          {/* =========================================
              RIGHT COLUMN: WIDGETS & SIDEBAR (4 COLS)
              ========================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* WIDGET 1: QUICK REPORT NEARBY (IMAGE #1) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Quick Report Nearby</span>
                </h3>

                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded-md border border-blue-100">
                  Auto-tagged GPS
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Spot something on your block right now? Submit in 15 seconds without filling full department routing forms.
              </p>

              {/* Category selector buttons */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <button 
                  onClick={onOpenReportModal}
                  className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 rounded-2xl space-y-1 transition-all"
                >
                  <span className="text-base block">🕳️</span>
                  <span className="text-slate-800 text-[11px]">Pothole</span>
                </button>

                <button 
                  onClick={onOpenReportModal}
                  className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 rounded-2xl space-y-1 transition-all"
                >
                  <span className="text-base block">💡</span>
                  <span className="text-slate-800 text-[11px]">Light Out</span>
                </button>

                <button 
                  onClick={onOpenReportModal}
                  className="p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 rounded-2xl space-y-1 transition-all"
                >
                  <span className="text-base block">🗑️</span>
                  <span className="text-slate-800 text-[11px]">Garbage</span>
                </button>
              </div>

              <button
                onClick={onOpenReportModal}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Photo & Report</span>
              </button>
            </div>


            {/* WIDGET 2: LIVE SANITATION ROUTE (IMAGE #1 & #2) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Live Sanitation Route</span>
                </h3>

                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-black rounded-md border border-blue-100">
                  Route Active
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black text-slate-900">
                  <span>Compactor Truck #09</span>
                  <span className="text-blue-700 font-extrabold">350m Away</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Currently on Swastik Crossroad. Scheduled for your lane in approximately <strong className="text-slate-900 font-bold">~20 minutes</strong>.
                </p>
              </div>

              {/* BLUE GPS LOCATION CARD */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center space-x-1.5 text-xs font-black text-blue-900">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Vehicle GPS Pin: Swastik Junction</span>
                </div>

                <div className="text-[11px] font-bold text-slate-600">
                  Speed: 14 km/h • Next: Commerce Six Rd
                </div>
              </div>

              <button
                onClick={() => {
                  setWhistleNotif(prev => !prev);
                  showToast(whistleNotif ? 'Disabled Doorstep Whistle Notification' : 'Enabled Doorstep Whistle Notification! Device will chime when truck is 100m away.');
                }}
                className={`w-full py-2.5 text-xs font-black rounded-xl transition-all text-center ${
                  whistleNotif 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-blue-600 hover:bg-blue-50 font-bold'
                }`}
              >
                {whistleNotif ? '🔔 Whistle Alert Set ✓' : 'Set Doorstep Whistle Notification'}
              </button>
            </div>


            {/* WIDGET 3: NEARBY CIVIC POINTS (IMAGE #2 & #3) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                  <Building2Icon className="w-4 h-4 text-blue-600" />
                  <span>Nearby Civic Points</span>
                </h3>

                <span className="text-[11px] font-bold text-slate-400">
                  &lt; 1.5 km Radius
                </span>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* POINT 1 */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block">Navrangpura Ward #12 Municipal Office</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">Open till 6:00 PM • 450m away</span>
                  </div>
                  <button 
                    onClick={() => showToast('Calling Ward #12 Office Desk...')}
                    className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* POINT 2 */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block">AMC Urban Health Center</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">24/7 Emergency • 700m away</span>
                  </div>
                  <button 
                    onClick={() => showToast('Calling AMC Health Center Emergency...')}
                    className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* POINT 3 */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block">Torrent Power Local Substation</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">24/7 Helpline • 1.2 km away</span>
                  </div>
                  <button 
                    onClick={() => showToast('Calling Torrent Power Helpline...')}
                    className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* POINT 4 */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block">Solid Waste Transfer Station</span>
                    <span className="text-[11px] text-slate-500 font-semibold block">Accepts Bulk Green Waste • 1.4 km</span>
                  </div>
                  <button 
                    onClick={() => showToast('Opening directions to Waste Transfer Station')}
                    className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>


            {/* WIDGET 4: WARD 12 CITIZEN PULSE (IMAGE #3) */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-3xl p-5 shadow-2xs space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                  N
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Ward 12 Citizen Pulse</h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">Calculated within 1 km around you</span>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Issue Resolution Rate (7 Days)</span>
                    <span className="font-black text-blue-800">88%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Average Response Speed</span>
                    <span className="font-black text-blue-800">3.4 Hours</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-800 h-2 rounded-full w-[70%]"></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Active Citizens Nearby: <strong>312 online</strong></span>
                  </span>
                  <span className="text-blue-600 font-black">((•))</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}


      {/* =========================================
          REQUEST TANKER MODAL
          ========================================= */}
      {showTankerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span>Request AMC Emergency Water Tanker</span>
              </h3>
              <button onClick={() => setShowTankerModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Dispatch a 5,000L AMC municipal water tanker for Commerce Six Road maintenance zone.
            </p>

            <form onSubmit={handleTankerSubmit} className="space-y-3 text-xs font-bold text-slate-800">
              <div>
                <label className="block text-[11px] uppercase text-slate-400 font-black mb-1">Delivery Address / Lane</label>
                <input
                  type="text"
                  value={tankerAddress}
                  onChange={(e) => setTankerAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-[11px] font-semibold border border-blue-100">
                ✓ Priority dispatch assigned under Ward 12 Water Maintenance Protocol. Free of charge for affected societies.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTankerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md"
                >
                  {tankerRequested ? 'Dispatching...' : 'Confirm Tanker Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* AUDIT LOG MODAL */}
      {auditLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Sanitation Audit Log #LOG-8821</span>
              </h3>
              <button onClick={() => setAuditLogModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-400">Inspector Sign-off</span>
                <p className="text-slate-900 font-extrabold">Ward Sanitary Inspector H. Mehta</p>
                <span className="text-slate-500 text-[11px]">Timestamp: Today at 10:15 AM • Cleanliness Squad #4</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-black text-slate-400">Actions Completed</span>
                <p className="text-slate-800 font-bold">• Empty 1.2 Ton horticulture container</p>
                <p className="text-slate-800 font-bold">• Sidewalk power-sweep & washdown</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAuditLogModal(false)}
                className="px-5 py-2 bg-slate-900 text-white font-black rounded-xl text-xs"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}


      {/* GUARD CONTACT MODAL */}
      {guardContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Shanti Tower Security Guard</span>
              </h3>
              <button onClick={() => setGuardContactModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs font-semibold">
              <p className="text-slate-900 font-bold">Guard On Duty: Vikram Singh</p>
              <p className="text-slate-600">Location: Shanti Tower Main Gate, Near Mithakhali Underpass</p>
              <p className="text-blue-900 font-black text-sm pt-1">Direct Call: +91 98795 43210</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setGuardContactModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setGuardContactModal(false);
                  showToast('Initiating call to Shanti Tower Gate...');
                }}
                className="px-5 py-2 bg-blue-600 text-white font-black rounded-xl text-xs flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Gate Security</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* I KNOW FAMILY MODAL */}
      {iKnowFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>Connect Pet Owner with R. Trivedi</span>
              </h3>
              <button onClick={() => setIKnowFamilyModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Send a quick message or phone alert to R. Trivedi to reunite Leo with his family.
            </p>

            <textarea
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter pet owner name or contact details..."
              defaultValue="I know the owner! They live in B-402 Gulmohar Apartments. Calling them now."
            />

            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setIKnowFamilyModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIKnowFamilyModal(false);
                  showToast('Alert sent to R. Trivedi & Shanti Tower Guard!');
                }}
                className="px-5 py-2 bg-blue-600 text-white font-black rounded-xl text-xs"
              >
                Send Reunion Alert
              </button>
            </div>
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

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
