import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, Search, Layers, Plus, Minus, Navigation, Share2, 
  ThumbsUp, Camera, CheckCircle2, Clock, AlertTriangle, Calendar, 
  ChevronRight, ArrowRight, ShieldCheck, Check, Sparkles, Eye, 
  Building2, Zap, Droplets, Map, Radio, X, Crosshair, Compass,
  Car, Send, Upload, Info, AlertCircle, ExternalLink, RefreshCw,
  LocateFixed, Shield
} from 'lucide-react';
import { Language, Post } from '../types';
import { AHMEDABAD_WARDS_DATA, findNearestWard } from '../lib/wardDetector';

import potholeImg from '../assets/images/pothole_repaired_after_1789742513449.jpg';
import avatarImg from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';
import wireHazardImg from '../assets/images/evidence_wire_hazard_1789743199289.jpg';
import wasteSpillImg from '../assets/images/evidence_waste_spillage_1789743181414.jpg';
import resolvedImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import sabarmatiImg from '../assets/images/sabarmati_riverfront_drive_1789740233986.jpg';

interface CityMapPageProps {
  language: Language;
  posts: Post[];
  onOpenReportModal: () => void;
  onSelectPost?: (post: Post) => void;
}

export interface MapIssue {
  id: string;
  ticketId: string;
  title: string;
  department: string;
  category: 'urgent' | 'potholes' | 'lights' | 'resolved' | 'events';
  status: 'In Progress' | 'Urgent' | 'Assigned' | 'Resolved & Verified' | 'Event';
  timeAgo: string;
  location: string;
  lat: number;
  lng: number;
  pinLabel: string;
  pinType: 'orange' | 'red' | 'blue' | 'green';
  imageUrl: string;
  authorName: string;
  authorRole: string;
  upvotes: number;
  description: string;
  wardName: string;
  timeline: {
    label: string;
    time: string;
    status: 'completed' | 'active' | 'pending';
    subtext?: string;
  }[];
}

