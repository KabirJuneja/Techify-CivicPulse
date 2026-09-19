import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, Search, Filter, MapPin, AlertCircle, Clock, CheckCircle2, 
  SlidersHorizontal, Info, Navigation, Plus, Minus, Layers, ExternalLink 
} from 'lucide-react';
import { Ticket, Language } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  tickets: Ticket[];
}

const MODAL_PINS = [
  { id: '1', title: 'Pothole near Radhe Crossroad', category: 'Pothole & Road Damage', ward: 'Bodakdev, Ward 8', status: 'resolved', lat: 23.0385, lng: 72.5119, desc: 'Large crater in middle of traffic junction causing speed reduction.', reportedAt: '17/09/2026', reporterName: 'Hasmukhbhai Patel' },
  { id: '2', title: 'Broken Streetlight Lane 4', category: 'Broken Streetlight', ward: 'Naranpura, Ward 3', status: 'resolved', lat: 23.0520, lng: 72.5530, desc: 'Continuous blackouts for past 10 days near community park.', reportedAt: '18/09/2026', reporterName: 'Pooja Trivedi' },
  { id: '3', title: 'Water Leakage Main Pipeline', category: 'Water Leakage / Pipe Burst', ward: 'Vastrapur, Ward 6', status: 'in-progress', lat: 23.0350, lng: 72.5293, desc: 'Fresh water leaking at high pressure flooding the road near Lake.', reportedAt: '18/09/2026', reporterName: 'Rameshwar Shah' },
  { id: '4', title: 'Overflowing Municipal Garbage Bin', category: 'Uncleared Garbage Pile', ward: 'Satellite, Ward 7', status: 'pending', lat: 23.0225, lng: 72.5284, desc: 'Waste overflowing for 3 days attracting stray cows and dogs.', reportedAt: '18/09/2026', reporterName: 'Anita Patel' },
  { id: '5', title: 'Dangerous Cable Hanging', category: 'Other Civic Issue', ward: 'Paldi, Ward 5', status: 'in-progress', lat: 23.0130, lng: 72.5620, desc: 'Live electrical cable snapped and hanging dangerously low from pole.', reportedAt: '18/09/2026', reporterName: 'Vikas Jha' },
  { id: '6', title: 'Clogged Drainage Chamber', category: 'Sewage Overflow', ward: 'Ghatlodia, Ward 2', status: 'pending', lat: 23.0670, lng: 72.5350, desc: 'Monsoon drainage blocked causing black water accumulation on road.', reportedAt: '18/09/2026', reporterName: 'Ketan Patel' }
];

