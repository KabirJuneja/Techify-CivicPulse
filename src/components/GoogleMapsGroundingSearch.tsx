import React, { useState } from 'react';
import { Search, MapPin, Navigation, ExternalLink, Loader2, Sparkles, Building2, Car, Compass } from 'lucide-react';
import { Language } from '../types';

interface GoogleMapsGroundingSearchProps {
  language: Language;
}

export default function GoogleMapsGroundingSearch({ language }: GoogleMapsGroundingSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<{ answer: string; groundingMetadata?: any } | null>(null);

  const popularQueries = [
    { label: 'AMC Ward 14 Office Navrangpura', query: 'AMC Ward Office Navrangpura Commerce College Road Ahmedabad' },
    { label: 'EV Charging Hubs', query: 'Public Fast EV Charging Stations in Navrangpura Vastrapur Ahmedabad' },
    { label: 'BRTS Bus Stations', query: 'Major BRTS Bus Stations near Riverfront Ahmedabad' },
    { label: 'Municipal Hospitals', query: 'AMC Municipal General Hospitals in West Zone Ahmedabad' },
  ];

  const handleSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsLoading(true);
    setResultData(null);

    try {
      const response = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          userLocation: 'Ahmedabad, Gujarat, India',
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setResultData({
          answer: data.answer,
          groundingMetadata: data.groundingMetadata,
        });
      } else {
        setResultData({
          answer: 'Could not fetch live Google Maps data. Please check connection.',
        });
      }
    } catch (error) {
      console.error('Maps Grounding search error:', error);
      setIsLoading(false);
      setResultData({
        answer: 'Failed to complete Google Maps grounding query.',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center space-x-1.5">
              <span>Google Maps Live Ward Search</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">Grounding API</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'gu' ? 'અમદાવાદના વોર્ડ કાર્યાલયો, પાર્કિંગ અને મ્યુનિસિપલ સેન્ટરો શોધો' : language === 'hi' ? 'अहमदाबाद के वार्ड कार्यालय, पार्किंग और केंद्र खोजें' : 'Search real live AMC municipal hubs, ward offices & civic services in Ahmedabad'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchQuery);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'gu' ? 'દા.ત. નવરંગપુરા વોર્ડ ઓફિસ, ઇલેક્ટ્રિક ચાર્જિંગ...' : language === 'hi' ? 'उदा. नवरंगपुरा वार्ड ऑफिस, चार्जिंग स्टेशन...' : 'Search e.g. AMC Ward Office Navrangpura, BRTS Hub...'}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
          <span>Search Maps</span>
        </button>
      </form>

      {/* Popular Presets */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase py-1 mr-1">Quick Presets:</span>
        {popularQueries.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setSearchQuery(preset.query);
              handleSearch(preset.query);
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[10px] font-bold border border-slate-200/80 transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-bold text-slate-600">Querying live Google Maps Grounding data for Ahmedabad...</p>
        </div>
      )}

      {/* Result Display */}
      {resultData && !isLoading && (
        <div className="p-4 bg-blue-50/60 border border-blue-200/90 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-blue-900 font-black uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Maps Grounding Answer</span>
          </div>
          <p className="text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-blue-100 whitespace-pre-wrap">
            {resultData.answer}
          </p>
        </div>
      )}
    </div>
  );
}
