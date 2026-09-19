import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Users, CheckCircle2, Plus, Search, Filter, 
  Share2, Award, Clock, ArrowRight, ShieldCheck, Heart, Trash2, 
  Trees, Wrench, Megaphone, X, Download, Phone, Info, Check, 
  ExternalLink, Sparkles, AlertCircle, FileText, ChevronRight, Loader2, Database
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { 
  saveCivicEventToFirestore, 
  subscribeToCivicEvents, 
  updateCivicEventRsvpInFirestore, 
  CivicEventFirestoreData 
} from '../lib/firebase';

// Images
import sabarmatiImg from '../assets/images/sabarmati_riverfront_drive_1789740233986.jpg';
import potholeImg from '../assets/images/pothole_repaired_after_1789742513449.jpg';
import wasteCleanedImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import avatarImg from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';

interface EventsPageProps {
  language: Language;
  currentUser?: UserProfile;
  onOpenReportModal?: () => void;
}

const eventDict = {
  en: {
    badge: 'Verified Municipal & Community Directives • Ahmedabad (AMC)',
    calendarView: 'Calendar View',
    proposeBtn: 'Propose Public Civic Drive',
    title: 'Civic Action & Public Drives',
    subtitle: 'Participate in official municipal campaigns, neighborhood cleanliness drives, road cleanup operations, and ecological initiatives organized by Ahmedabad Municipal Corporation (AMC) and certified civic collectives.',
    card1Title: '18 Drives',
    card1Sub: 'Active Across Ahmedabad',
    card2Title: '4,280+',
    card2Sub: 'Registered Citizens',
    card3Title: '14.2 T',
    card3Sub: 'Waste Cleared (October)',
    card4Title: '100% Verified',
    card4Sub: 'Pure Public Interest Only',
    searchPlaceholder: 'Search campaigns, wards, or assembly points...',
    catAll: 'All Action Drives',
    catCleanliness: 'Cleanliness & Sanitation',
    catRepair: 'Infrastructure & Patching',
    catPlantation: 'Tree Plantation & Greenery',
    catTownhall: 'Public Townhalls',
    joinBtn: 'RSVP / Join Drive',
    joinedBtn: '✓ Registered / Joined',
  },
  gu: {
    badge: 'ખરાઈ કરેલ મ્યુનિસિપલ અને સમુદાય સૂચનાઓ • અમદાવાદ (AMC)',
    calendarView: 'કેલેન્ડર દૃશ્ય',
    proposeBtn: 'સાર્વજનિક નાગરિક અભિયાનનો પ્રસ્તાવ મૂકો',
    title: 'નાગરિક કાર્ય અને જાહેર અભિયાનો',
    subtitle: 'અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન (AMC) અને પ્રમાણિત નાગરિક જૂથો દ્વારા આયોજિત સત્તાવાર મ્યુનિસિપલ ઝુંબેશ, પડોશની સ્વચ્છતા ઝુંબેશ, માર્ગ સફાઈ કામગીરી અને પર્યાવરણીય પહેલોમાં ભાગ લો.',
    card1Title: '૧૮ અભિયાન',
    card1Sub: 'અમદાવાદભરમાં સક્રિય',
    card2Title: '૪,૨૮૦+',
    card2Sub: 'નોંધાયેલા નાગરિકો',
    card3Title: '૧૪.૨ ટન',
    card3Sub: 'કચરો સાફ કરાયો (ઓક્ટોબર)',
    card4Title: '૧૦૦% ચકાસાયેલ',
    card4Sub: 'શુદ્ધ જાહેર હિતમાં જ',
    searchPlaceholder: 'ઝુંબેશ, વોર્ડ અથવા એસેમ્બલી પોઈન્ટ શોધો...',
    catAll: 'બધા કાર્ય અભિયાનો',
    catCleanliness: 'સ્વચ્છતા અને સેનિટેશન',
    catRepair: 'ઈન્ફ્રાસ્ટ્રક્ચર અને રીપેર',
    catPlantation: 'વૃક્ષારોપણ અને હરિયાળી',
    catTownhall: 'જાહેર ટાઉનહોલ',
    joinBtn: 'જોડાવો / RSVP કરો',
    joinedBtn: '✓ નોંધાયેલ / જોડાયેલ',
  },
  hi: {
    badge: 'सत्यापित नगर निगम और सामुदायिक निर्देश • अहमदाबाद (AMC)',
    calendarView: 'कैलेंडर दृश्य',
    proposeBtn: 'सार्वजनिक नागरिक अभियान का प्रस्ताव रखें',
    title: 'नागरिक कार्रवाई और सार्वजनिक अभियान',
    subtitle: 'अहमदाबाद नगर निगम (AMC) और प्रमाणित नागरिक समूहों द्वारा आयोजित आधिकारिक नगर निगम अभियानों, पड़ोस स्वच्छता अभियानों, सड़क सफाई कार्यों और पारिस्थितिक पहलों में भाग लें।',
    card1Title: '१८ अभियान',
    card1Sub: 'अहमदाबाद में सक्रिय',
    card2Title: '४,२८०+',
    card2Sub: 'पंजीकृत नागरिक',
    card3Title: '१४.२ टन',
    card3Sub: 'कचरा साफ किया गया (अक्टूबर)',
    card4Title: '१००% सत्यापित',
    card4Sub: 'केवल विशुद्ध जनहित में',
    searchPlaceholder: 'अभियान, वार्ड या असेंबली प्वाइंट खोजें...',
    catAll: 'सभी कार्य अभियान',
    catCleanliness: 'स्वच्छता और सेनेटाइजेशन',
    catRepair: 'बुनियादी ढांचा और मरम्मत',
    catPlantation: 'वृक्षारोपण और हरियाली',
    catTownhall: 'सार्वजनिक टाउनहॉल',
    joinBtn: 'शामिल हों / RSVP करें',
    joinedBtn: '✓ पंजीकृत / शामिल हुए',
  }
};