export default function MapModal({ isOpen, onClose, language, tickets }: MapModalProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<any>(MODAL_PINS[0]);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Combine custom user tickets with static pins
  const allPins = [
    ...tickets.map(t => ({
      id: t.id,
      title: t.category + ' in ' + t.ward.split(',')[0],
      category: t.category,
      ward: t.ward,
      status: t.status,
      lat: 23.0338 + (Math.random() - 0.5) * 0.04,
      lng: 72.5539 + (Math.random() - 0.5) * 0.04,
      desc: t.description,
      reportedAt: t.reportedAt,
      reporterName: t.reporterName
    })),
    ...MODAL_PINS
  ];

  const filteredPins = allPins.filter(pin => {
    const matchesStatus = filterStatus === 'all' || pin.status === filterStatus;
    const matchesSearch = pin.ward.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pin.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pin.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    let map: L.Map | null = null;
    let timer: any = null;

    try {
      map = L.map(mapContainerRef.current, {
        center: [23.0338, 72.5539],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Timeout invalidateSize to ensure correct rendering inside modal popup
      timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
          } catch (e) {}
        }
      }, 100);
    } catch (e) {
      console.warn('MapModal map init error:', e);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (markersLayerRef.current) {
        try { markersLayerRef.current.clearLayers(); } catch (e) {}
        markersLayerRef.current = null;
      }
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !isOpen) return;

    try {
      markersLayerRef.current.clearLayers();
      const map = mapInstanceRef.current;

      filteredPins.forEach(pin => {
        let colorClass = 'bg-red-500 border-red-600';
        if (pin.status === 'in-progress') colorClass = 'bg-amber-500 border-amber-600';
        if (pin.status === 'resolved') colorClass = 'bg-emerald-500 border-emerald-600';

        const isSelected = selectedIssue?.id === pin.id;

        const markerHtml = `
          <div class="custom-civic-pin">
            <div class="w-7 h-7 rounded-full border-2 text-white font-black text-[10px] flex items-center justify-center shadow-lg transition-transform ${colorClass} ${
              isSelected ? 'scale-125 ring-4 ring-blue-500/30' : 'hover:scale-110'
            }">
              ●
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-pin-point',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([pin.lat, pin.lng], { icon: customIcon });

        marker.on('click', () => {
          setSelectedIssue(pin);
          if (mapInstanceRef.current) {
            try {
              map.flyTo([pin.lat, pin.lng], 15, { duration: 1 });
            } catch (e) {}
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    } catch (e) {
      console.warn('MapModal marker update error:', e);
    }
  }, [isOpen, filterStatus, searchQuery, selectedIssue]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500 text-white border-emerald-600';
      case 'in-progress': return 'bg-amber-500 text-white border-amber-600';
      default: return 'bg-red-500 text-white border-red-600';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200 border border-slate-100 text-left">
        
        {/* Left Side: Map Dashboard (Main Area) */}
        <div className="flex-1 flex flex-col relative h-1/2 md:h-full bg-slate-100 border-r border-gray-100">
          
          {/* Map Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-400 flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by ward or issue category...' : 'વોર્ડ કે ફરિયાદ પ્રકાર શોધો...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold"
              />
            </div>
            
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${filterStatus === 'all' ? 'bg-blue-600 text-white font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                {language === 'en' ? 'All Issues' : 'તમામ ફરિયાદો'}
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${filterStatus === 'pending' ? 'bg-red-600 text-white font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                <span>{language === 'en' ? 'Pending' : 'બાકી'}</span>
              </button>
              <button
                onClick={() => setFilterStatus('in-progress')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${filterStatus === 'in-progress' ? 'bg-amber-500 text-white font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                <span>{language === 'en' ? 'In Progress' : 'ચાલુ'}</span>
              </button>
              <button
                onClick={() => setFilterStatus('resolved')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${filterStatus === 'resolved' ? 'bg-emerald-600 text-white font-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                <span>{language === 'en' ? 'Resolved' : 'ઉકેલાયેલ'}</span>
              </button>
            </div>
          </div>

          {/* Real Leaflet Map Container */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />

          {/* Bottom telemetry overlay */}
          <div className="absolute bottom-4 left-4 z-400 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-bold text-slate-700 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Ahmedabad Ward GIS Network</span>
          </div>

        </div>

        {/* Right Side: Issue Inspector Panel */}
        <div className="w-full md:w-96 bg-white p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-sm md:text-base">
                  {language === 'en' ? 'Issue Details' : 'ફરિયાદ વિગતો'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedIssue ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-black text-[10px]">
                      #{selectedIssue.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1 ${getStatusColor(selectedIssue.status)}`}>
                      <span>{selectedIssue.status.toUpperCase()}</span>
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    {selectedIssue.title}
                  </h4>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Category:</span>
                    <span className="font-black text-slate-800">{selectedIssue.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Ward Area:</span>
                    <span className="font-black text-blue-700">{selectedIssue.ward}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Reporter:</span>
                    <span className="font-bold text-slate-700">{selectedIssue.reporterName || 'Citizen Volunteer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Reported On:</span>
                    <span className="font-bold text-slate-700">{selectedIssue.reportedAt || 'Today'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-black text-slate-700 block">Description:</span>
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedIssue.desc}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIssue.lat},${selectedIssue.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer block text-center"
                >
                  <Navigation className="w-3.5 h-3.5 inline" />
                  <span>Navigate in Maps ↗</span>
                </a>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 font-bold text-xs">
                Select any marker on the map to inspect live civic data.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>AMC Smart City Portal</span>
            <button onClick={onClose} className="font-black text-blue-600 hover:underline cursor-pointer">
              Close Map
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