const INITIAL_ISSUES: MapIssue[] = [
  {
    id: 'm1',
    ticketId: '#NX-10482',
    title: 'Deep pothole cluster causing traffic hazard near HL College gate, Navrangpura.',
    department: 'AMC ROADWAYS & INFRASTRUCTURE',
    category: 'potholes',
    status: 'In Progress',
    timeAgo: '4h ago',
    location: 'Opposite Commerce Six Roads, Navrangpura, Ahmedabad',
    lat: 23.0375,
    lng: 72.5520,
    pinLabel: '#NX-10482',
    pinType: 'orange',
    imageUrl: potholeImg,
    authorName: 'Rahul Sharma',
    authorRole: 'Navrangpura Resident • Level 3 Contributor',
    upvotes: 38,
    wardName: 'Ward 14 Navrangpura',
    description: 'Multiple deep potholes spanning 15 meters near HL College entrance. Causes two-wheelers to swerve dangerously during peak morning hours.',
    timeline: [
      { label: 'Report Logged by Citizen', time: 'Today, 09:15 AM', status: 'completed' },
      { label: 'Inspected by Ward Officer Dave', time: 'Today, 11:30 AM • Priority: High', status: 'completed' },
      { label: 'Road Crew Team B Dispatched', time: 'Today, 02:15 PM • Bitumen mixer en route', status: 'active' },
      { label: 'Resolution & Public Sign-off', time: 'Est: Tomorrow, by 05:00 PM', status: 'pending' },
    ]
  },
  {
    id: 'm2',
    ticketId: '#NX-10490',
    title: 'Traffic signal outage at Ashram Road - Income Tax Intersection causing gridlock.',
    department: 'TRAFFIC CELL / AMC ELECTRICAL',
    category: 'urgent',
    status: 'Urgent',
    timeAgo: '1h ago',
    location: 'Income Tax Underpass Junction, Ashram Road, Ahmedabad',
    lat: 23.0402,
    lng: 72.5714,
    pinLabel: 'Signal Out',
    pinType: 'red',
    imageUrl: wireHazardImg,
    authorName: 'Anand Patel',
    authorRole: 'Ward 14 Traffic Volunteer',
    upvotes: 64,
    wardName: 'Ward 14 Navrangpura',
    description: 'North-bound traffic signal lights are completely blank due to storm water power supply trip. Traffic police managing manually.',
    timeline: [
      { label: 'Emergency Signal Malfunction Reported', time: 'Today, 12:00 PM', status: 'completed' },
      { label: 'Traffic Police & Electrical Team Dispatched', time: 'Today, 12:20 PM', status: 'active' },
      { label: 'Controller Board Replacement', time: 'Est: Today, 03:00 PM', status: 'pending' },
    ]
  },
  {
    id: 'm3',
    ticketId: '#NX-10420',
    title: 'Sabarmati Heritage Walk & Cleanliness Drive Organized by AMC Youth Wing.',
    department: 'CIVIC EVENTS & HERITAGE',
    category: 'events',
    status: 'Event',
    timeAgo: 'Event Today',
    location: 'Sabarmati Riverfront West Walkway, Atal Bridge Periphery',
    lat: 23.0305,
    lng: 72.5760,
    pinLabel: 'Heritage Walk',
    pinType: 'blue',
    imageUrl: sabarmatiImg,
    authorName: 'AMC Cultural Cell',
    authorRole: 'Municipal Official Organizer',
    upvotes: 112,
    wardName: 'Ward 2 Old City / Riverfront',
    description: 'Community gathering uniting volunteers from 14 wards for a guided pol heritage walk and Sabarmati promenade cleanup.',
    timeline: [
      { label: 'Event Registered in AMC Grid', time: 'Yesterday', status: 'completed' },
      { label: 'Volunteers Assembling at West Gate', time: 'Live Now', status: 'active' },
      { label: 'Sapling Distribution & Drive End', time: 'Est: Today, 06:00 PM', status: 'pending' },
    ]
  },
  {
    id: 'm4',
    ticketId: '#NX-10495',
    title: 'Overflowing commercial waste bin emptied and footpath disinfected.',
    department: 'SOLID WASTE MANAGEMENT',
    category: 'resolved',
    status: 'Resolved & Verified',
    timeAgo: '2h ago',
    location: 'Law Garden Khau Gali & Evening Craft Market Periphery',
    lat: 23.0238,
    lng: 72.5574,
    pinLabel: 'Fixed',
    pinType: 'green',
    imageUrl: resolvedImg,
    authorName: 'Priya Desai',
    authorRole: 'Law Garden Area Rep',
    upvotes: 45,
    wardName: 'Ward 14 Navrangpura',
    description: 'Sanitation squad completed bin emptying, pressure washing, and lime-powder bleaching around food kiosks.',
    timeline: [
      { label: 'Reported by Citizen', time: 'Today, 08:00 AM', status: 'completed' },
      { label: 'Sanitation Truck #09 Arrived', time: 'Today, 09:30 AM', status: 'completed' },
      { label: 'Area Cleaned & Disinfected', time: 'Today, 10:15 AM', status: 'completed' },
      { label: 'Verified by Ward Officer', time: 'Today, 10:30 AM', status: 'completed' },
    ]
  },
  {
    id: 'm5',
    ticketId: '#NX-10512',
    title: 'High-voltage exposed street junction box near Judges Bungalow.',
    department: 'UGVCL & AMC POWER DISTRIBUTION',
    category: 'lights',
    status: 'Urgent',
    timeAgo: '30m ago',
    location: 'Near Pakwan Cross Roads, Judges Bungalow Road, Bodakdev',
    lat: 23.0385,
    lng: 72.5119,
    pinLabel: '⚡ Hazard',
    pinType: 'red',
    imageUrl: wireHazardImg,
    authorName: 'Vikram Joshi',
    authorRole: 'Bodakdev Resident',
    upvotes: 29,
    wardName: 'Ward 8 Bodakdev',
    description: 'Open electrical feeder pillar box with hanging insulated wires after tree branch fell during strong wind.',
    timeline: [
      { label: 'Hazard Reported & Geotagged', time: 'Today, 01:10 PM', status: 'completed' },
      { label: 'Area Cordoned by Patrol', time: 'Today, 01:30 PM', status: 'active' },
      { label: 'Box Insulated & Locked', time: 'Est: Today, 03:30 PM', status: 'pending' },
    ]
  },
  {
    id: 'm6',
    ticketId: '#NX-10520',
    title: 'Smart EV 120kW Rapid Charging Station operational with 6 open bays.',
    department: 'AMC URBAN MOBILITY',
    category: 'events',
    status: 'Resolved & Verified',
    timeAgo: 'Yesterday',
    location: 'Vastrapur Lake Amphitheatre Municipal Hub',
    lat: 23.0350,
    lng: 72.5293,
    pinLabel: '⚡ EV Hub',
    pinType: 'green',
    imageUrl: resolvedImg,
    authorName: 'Smart City Mission Team',
    authorRole: 'AMC Directorate',
    upvotes: 88,
    wardName: 'Ward 14 Vastrapur',
    description: '24/7 public EV fast chargers powered by rooftop solar panels with CCS2 connectors.',
    timeline: [
      { label: 'Installation Completed', time: 'Last Week', status: 'completed' },
      { label: 'Grid Sync Certified', time: 'Yesterday', status: 'completed' },
      { label: 'Open for Public Charging', time: 'Live Now', status: 'completed' },
    ]
  },
  {
    id: 'm7',
    ticketId: '#NX-10530',
    title: 'Stormwater drain blockage cleared prior to monsoon alert in Maninagar.',
    department: 'DRAINAGE & SEWERAGE CELL',
    category: 'resolved',
    status: 'Resolved & Verified',
    timeAgo: '5h ago',
    location: 'Near Gate No. 3, Kankaria Lakefront, Maninagar',
    lat: 23.0063,
    lng: 72.5995,
    pinLabel: 'Cleaned',
    pinType: 'green',
    imageUrl: wasteSpillImg,
    authorName: 'Devang Vora',
    authorRole: 'South Zone Civic Lead',
    upvotes: 52,
    wardName: 'Ward 32 Maninagar',
    description: 'AMC suction super-sucker machine cleared 400 meters of underground drainage lines.',
    timeline: [
      { label: 'Silt accumulation reported', time: 'Yesterday', status: 'completed' },
      { label: 'Suction Machine Deployed', time: 'Today, 07:00 AM', status: 'completed' },
      { label: 'Flow Restored & Tested', time: 'Today, 10:00 AM', status: 'completed' },
    ]
  },
  {
    id: 'm8',
    ticketId: '#NX-10544',
    title: 'Pipeline leakage repair in progress on Drive-in Road near Thaltej.',
    department: 'WATER SUPPLY & HYDRAULICS',
    category: 'potholes',
    status: 'In Progress',
    timeAgo: '1h ago',
    location: 'Near Himalaya Mall, Drive-In Road, Thaltej',
    lat: 23.0515,
    lng: 72.5270,
    pinLabel: 'Water Leak',
    pinType: 'orange',
    imageUrl: wasteSpillImg,
    authorName: 'Mehul Shah',
    authorRole: 'Thaltej Resident',
    upvotes: 31,
    wardName: 'Ward 9 Thaltej',
    description: 'Underground pipeline joint leakage under rapid valve replacement. One lane closed for safety.',
    timeline: [
      { label: 'Leakage Geotagged', time: 'Today, 10:30 AM', status: 'completed' },
      { label: 'Excavation & Valve Clamp Installed', time: 'Today, 12:45 PM', status: 'active' },
      { label: 'Asphalt Patch Re-laid', time: 'Est: Today, 04:00 PM', status: 'pending' },
    ]
  }
];