export interface CivicEvent {
  id: string;
  title: string;
  isMegaDrive?: boolean;
  directiveText?: string;
  organizer: string;
  dateTime: string;
  assemblyPoint: string;
  ward: string;
  category: 'all' | 'cleanliness' | 'repair' | 'plantation' | 'townhall';
  categoryLabel: string;
  categoryTag2?: string;
  description: string;
  stretchOrLocationKey: string;
  stretchOrLocationVal: string;
  equipmentOrPartnerKey: string;
  equipmentOrPartnerVal: string;
  actionTasks?: string[];
  volunteersRegistered: number;
  volunteersCapacity?: number;
  joinedUserInitials: string[];
  joinedNote: string;
  isUserRSVPed: boolean;
  coverImage?: string;
  isFromDatabase?: boolean;
}

// Initial seed events
const SEED_EVENTS: CivicEvent[] = [
  {
    id: 'evt-mega-1',
    title: 'Mega Sabarmati Riverfront Plastic-Free & Riverbed Cleanup Drive',
    isMegaDrive: true,
    directiveText: 'JOINT CIVIC DIRECTIVE • Ward #03 & Riverfront Central',
    organizer: 'AMC Sanitation Cell & SEWA Youth Volunteers',
    dateTime: 'Sun, Oct 29 • 06:30 – 09:30 AM',
    assemblyPoint: 'Riverfront Promenade, Gate 3',
    ward: 'Ward #03 & Riverfront Central',
    category: 'cleanliness',
    categoryLabel: 'Cleanliness & Sanitation',
    description: 'Participate in the largest riverbed restoration effort. AMC hydraulic crews and volunteer teams coordinate micro-plastic extraction and riverbank tree sapling hydration.',
    stretchOrLocationKey: 'Assembly Point',
    stretchOrLocationVal: 'Riverfront Promenade, Gate 3',
    equipmentOrPartnerKey: 'Provided',
    equipmentOrPartnerVal: 'AMC volunteer gloves, sturdy bags & wholesome breakfast provided',
    actionTasks: [
      'Plastic sorting & micro-waste extraction over 2.4 km waterfront stretch',
      'Riverbed sediment clearing under AMC hydraulic supervision',
      'Free AMC volunteer gloves, sturdy bags & wholesome breakfast provided'
    ],
    volunteersRegistered: 420,
    volunteersCapacity: 500,
    joinedUserInitials: ['DS', 'RK', 'AM', 'SP'],
    joinedNote: '420 of 500 Volunteers Registered (84% Full)',
    isUserRSVPed: true,
    coverImage: sabarmatiImg
  },
  {
    id: 'evt-2',
    title: 'Navrangpura Road & Pavement Cleansing Drive',
    organizer: 'Led by Navrangpura Youth & AMC Inspector',
    dateTime: 'Saturday, Oct 28 • 07:00 AM – 09:00 AM',
    assemblyPoint: 'Commerce Six Road Junction',
    ward: 'Ward #14',
    category: 'repair',
    categoryLabel: 'Road & Pavement Maintenance',
    categoryTag2: 'Ward #14',
    description: 'Citizen and municipal crew collaborative drive to sweep road shoulders, clear storm-drain grates ahead of festival week, and remove unauthorized poster pasting on electric poles along the primary university corridor.',
    stretchOrLocationKey: 'Stretch',
    stretchOrLocationVal: 'Commerce Six Road to HL College Crossroad',
    equipmentOrPartnerKey: 'Equipment',
    equipmentOrPartnerVal: 'Safety reflective vests, broom gear, compactor',
    volunteersRegistered: 85,
    joinedUserInitials: ['AK', 'PS'],
    joinedNote: '85 citizens joined • Led by Navrangpura Youth & AMC Inspector',
    isUserRSVPed: false
  },
  {
    id: 'evt-3',
    title: 'City Green Lung: 500 Native Tree Plantation Along 132ft Ring Road',
    organizer: 'AMC Parks & Gardens Dept.',
    dateTime: 'Sunday, Nov 05 • 07:30 AM – 10:30 AM',
    assemblyPoint: '132ft Ring Road Green Median, Vastrapur Section',
    ward: 'Vastrapur Ward #15',
    category: 'plantation',
    categoryLabel: 'Ecological Drive',
    categoryTag2: 'Parks & Gardens',
    description: 'Planting indigenous Neem, Peepal, and Gulmohar saplings with geo-tagging each plant on NAGAR-X for 1-year survival monitoring. Drip-irrigation piping provided by municipal arborists.',
    stretchOrLocationKey: 'Location',
    stretchOrLocationVal: '132ft Ring Road Green Median, Vastrapur Section',
    equipmentOrPartnerKey: 'Provided',
    equipmentOrPartnerVal: 'Saplings, shovels, soil nutrients & QR tags',
    volunteersRegistered: 210,
    joinedUserInitials: ['MC', 'VR'],
    joinedNote: '210 registered • AMC Parks & Gardens Dept.',
    isUserRSVPed: false
  },
  {
    id: 'evt-4',
    title: 'Old City Heritage Pol De-silting & Traditional Drain Flushing',
    organizer: 'World Heritage Cell & CEPT Conservation Group',
    dateTime: 'Tuesday, Oct 31 • 08:00 AM – 11:00 AM',
    assemblyPoint: 'Teen Darwaza Precinct',
    ward: 'UNESCO Ward #02',
    category: 'cleanliness',
    categoryLabel: 'Historic Precinct Sanitation',
    categoryTag2: 'UNESCO Ward #02',
    description: 'Specialized clean-up of heritage stormwater channels and zero-plastic pol awareness camp in partnership with CEPT heritage students and old-city ward mohalla committees.',
    stretchOrLocationKey: 'Corridor',
    stretchOrLocationVal: 'Teen Darwaza to Manek Chowk Inner Lanes',
    equipmentOrPartnerKey: 'Partner',
    equipmentOrPartnerVal: 'CEPT Conservation Group & AMC Heritage Cell',
    volunteersRegistered: 64,
    joinedUserInitials: ['CF', 'JD'],
    joinedNote: '64 volunteers • World Heritage Cell',
    isUserRSVPed: false
  },
  {
    id: 'evt-5',
    title: 'Open Ward Corporator & Zonal Engineer Townhall (Public Hearing)',
    organizer: 'Ward 14 Governance Desk',
    dateTime: 'Friday, Nov 03 • 05:00 PM – 07:00 PM',
    assemblyPoint: 'Navrangpura Community Hall, Stadium Crossroad',
    ward: 'Ward #14',
    category: 'townhall',
    categoryLabel: 'Ward Public Hearing',
    categoryTag2: 'Official Accountability',
    description: 'Direct Q&A with Ward 14 Councillors and Executive Engineers on pending road resurfacing tenders, water pressure issues, and streetlight replacement timelines with public ledger recording.',
    stretchOrLocationKey: 'Venue',
    stretchOrLocationVal: 'Navrangpura Community Hall, Stadium Crossroad',
    equipmentOrPartnerKey: 'Format',
    equipmentOrPartnerVal: '3-min open citizen mic per complaint ticket',
    volunteersRegistered: 140,
    joinedUserInitials: ['SP', 'MJ'],
    joinedNote: '140 residents confirmed • Open entry with Ward Voter ID / NAGAR-X ID',
    isUserRSVPed: false
  }
];

export const EventsPage: React.FC<EventsPageProps> = ({ language, currentUser }) => {
  const t = eventDict[language] || eventDict['en'];
  // Filters & State
  const [activeCategory, setActiveCategory] = useState<'all' | 'cleanliness' | 'repair' | 'plantation' | 'townhall'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('My Ward (Navrangpura Ward #14)');
  const [dateFilter, setDateFilter] = useState('This Weekend');

  // Modals
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showGateMapModal, setShowGateMapModal] = useState<CivicEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Propose Event Form State
  const [propTitle, setPropTitle] = useState('');
  const [propWard, setPropWard] = useState(currentUser?.ward || 'Navrangpura Ward #14');
  const [propCategory, setPropCategory] = useState<'cleanliness' | 'repair' | 'plantation' | 'townhall'>('cleanliness');
  const [propDate, setPropDate] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Real-time events list with offline persistence fallback
  const [events, setEvents] = useState<CivicEvent[]>(() => {
    try {
      const saved = localStorage.getItem('nagarx_civic_events');
      if (saved) {
        const parsed: CivicEvent[] = JSON.parse(saved);
        const parsedIds = new Set(parsed.map(p => p.id));
        const nonDuplicateSeed = SEED_EVENTS.filter(s => !parsedIds.has(s.id));
        return [...parsed, ...nonDuplicateSeed];
      }
    } catch (e) {
      console.warn('Could not read cached events', e);
    }
    return SEED_EVENTS;
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real-time Firestore synchronization for all civic events
  useEffect(() => {
    const unsubscribe = subscribeToCivicEvents((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        setEvents((prevEvents) => {
          const firestoreIds = new Set(firestoreItems.map((f) => f.id));
          const nonDatabaseSeed = SEED_EVENTS.filter((s) => !firestoreIds.has(s.id));

          const convertedFirestoreEvents: CivicEvent[] = firestoreItems.map((item) => ({
            id: item.id,
            title: item.title,
            isMegaDrive: item.isMegaDrive ?? false,
            directiveText: item.directiveText || 'COMMUNITY DIRECTIVE • Saved in Firestore',
            organizer: item.organizer || 'Citizen Proposed • AMC Ward Desk',
            dateTime: item.dateTime || 'Upcoming Weekend • 07:00 AM',
            assemblyPoint: item.assemblyPoint || item.location || 'Ahmedabad',
            ward: item.ward || 'Navrangpura Ward #14',
            category: item.category || 'cleanliness',
            categoryLabel: item.categoryLabel || 'Cleanliness & Sanitation',
            categoryTag2: item.categoryTag2 || 'Live in Database',
            description: item.description || '',
            stretchOrLocationKey: item.stretchOrLocationKey || 'Location',
            stretchOrLocationVal: item.stretchOrLocationVal || item.location || item.assemblyPoint || 'Ahmedabad',
            equipmentOrPartnerKey: item.equipmentOrPartnerKey || 'Requirements',
            equipmentOrPartnerVal: item.equipmentOrPartnerVal || 'Volunteers requested to bring gloves & water bottles',
            actionTasks: item.actionTasks || [
              'Citizen volunteer briefing & safety coordination',
              'Ward squad equipment distribution & zone cleanup',
              'NAGAR-X completion log & volunteer credit sign-off'
            ],
            volunteersRegistered: item.volunteersRegistered ?? 1,
            volunteersCapacity: item.volunteersCapacity ?? 100,
            joinedUserInitials: item.joinedUserInitials || ['RS'],
            joinedNote: item.joinedNote || 'Saved in Database • Verified Entry',
            isUserRSVPed: item.isUserRSVPed ?? false,
            coverImage: item.coverImage,
            isFromDatabase: true
          }));

          const updatedList = [...convertedFirestoreEvents, ...nonDatabaseSeed];
          try {
            localStorage.setItem('nagarx_civic_events', JSON.stringify(convertedFirestoreEvents));
          } catch (e) {
            // ignore quota error
          }
          return updatedList;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Toggle RSVP (Updates local state & syncs to Firestore)
  const handleToggleRSVP = async (id: string) => {
    const targetEvent = events.find(e => e.id === id);
    if (!targetEvent) return;

    const nextState = !targetEvent.isUserRSVPed;
    const delta = nextState ? 1 : -1;

    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return {
          ...evt,
          isUserRSVPed: nextState,
          volunteersRegistered: Math.max(0, evt.volunteersRegistered + delta)
        };
      }
      return evt;
    }));

    triggerToast(
      nextState 
        ? `RSVP Confirmed for "${targetEvent.title}"! Synced to database & volunteer pass issued.`
        : `RSVP Cancelled for "${targetEvent.title}".`
    );

    // Sync to Firestore database
    try {
      await updateCivicEventRsvpInFirestore(id, delta, nextState);
    } catch (err) {
      console.warn('Firestore RSVP sync note:', err);
    }
  };

  // Submit Propose Drive and Persist to Firestore Database
  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim() || !propLocation.trim()) return;

    setIsSubmittingEvent(true);
    const eventId = `evt-usr-${Date.now()}`;
    const catLabel = propCategory === 'cleanliness' 
      ? 'Cleanliness & Sanitation' 
      : propCategory === 'repair' 
      ? 'Road & Pothole Repair Patrols' 
      : propCategory === 'plantation' 
      ? 'Green & Tree Plantation' 
      : 'Ward Public Hearing';

    const newEvt: CivicEvent = {
      id: eventId,
      title: propTitle.trim(),
      organizer: currentUser ? `${currentUser.name} (Citizen Organizer)` : 'Citizen Proposed • Awaiting Ward Council Verification',
      dateTime: propDate.trim() || 'Upcoming Weekend • 07:00 AM',
      assemblyPoint: propLocation.trim(),
      ward: propWard,
      category: propCategory,
      categoryLabel: catLabel,
      categoryTag2: 'Database Saved',
      description: propDesc.trim(),
      stretchOrLocationKey: 'Location',
      stretchOrLocationVal: propLocation.trim(),
      equipmentOrPartnerKey: 'Requirements',
      equipmentOrPartnerVal: 'Volunteers requested to bring gloves & water bottles',
      actionTasks: [
        'Volunteer arrival & safety briefing at assembly point',
        'Distribution of safety gear, bags, and tools',
        'Execution of civic drive objective and geo-tagged photographic signoff'
      ],
      volunteersRegistered: 1,
      volunteersCapacity: 50,
      joinedUserInitials: ['RS'],
      joinedNote: '1 citizen registered (You) • Saved in Database',
      isUserRSVPed: true,
      isFromDatabase: true
    };

    // Optimistic UI update & local backup
    setEvents(prev => {
      const nextList = [newEvt, ...prev.filter(x => x.id !== eventId)];
      try {
        localStorage.setItem('nagarx_civic_events', JSON.stringify(nextList.filter(x => x.isFromDatabase)));
      } catch (e) {
        // ignore
      }
      return nextList;
    });
    setShowProposeModal(false);

    try {
      // Direct persistence to Firestore Database in 'events' collection
      await saveCivicEventToFirestore({
        id: eventId,
        title: newEvt.title,
        dateTime: newEvt.dateTime,
        assemblyPoint: newEvt.assemblyPoint,
        location: newEvt.assemblyPoint,
        ward: newEvt.ward,
        category: newEvt.category,
        categoryLabel: newEvt.categoryLabel,
        categoryTag2: 'Database Saved',
        description: newEvt.description,
        organizer: newEvt.organizer,
        stretchOrLocationKey: newEvt.stretchOrLocationKey,
        stretchOrLocationVal: newEvt.stretchOrLocationVal,
        equipmentOrPartnerKey: newEvt.equipmentOrPartnerKey,
        equipmentOrPartnerVal: newEvt.equipmentOrPartnerVal,
        actionTasks: newEvt.actionTasks,
        volunteersRegistered: 1,
        volunteersCapacity: 50,
        joinedUserInitials: ['RS'],
        joinedNote: '1 citizen registered • Saved in Database',
        isUserRSVPed: true
      });

      triggerToast(`✓ New Civic Drive "${propTitle}" saved to Firestore Database!`);
    } catch (error) {
      console.error('Error saving civic drive to database:', error);
      triggerToast(`Drive created in local state (Saved to database when connected).`);
    } finally {
      setIsSubmittingEvent(false);
      setPropTitle('');
      setPropLocation('');
      setPropDesc('');
      setPropDate('');
    }
  };

  // Filtered Events
  const megaDrive = events.find(e => e.isMegaDrive);
  const regularEvents = events.filter(e => !e.isMegaDrive).filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.assemblyPoint.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && e.category === activeCategory;
  });

  return (
    <div className="space-y-6 text-left pb-12">

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP DASHBOARD BANNER (Screenshot #1) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>{t.badge}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowCalendarModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{t.calendarView}</span>
            </button>

            <button 
              onClick={() => setShowProposeModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{t.proposeBtn}</span>
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 4 STAT METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          
          {/* Card 1 */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{t.card1Title}</div>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">{t.card1Sub}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{t.card2Title}</div>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">{t.card2Sub}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{t.card3Title}</div>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">{t.card3Sub}</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{t.card4Title}</div>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">{t.card4Sub}</span>
            </div>
          </div>

        </div>

      </div>

      {/* SEARCH BAR & CATEGORY CHIPS (Screenshot #1) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        
        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by drive name, location..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-300"
              >
                Esc to clear
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select 
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option>My Ward (Navrangpura Ward #14)</option>
              <option>Bodakdev Ward #8</option>
              <option>Vastrapur Ward #15</option>
              <option>Sabarmati Ward #3</option>
              <option>All 48 AMC Wards</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option>This Weekend</option>
              <option>Next 7 Days</option>
              <option>This Month (October)</option>
              <option>Upcoming Month</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              activeCategory === 'all' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            All Civic Drives <span className="ml-1 opacity-80">18</span>
          </button>

          <button 
            onClick={() => setActiveCategory('cleanliness')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeCategory === 'cleanliness' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Cleanliness & Sanitation</span>
          </button>

          <button 
            onClick={() => setActiveCategory('repair')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeCategory === 'repair' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Road & Pothole Repair Patrols</span>
          </button>

          <button 
            onClick={() => setActiveCategory('plantation')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeCategory === 'plantation' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Green & Tree Plantation</span>
          </button>

          <button 
            onClick={() => setActiveCategory('townhall')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeCategory === 'townhall' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Ward Public Hearing</span>
          </button>
        </div>

      </div>

      {/* FEATURED MEGA DRIVE HERO CARD (Screenshot #2) */}
      {megaDrive && (activeCategory === 'all' || activeCategory === 'cleanliness') && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-lg transition-all grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Image with Overlay Badges */}
          <div className="lg:col-span-5 relative min-h-[280px] bg-slate-900 group">
            <img 
              src={megaDrive.coverImage} 
              alt={megaDrive.title} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                Official Mega Drive
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-sm flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>AMC Certified</span>
              </span>
            </div>
          </div>

          {/* Right Column: Event Details */}
          <div className="lg:col-span-7 p-6 sm:p-7 space-y-5 flex flex-col justify-between text-left">
            
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                {megaDrive.directiveText}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {megaDrive.title}
              </h2>

              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                  AMC
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">{megaDrive.organizer}</span>
                  <span className="text-[10px] text-slate-400 font-medium block">Certified Public Social Action Initiative</span>
                </div>
              </div>
            </div>

            {/* Info Grid Box */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Date & Time</span>
                  <span className="font-black text-slate-900">{megaDrive.dateTime}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Assembly Point</span>
                  <span className="font-black text-slate-900">{megaDrive.assemblyPoint}</span>
                </div>
              </div>
            </div>

            {/* Core Action Tasks Checklist */}
            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wider">
                Core Action Tasks:
              </span>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                {megaDrive.actionTasks?.map((task, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Registration Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-extrabold">
                <span className="text-slate-700">{megaDrive.joinedNote}</span>
                <span className="text-blue-600">84% Full</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[84%] transition-all"></div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <button 
                onClick={() => handleToggleRSVP(megaDrive.id)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md flex items-center justify-center space-x-2 ${
                  megaDrive.isUserRSVPed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{megaDrive.isUserRSVPed ? '✓ RSVPed (Joined Free)' : 'RSVP / Join Drive (Free)'}</span>
              </button>

              <button 
                onClick={() => triggerToast("WhatsApp share link generated for Sabarmati Cleanup Drive!")}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-all flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share on WhatsApp</span>
              </button>

              <button 
                onClick={() => setShowGateMapModal(megaDrive)}
                className="px-4 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-all flex items-center space-x-1.5 border border-blue-200/60"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Gate 3 Pin</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* MAIN TWO-COLUMN SECTION: REGULAR EVENTS LIST (8 COLS), LEADERBOARD SIDEBAR (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: UPCOMING CIVIC PATROLS FEED (8 COLS) (Screenshot #3 & #4) */}
        <div className="lg:col-span-8 space-y-5">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Upcoming Community Sanitation & Civic Patrols
            </h2>
            <span className="text-xs font-semibold text-slate-400">Sorted by Chronological Order</span>
          </div>

          {regularEvents.map((evt) => (
            <div 
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4 text-left"
            >
              
              {/* Category Badges Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800">
                    {evt.categoryLabel}
                  </span>
                  {evt.categoryTag2 && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                      {evt.categoryTag2}
                    </span>
                  )}
                  {evt.isFromDatabase && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>Live in Database</span>
                    </span>
                  )}
                </div>

                <span className="text-xs font-extrabold text-blue-700 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{evt.dateTime}</span>
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {/* Specs Box */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-bold block">{evt.stretchOrLocationKey}:</span>
                    <span className="font-extrabold text-slate-900">{evt.stretchOrLocationVal}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-bold block">{evt.equipmentOrPartnerKey}:</span>
                    <span className="font-extrabold text-slate-900">{evt.equipmentOrPartnerVal}</span>
                  </div>
                </div>
              </div>

              {/* Footer Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {evt.joinedUserInitials.map((init, i) => (
                      <div 
                        key={i} 
                        className={`inline-block h-6 w-6 rounded-full ring-2 ring-white text-white text-[10px] font-black flex items-center justify-center ${
                          i % 2 === 0 ? 'bg-slate-900' : 'bg-blue-600'
                        }`}
                      >
                        {init}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-500 font-medium text-[11px]">{evt.joinedNote}</span>
                </div>

                <button 
                  onClick={() => handleToggleRSVP(evt.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-2xs ${
                    evt.isUserRSVPed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : evt.category === 'townhall'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {evt.isUserRSVPed 
                    ? '✓ Registered' 
                    : evt.category === 'townhall' 
                    ? 'Register Seat' 
                    : 'RSVP Now'}
                </button>
              </div>

            </div>
          ))}

          {regularEvents.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-900">No Civic Drives Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No civic drives match your search query or selected category filter. Try selecting "All Civic Drives".
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: WIDGETS (4 COLS) (Screenshot #3 & #4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* WIDGET 1: DRIVES NEAR NAVRANGPURA (Screenshot #3) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Drives Near Navrangpura
                </h3>
              </div>
              <button onClick={() => triggerToast("Expanded map radius to 5km")} className="text-[11px] font-bold text-blue-600 hover:underline">
                Expand
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl h-28 flex flex-col items-center justify-center text-center p-4 border border-slate-200/60 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
              <span className="text-xs font-black text-slate-800 relative z-10">● 3 Drives Within 3.5 km</span>
              <span className="text-[11px] text-slate-500 font-medium relative z-10 mt-1">Assembly hubs at Riverfront, Commerce Six Rd, Stadium</span>
            </div>
          </div>

          {/* WIDGET 2: VOLUNTEER HONOR ROLL (LEADERBOARD) (Screenshot #3) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Volunteer Honor Roll
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                October
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Recognizing citizens with the highest verified municipal sanitation & ecological service hours.
            </p>

            <div className="space-y-2.5">
              
              {/* Leader 1 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Darshana Parikh</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">Navrangpura Ward #14</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-600 block">36.5 Hrs</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">8 Drives</span>
                </div>
              </div>

              {/* Leader 2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Keval Shah</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">Sabarmati Ward #03</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-600 block">28.0 Hrs</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">6 Drives</span>
                </div>
              </div>

              {/* Leader 3 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Ramanbhai Patel</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">Heritage Ward #02</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-blue-600 block">24.5 Hrs</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">5 Drives</span>
                </div>
              </div>

            </div>

            <button 
              onClick={() => setShowLeaderboardModal(true)}
              className="w-full py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-all border border-blue-200/60"
            >
              View Full City Leaderboard
            </button>
          </div>

          {/* WIDGET 3: MUNICIPAL IMPACT Q3-Q4 (Screenshot #4) */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-4 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block">
              📊 MUNICIPAL IMPACT Q3-Q4
            </span>

            <h3 className="text-base font-black text-white">
              Landfill Diversion Metric
            </h3>

            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div>
                <span className="text-3xl font-black text-white">78.4%</span>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block mt-0.5">
                  Segregated & Recycled
                </span>
              </div>

              {/* Progress Donut Graphic */}
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-emerald-400 flex items-center justify-center text-[10px] font-black">
                78%
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 font-medium">
              <div className="flex justify-between">
                <span>Wet Organic Waste Composted:</span>
                <strong className="text-white">41.8 Tonnes</strong>
              </div>
              <div className="flex justify-between">
                <span>Rigid Plastics Sent to Pyrolysis:</span>
                <strong className="text-white">19.2 Tonnes</strong>
              </div>
            </div>
          </div>

          {/* WIDGET 4: VOLUNTEER SAFETY CODE (Screenshot #4) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Volunteer Safety Code
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Footwear:</strong>
                  <span className="text-slate-500 font-medium">Closed-toe sturdy shoes are mandatory for all pavement and riverbed cleanups.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Hydration:</strong>
                  <span className="text-slate-500 font-medium">AMC provides filtered water refill tanks; bring personal reusable bottles.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Medical Support:</strong>
                  <span className="text-slate-500 font-medium">AMC 108 first-responder van stationed at each assembly point.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Civic Hours Certificate:</strong>
                  <span className="text-slate-500 font-medium">Automatic digital credential issued to your NAGAR-X profile within 24h.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-semibold">Need assistance on site?</span>
              <a href="tel:155303" className="font-extrabold text-blue-700 hover:underline">
                Call AMC Ward Desk 155303
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}

      {/* 1. PROPOSE CIVIC DRIVE MODAL */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  COMMUNITY DIRECTIVE FORM
                </span>
                <h3 className="text-lg font-black text-slate-900">Propose Public Civic Drive</h3>
              </div>
              <button 
                onClick={() => setShowProposeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Drive Title</label>
                <input 
                  type="text"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. Navrangpura Commerce Six Road Spot Cleaning & Tree Watering"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Ward</label>
                  <select 
                    value={propWard}
                    onChange={(e) => setPropWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  >
                    <option>Navrangpura Ward #14</option>
                    <option>Bodakdev Ward #8</option>
                    <option>Vastrapur Ward #15</option>
                    <option>Sabarmati Ward #3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Category</label>
                  <select 
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  >
                    <option value="cleanliness">Cleanliness & Sanitation</option>
                    <option value="repair">Road & Pothole Patrol</option>
                    <option value="plantation">Green & Tree Plantation</option>
                    <option value="townhall">Ward Public Hearing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Assembly Point</label>
                  <input 
                    type="text"
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    placeholder="e.g. Opposite Commerce College Gate"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Proposed Date & Time</label>
                  <input 
                    type="text"
                    value={propDate}
                    onChange={(e) => setPropDate(e.target.value)}
                    placeholder="e.g. Sunday 07:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Drive Objective & Equipment Needed</label>
                <textarea 
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the problem area, expected volunteer tasks, and equipment needed from AMC..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Database persistence badge note */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center space-x-2 text-xs text-emerald-800">
                <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  This civic drive proposal will be persisted permanently in the municipal Firestore Database.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  disabled={isSubmittingEvent}
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmittingEvent && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmittingEvent ? 'Saving to Database...' : 'Submit Drive Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CALENDAR VIEW MODAL */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">October - November 2024 Civic Schedule</h3>
              </div>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block">Sat, Oct 28 • 07:00 AM</strong>
                  <span className="text-slate-600">Navrangpura Road Cleansing Drive</span>
                </div>
                <span className="px-2 py-1 bg-blue-600 text-white rounded-lg font-bold text-[10px]">Ward 14</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block">Sun, Oct 29 • 06:30 AM</strong>
                  <span className="text-slate-600">Mega Sabarmati Riverfront Plastic-Free Drive</span>
                </div>
                <span className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">City-Wide</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block">Tue, Oct 31 • 08:00 AM</strong>
                  <span className="text-slate-600">Old City Heritage Pol De-silting</span>
                </div>
                <span className="px-2 py-1 bg-slate-800 text-white rounded-lg font-bold text-[10px]">UNESCO Ward 2</span>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl flex justify-between items-center">
                <div>
                  <strong className="text-slate-900 block">Fri, Nov 03 • 05:00 PM</strong>
                  <span className="text-slate-600">Open Ward Corporator Townhall</span>
                </div>
                <span className="px-2 py-1 bg-purple-600 text-white rounded-lg font-bold text-[10px]">Public Hearing</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="px-5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. GATE MAP MODAL */}
      {showGateMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">{showGateMapModal.assemblyPoint}</h3>
              </div>
              <button 
                onClick={() => setShowGateMapModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl h-44 flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200">
              📍 GPS Assembly Pin: Lat 23.0338, Long 72.5641 (Riverfront Gate 3)
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Free parking available at Subhash Bridge promenade multi-level parking lot. AMC volunteer desk stationed right outside Gate 3.
            </p>

            <button 
              onClick={() => {
                setShowGateMapModal(null);
                triggerToast("Opening Google Maps Directions to Riverfront Gate 3...");
              }}
              className="w-full py-2.5 rounded-2xl bg-blue-600 text-white font-extrabold text-xs"
            >
              Open in Maps Navigation
            </button>
          </div>
        </div>
      )}

      {/* 4. LEADERBOARD MODAL */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">City-Wide Volunteer Honor Roll</h3>
              </div>
              <button 
                onClick={() => setShowLeaderboardModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex justify-between items-center font-extrabold text-amber-950">
                <span>1. Darshana Parikh (Ward 14)</span>
                <span>36.5 Hours • 8 Drives</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center font-extrabold text-slate-800">
                <span>2. Keval Shah (Ward 3)</span>
                <span>28.0 Hours • 6 Drives</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center font-extrabold text-slate-800">
                <span>3. Ramanbhai Patel (Ward 2)</span>
                <span>24.5 Hours • 5 Drives</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-between items-center font-extrabold text-slate-800">
                <span>4. Rahul Sharma (You - Ward 14)</span>
                <span>18.0 Hours • 4 Drives</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowLeaderboardModal(false)}
                className="px-5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsPage;