const AHMEDABAD_CENTER_COORDS = [23.0338, 72.5539] as [number, number];

export default function CityMapPage({
  language,
  posts,
  onOpenReportModal
}: CityMapPageProps) {
  
  // Category Filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'urgent' | 'potholes' | 'lights' | 'resolved' | 'events'>('all');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically convert community posts and user tickets into MapIssues
  const dynamicPostIssues: MapIssue[] = (posts || [])
    .filter(p => p.ticketId || p.content)
    .map(p => {
      // Find ward matching coordinates
      const matchedWard = AHMEDABAD_WARDS_DATA.find(w => 
        p.authorWard?.toLowerCase().includes(w.id) || 
        p.authorWard?.toLowerCase().includes(w.name.toLowerCase()) ||
        w.name.toLowerCase().includes(p.authorWard?.toLowerCase())
      ) || AHMEDABAD_WARDS_DATA[0];

      // Small jitter based on ID to avoid perfect overlap if multiple issues in same ward
      const hash = (p.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latOffset = ((hash % 17) - 8) * 0.0006;
      const lngOffset = ((hash % 19) - 9) * 0.0006;

      const lat = matchedWard.lat + latOffset;
      const lng = matchedWard.lng + lngOffset;

      const isUrgent = p.priority?.toLowerCase().includes('high') || p.priority?.toLowerCase().includes('urgent');
      const pinType: 'red' | 'orange' | 'green' | 'blue' = 
        p.isResolved ? 'green' : 
        isUrgent ? 'red' : 'orange';

      const catType: 'urgent' | 'potholes' | 'lights' | 'resolved' | 'events' = 
        p.isResolved ? 'resolved' :
        isUrgent ? 'urgent' :
        p.imageTag?.toLowerCase().includes('wire') || p.imageTag?.toLowerCase().includes('light') ? 'lights' :
        'potholes';

      return {
        id: p.id,
        ticketId: p.ticketId || `#NX-${p.id.slice(-5)}`,
        title: p.content.replace(/[*#]/g, '').slice(0, 85) + '...',
        department: `${matchedWard.name.split(',')[0].toUpperCase()} CIVIC SQUAD`,
        category: catType,
        status: p.isResolved ? 'Resolved & Verified' : isUrgent ? 'Urgent' : 'In Progress',
        timeAgo: p.timeAgo || 'Just now',
        location: `${p.authorWard || matchedWard.name}, Ahmedabad`,
        lat,
        lng,
        pinLabel: p.ticketId || p.authorWard.split(' ')[0],
        pinType,
        imageUrl: p.imageUrl || potholeImg,
        authorName: p.authorName,
        authorRole: `${p.authorWard || matchedWard.name} Citizen`,
        upvotes: p.upvotes || 1,
        description: p.content,
        wardName: p.authorWard || matchedWard.name,
        timeline: [
          { label: 'Citizen Report Logged & Geotagged', time: p.timeAgo || 'Just now', status: 'completed' },
          { label: 'Assigned to Ward Engineer', time: 'In progress', status: 'active' },
          { label: 'Public Resolution & Sign-off', time: 'Est: Within 24-48 Hours', status: 'pending' }
        ]
      };
    });

  // Combine dynamic issues with initial catalog
  const allIssues: MapIssue[] = [
    ...dynamicPostIssues,
    ...INITIAL_ISSUES.filter(init => !dynamicPostIssues.some(d => d.ticketId === init.ticketId))
  ];

  // Selected Pin Issue
  const [selectedIssueId, setSelectedIssueId] = useState<string>('m1');
  const selectedIssue = allIssues.find(i => i.id === selectedIssueId) || allIssues[0] || INITIAL_ISSUES[0];


  // Upvotes state
  const [upvotesCount, setUpvotesCount] = useState<Record<string, number>>({
    m1: 38,
    m2: 64,
    m3: 112,
    m4: 45,
    m5: 29,
    m6: 88,
    m7: 52,
    m8: 31
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});

  // Leaflet Map instance & state
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLayer, setMapLayer] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [showTraffic, setShowTraffic] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting GPS location...');
  const [nearestIssueDist, setNearestIssueDist] = useState<string | null>(null);

  // Modals & Feedback
  const [showAddProofModal, setShowAddProofModal] = useState(false);
  const [proofComment, setProofComment] = useState('');
  const [proofPhotoSelected, setProofPhotoSelected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to calculate distance in meters
  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // 1. Initialize Leaflet Map (Guaranteed 100% reliable tile rendering)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Clean up any existing instance first
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Leaflet cleanup error:', e);
      }
      mapInstanceRef.current = null;
    }

    let map: L.Map | null = null;
    let resizeObserver: ResizeObserver | null = null;

    try {
      // Create Map
      map = L.map(mapContainerRef.current, {
        center: AHMEDABAD_CENTER_COORDS,
        zoom: 13,
        zoomControl: false, // We use custom high-craft Tailwind buttons
        attributionControl: false
      });

      // Add High-Contrast Standard Tile Layer (CartoDB Positron / OSM)
      const baseTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = baseTileLayer;

      // Create markers layer group
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
      setMapLoaded(true);

      // Auto-detect user's live location immediately
      autoDetectLiveLocation(map);

      // Resize observer to ensure full height/width tile rendering
      resizeObserver = new ResizeObserver(() => {
        if (isMounted && mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
          } catch (e) {
            // ignore
          }
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    } catch (err) {
      console.warn('Map initialization error:', err);
    }

    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (userMarkerRef.current) {
        try { userMarkerRef.current.remove(); } catch (e) {}
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        try { userAccuracyCircleRef.current.remove(); } catch (e) {}
        userAccuracyCircleRef.current = null;
      }
      if (markersLayerRef.current) {
        try { markersLayerRef.current.clearLayers(); } catch (e) {}
        markersLayerRef.current = null;
      }
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (e) {}
        mapInstanceRef.current = null;
      }
      setMapLoaded(false);
    };
  }, []);

  // Function to auto-detect live location
  const autoDetectLiveLocation = (map: L.Map) => {
    setIsLocating(true);
    setLocationStatus('Querying live GPS antenna...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Verify map is still valid and mounted
          if (!mapInstanceRef.current || mapInstanceRef.current !== map) return;

          const uLat = position.coords.latitude;
          const uLng = position.coords.longitude;
          const coords = { lat: uLat, lng: uLng };
          setUserCoords(coords);
          setIsLocating(false);

          // Detect nearest ward using ward detector utility
          const { ward } = findNearestWard(uLat, uLng);
          setLocationStatus(`📍 Live GPS: ${ward.name} (${uLat.toFixed(4)}°N, ${uLng.toFixed(4)}°E)`);

          // Calculate distance to nearest civic issue
          let minDistance = Infinity;
          let nearestName = '';
          allIssues.forEach(issue => {
            const dist = calcDistance(uLat, uLng, issue.lat, issue.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearestName = issue.ticketId;
            }
          });

          if (minDistance < 5000) {
            setNearestIssueDist(`${minDistance}m from nearest ticket ${nearestName}`);
          } else {
            setNearestIssueDist(`Within Ahmedabad Municipal Zone (${ward.name})`);
          }

          try {
            // Add pulsating GPS icon to map
            if (userMarkerRef.current) {
              try { userMarkerRef.current.remove(); } catch (e) {}
            }
            if (userAccuracyCircleRef.current) {
              try { userAccuracyCircleRef.current.remove(); } catch (e) {}
            }

            const userIcon = L.divIcon({
              className: 'user-live-gps-dot',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            const uMarker = L.marker([uLat, uLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
            uMarker.bindPopup(`<div class="p-2 text-xs font-bold font-sans"><strong>📍 You Are Here</strong><br/>${ward.name}<br/>Live GPS Telemetry Active</div>`);
            userMarkerRef.current = uMarker;

            const circle = L.circle([uLat, uLng], {
              radius: Math.max(position.coords.accuracy || 100, 150),
              color: '#3b82f6',
              fillColor: '#93c5fd',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '4, 4'
            }).addTo(map);
            userAccuracyCircleRef.current = circle;

            // Pan to user if within Gujarat / Ahmedabad bounds
            if (uLat > 22.0 && uLat < 24.5 && uLng > 71.5 && uLng < 73.5) {
              map.flyTo([uLat, uLng], 14, { duration: 1.5 });
              showToast(`Auto-detected ${ward.name} from live GPS!`);
            }
          } catch (e) {
            console.warn('Error placing user location marker:', e);
          }
        },
        (error) => {
          setIsLocating(false);
          console.warn('Geolocation query warning:', error.message);
          setLocationStatus('GPS Ready (Defaulted to Navrangpura Ward 14)');

          // Verify map is still valid and mounted
          if (!mapInstanceRef.current || mapInstanceRef.current !== map) return;

          // Default user marker to Navrangpura
          const defLat = 23.0338;
          const defLng = 72.5539;
          setUserCoords({ lat: defLat, lng: defLng });
          
          try {
            const userIcon = L.divIcon({
              className: 'user-live-gps-dot',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            if (userMarkerRef.current) {
              try { userMarkerRef.current.remove(); } catch (e) {}
            }
            userMarkerRef.current = L.marker([defLat, defLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
          } catch (e) {
            console.warn('Error placing default user marker:', e);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
      setLocationStatus('Geolocation unsupported in browser');
    }
  };

  // 2. Render Markers whenever filtered issues or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    try {
      markersLayerRef.current.clearLayers();
      const map = mapInstanceRef.current;

      filteredIssues.forEach((issue) => {
        // Pin Color Mapping
        let bgClass = 'bg-amber-500 border-amber-600 text-white shadow-amber-500/30';
        if (issue.pinType === 'red') bgClass = 'bg-red-600 border-red-700 text-white shadow-red-500/30';
        if (issue.pinType === 'blue') bgClass = 'bg-blue-600 border-blue-700 text-white shadow-blue-500/30';
        if (issue.pinType === 'green') bgClass = 'bg-emerald-600 border-emerald-700 text-white shadow-emerald-500/30';

        const isSelected = issue.id === selectedIssueId;

        const markerHtml = `
          <div class="custom-civic-pin">
            <div class="px-2.5 py-1 rounded-full border-2 font-black text-[11px] shadow-lg flex items-center space-x-1 whitespace-nowrap transition-transform duration-200 ${bgClass} ${
              isSelected ? 'scale-125 ring-4 ring-blue-500/30 z-50' : 'hover:scale-110'
            }">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>${issue.pinLabel}</span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-pin-wrapper',
          iconSize: [80, 30],
          iconAnchor: [40, 15]
        });

        const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });

        marker.on('click', () => {
          if (!mapInstanceRef.current) return;
          setSelectedIssueId(issue.id);
          try {
            map.flyTo([issue.lat, issue.lng], 15, { duration: 1 });
          } catch (e) {}
          showToast(`Inspecting ${issue.ticketId}: ${issue.title.slice(0, 30)}...`);
        });

        markersLayerRef.current?.addLayer(marker);
      });
    } catch (e) {
      console.warn('Error updating markers:', e);
    }
  }, [mapLoaded, activeCategory, searchQuery, selectedIssueId, allIssues]);

  // Handle Layer change
  const handleLayerChange = (layer: 'roadmap' | 'satellite' | 'terrain') => {
    setMapLayer(layer);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();

    let newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (layer === 'satellite') {
      newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (layer === 'terrain') {
      newUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    const newLayer = L.tileLayer(newUrl, {
      maxZoom: 19,
      subdomains: layer === 'satellite' ? [] : 'abcd'
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    showToast(`Switched map layer to ${layer.toUpperCase()}`);
  };

  // Toggle Traffic Layer
  const toggleTrafficLayer = () => {
    const nextState = !showTraffic;
    setShowTraffic(nextState);
    showToast(nextState ? '🔴 Live AMC Traffic & Road Congestion Layer ON' : 'Traffic Layer OFF');
  };

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
  };

  // Locate Me Button
  const handleLocateMe = () => {
    if (mapInstanceRef.current) {
      autoDetectLiveLocation(mapInstanceRef.current);
    }
  };

  // Search Address / Landmark / Neighborhood
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const q = searchQuery.toLowerCase();

    // 1. Check if matches issue
    const matched = allIssues.find(i => 
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.wardName.toLowerCase().includes(q) ||
      i.ticketId.toLowerCase().includes(q)
    );

    if (matched) {
      setSelectedIssueId(matched.id);
      mapInstanceRef.current.flyTo([matched.lat, matched.lng], 15, { duration: 1.2 });
      showToast(`Located ${matched.ticketId} in ${matched.location}`);
      return;
    }

    // 2. Known Ahmedabad Neighborhood Geocoding
    const places: Record<string, [number, number]> = {
      'bodakdev': [23.0385, 72.5119],
      'vastrapur': [23.0350, 72.5293],
      'navrangpura': [23.0375, 72.5520],
      'ashram road': [23.0402, 72.5714],
      'riverfront': [23.0305, 72.5760],
      'maninagar': [23.0063, 72.5995],
      'thaltej': [23.0515, 72.5270],
      'paldi': [23.0130, 72.5620],
      'satellite': [23.0225, 72.5284],
      'naranpura': [23.0520, 72.5530],
      'ghatlodia': [23.0670, 72.5350],
      'law garden': [23.0238, 72.5574],
      'sg highway': [23.0450, 72.5050]
    };

    const foundKey = Object.keys(places).find(k => q.includes(k));
    if (foundKey) {
      const targetCoords = places[foundKey];
      mapInstanceRef.current.flyTo(targetCoords, 15, { duration: 1.2 });
      showToast(`Panned to ${foundKey.toUpperCase()}, Ahmedabad`);
    } else {
      showToast(`Showing nearest ward results for "${searchQuery}"`);
    }
  };

  const handleUpvote = (issueId: string) => {
    if (hasUpvoted[issueId]) {
      setUpvotesCount(prev => ({ ...prev, [issueId]: prev[issueId] - 1 }));
      setHasUpvoted(prev => ({ ...prev, [issueId]: false }));
      showToast('Removed upvote');
    } else {
      setUpvotesCount(prev => ({ ...prev, [issueId]: prev[issueId] + 1 }));
      setHasUpvoted(prev => ({ ...prev, [issueId]: true }));
      showToast('Upvoted issue! Escalated in Ward Priority Index.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/#map?ticket=${selectedIssue.ticketId}`);
    showToast(`Copied ticket link for ${selectedIssue.ticketId}`);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddProofModal(false);
    setProofComment('');
    setProofPhotoSelected(false);
    showToast(`Verification evidence submitted for ${selectedIssue.ticketId}! Civic points awarded.`);
  };

  // Filter issues based on active chip & search
  const filteredIssues = allIssues.filter(issue => {
    if (activeCategory === 'urgent' && issue.category !== 'urgent') return false;
    if (activeCategory === 'potholes' && issue.category !== 'potholes') return false;
    if (activeCategory === 'lights' && issue.category !== 'lights') return false;
    if (activeCategory === 'resolved' && issue.category !== 'resolved') return false;
    if (activeCategory === 'events' && issue.category !== 'events') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = issue.title.toLowerCase().includes(q) ||
                    issue.location.toLowerCase().includes(q) ||
                    issue.department.toLowerCase().includes(q) ||
                    issue.ticketId.toLowerCase().includes(q) ||
                    issue.wardName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      
      {/* =========================================
          TOP HEADER & LIVE MAP TELEMETRY BAR
          ========================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center space-x-1 shadow-xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                <span>LIVE GIS RADAR</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold">AMC-GEO-CONNECTED</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Interactive Ward Map & Proximity Radar
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-0.5">
              <span className="flex items-center space-x-1 text-slate-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Navrangpura • Ashram Road • Riverfront • Bodakdev</span>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{locationStatus}</span>
              </span>
              {nearestIssueDist && (
                <span className="text-blue-700 font-black bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200 text-[11px] flex items-center space-x-1">
                  <LocateFixed className="w-3 h-3 text-blue-600" />
                  <span>{nearestIssueDist}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-2xl border border-blue-200 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
              <span>{isLocating ? 'Finding GPS...' : 'Auto-Detect My GPS'}</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>

        </div>

        {/* SEARCH BAR & CATEGORY FILTER CHIPS */}
        <div className="space-y-3 pt-2">
          
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by landmark, ticket #NX-10482, road name, or neighborhood (e.g. Bodakdev, Maninagar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all"
            >
              Locate
            </button>
          </form>

          {/* Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all' 
                  ? 'bg-slate-900 text-white shadow-xs font-black' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Issues ({INITIAL_ISSUES.length})
            </button>

            <button
              onClick={() => setActiveCategory('urgent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeCategory === 'urgent' 
                  ? 'bg-red-600 text-white shadow-xs font-black' 
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>🔴 Urgent Priority</span>
            </button>

            <button
              onClick={() => setActiveCategory('potholes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeCategory === 'potholes' 
                  ? 'bg-amber-600 text-white shadow-xs font-black' 
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>🟠 Potholes & Roads</span>
            </button>

            <button
              onClick={() => setActiveCategory('lights')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeCategory === 'lights' 
                  ? 'bg-purple-600 text-white shadow-xs font-black' 
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>⚡ Lighting & Hazard</span>
            </button>

            <button
              onClick={() => setActiveCategory('resolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeCategory === 'resolved' 
                  ? 'bg-emerald-600 text-white shadow-xs font-black' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>🟢 Resolved & Verified</span>
            </button>

            <button
              onClick={() => setActiveCategory('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                activeCategory === 'events' 
                  ? 'bg-blue-600 text-white shadow-xs font-black' 
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span>🔵 Events & Utilities</span>
            </button>
          </div>

        </div>

      </div>


      {/* =========================================
          MAIN MAP STAGE & DETAIL CARD GRID (2 COLS)
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: REAL INTERACTIVE MAP CONTAINER (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm relative">
          
          {/* MAP CANVAS DIV WITH EXPLICIT PIXEL HEIGHT */}
          <div className="relative w-full h-[540px] bg-slate-100">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Floating Top Left Density Badge */}
            <div className="absolute top-4 left-4 z-400 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-left space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                WARD 14 DENSITY
              </span>
              <div className="flex items-center space-x-2 text-[11px] font-black">
                <span className="text-red-600 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>Urgent (19)</span>
                </span>
                <span className="text-amber-600 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>In Progress (42)</span>
                </span>
                <span className="text-emerald-600 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Resolved (86)</span>
                </span>
              </div>
            </div>

            {/* Floating Right Map Controls */}
            <div className="absolute top-4 right-4 z-400 flex flex-col space-y-2">
              
              {/* Zoom In */}
              <button
                onClick={() => handleZoom(1)}
                className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-black transition-all cursor-pointer active:scale-95"
                title="Zoom In"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Zoom Out */}
              <button
                onClick={() => handleZoom(-1)}
                className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-black transition-all cursor-pointer active:scale-95"
                title="Zoom Out"
              >
                <Minus className="w-5 h-5" />
              </button>

              {/* Live GPS Location Button */}
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className="w-10 h-10 bg-white hover:bg-blue-50 text-blue-600 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-black transition-all cursor-pointer active:scale-95"
                title="Center on My Real GPS Location"
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-400' : 'text-blue-600'}`} />
              </button>

              {/* Layer Switcher Button */}
              <button
                onClick={() => {
                  if (mapLayer === 'roadmap') handleLayerChange('satellite');
                  else if (mapLayer === 'satellite') handleLayerChange('terrain');
                  else handleLayerChange('roadmap');
                }}
                className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-black transition-all cursor-pointer active:scale-95"
                title={`Current layer: ${mapLayer}. Click to toggle Satellite/Terrain.`}
              >
                <Layers className="w-4 h-4 text-slate-700" />
              </button>

              {/* Traffic Layer Toggle */}
              <button
                onClick={toggleTrafficLayer}
                className={`w-10 h-10 rounded-2xl shadow-lg border flex items-center justify-center font-black transition-all cursor-pointer active:scale-95 ${
                  showTraffic ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Toggle Real-Time Traffic Congestion Layer"
              >
                <Car className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* BOTTOM LIVE TELEMETRY BAR */}
          <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-extrabold text-slate-100">
                AMC GIS Ward Server Active: 8 Geotagged Tickets Rendered
              </span>
            </div>

            <div className="font-mono text-[11px] text-slate-400">
              Viewing: <span className="text-white font-bold">{selectedIssue.lat.toFixed(4)}° N, {selectedIssue.lng.toFixed(4)}° E</span>
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: FULL PROBLEM DATA & TIMELINE INSPECTOR (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-left">
          
          {/* Header Status & Ticket Info */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 font-mono">
                  {selectedIssue.ticketId}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">{selectedIssue.timeAgo}</span>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-1.5 leading-snug">
                {selectedIssue.title}
              </h2>
            </div>

            <span className={`px-3 py-1 text-xs font-black rounded-full whitespace-nowrap shrink-0 ${
              selectedIssue.category === 'urgent'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : selectedIssue.category === 'resolved'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : selectedIssue.category === 'events'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {selectedIssue.status}
            </span>
          </div>

          {/* Department & Ward Badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                DEPARTMENT JURISDICTION
              </span>
              <span className="font-black text-slate-800">{selectedIssue.department}</span>
            </div>
            <span className="px-2.5 py-1 bg-white text-blue-700 border border-slate-200 rounded-xl font-bold text-[11px]">
              {selectedIssue.wardName}
            </span>
          </div>

          {/* Evidence Photo with Geotag */}
          <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-100 border border-slate-200 group">
            <img 
              src={selectedIssue.imageUrl} 
              alt={selectedIssue.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center space-x-1.5 shadow">
              <MapPin className="w-3 h-3 text-blue-400" />
              <span>{selectedIssue.location}</span>
            </div>
          </div>

          {/* Detailed Description */}
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {selectedIssue.description}
          </p>

          {/* Reporter Profile */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2.5">
              <img 
                src={avatarImg} 
                alt={selectedIssue.authorName} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div>
                <span className="font-black text-slate-900 block">{selectedIssue.authorName}</span>
                <span className="text-[10px] text-slate-500 font-medium">{selectedIssue.authorRole}</span>
              </div>
            </div>

            <button
              onClick={() => handleUpvote(selectedIssue.id)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                hasUpvoted[selectedIssue.id]
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvotesCount[selectedIssue.id] || selectedIssue.upvotes} Upvotes</span>
            </button>
          </div>

          {/* 4-Step Resolution SLA Timeline */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-black text-slate-900">
              <span>Resolution SLA Timeline</span>
              <span className="text-[10px] text-blue-600 font-bold">Standard SLA: 24h</span>
            </div>

            <div className="space-y-2.5">
              {selectedIssue.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : step.status === 'active'
                        ? 'bg-blue-600 text-white animate-pulse ring-2 ring-blue-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    {idx < selectedIssue.timeline.length - 1 && (
                      <div className={`w-0.5 h-6 ${step.status === 'completed' ? 'bg-emerald-300' : 'bg-slate-200'}`}></div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${step.status === 'active' ? 'text-blue-700 font-black' : 'text-slate-800'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{step.time}</span>
                    </div>
                    {step.subtext && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{step.subtext}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowAddProofModal(true)}
              className="px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Add Field Proof</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIssue.lat},${selectedIssue.lng}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions ↗</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1">
            <button 
              onClick={handleShare}
              className="hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Geotag Link</span>
            </button>

            <button 
              onClick={() => showToast(`Escalation notice sent to ${selectedIssue.department}`)}
              className="hover:text-red-600 flex items-center space-x-1 cursor-pointer text-red-700 font-bold"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Escalate Ticket</span>
            </button>
          </div>

        </div>

      </div>


      {/* =========================================
          MODAL: ADD VERIFICATION PROOF
          ========================================= */}
      {showAddProofModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleProofSubmit}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Submit Citizen Verification</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddProofModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Help AMC verify if {selectedIssue.ticketId} is currently being worked on or resolved.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800">
              {selectedIssue.title}
            </div>

            {/* Photo Picker Box */}
            <div 
              onClick={() => {
                setProofPhotoSelected(true);
                showToast('Camera evidence attached (GPS coordinates stamped)');
              }}
              className={`p-6 border-2 border-dashed rounded-2xl text-center space-y-2 cursor-pointer transition-all ${
                proofPhotoSelected ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800' : 'border-slate-300 hover:border-blue-500 bg-slate-50'
              }`}
            >
              <Camera className="w-6 h-6 mx-auto text-blue-600" />
              <span className="text-xs font-black block">
                {proofPhotoSelected ? '✓ 1 Geotagged Photo Attached (23.0338° N)' : 'Click to Take Photo or Upload Evidence'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                Supports JPG, PNG with auto-embedded device metadata
              </span>
            </div>

            {/* Comment */}
            <div className="space-y-1 text-xs">
              <label className="font-extrabold text-slate-700 block">Observation Notes:</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. As of 2 PM, AMC asphalt layer is drying and traffic barricades are in place..."
                value={proofComment}
                onChange={(e) => setProofComment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddProofModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Submit Evidence
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
