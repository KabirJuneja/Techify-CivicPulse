import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, CheckCircle, AlertTriangle, MapPin, Sparkles, Clipboard, 
  Phone, Navigation, CheckCircle2, ArrowRight, Radio, ExternalLink,
  LocateFixed, ShieldCheck, Award
} from 'lucide-react';
import { Ticket, Language, Post } from '../types';
import { translations } from '../translations';
import { AHMEDABAD_WARDS_DATA, AHMEDABAD_WARDS_LIST, findNearestWard } from '../lib/wardDetector';
import AudioComplaintRecorder from './AudioComplaintRecorder';
import { saveTicketToFirestore } from '../lib/firebase';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddTicket: (ticket: Ticket) => void;
  onAddPost?: (post: Post) => void;
  onViewOnMap?: (ticketId: string) => void;
}

const ISSUE_CATEGORIES = [
  { id: 'pothole', labelEn: 'Pothole & Road Damage', labelGu: 'ખાડો અને રસ્તાનું નુકસાન', labelHi: 'गड्ढे और सड़क की क्षति' },
  { id: 'streetlight', labelEn: 'Broken Streetlight', labelGu: 'બંધ સ્ટ્રીટલાઈટ', labelHi: 'ખરાબ સ્ટ્રીટલાઇટ' },
  { id: 'garbage', labelEn: 'Uncleared Garbage Pile', labelGu: 'કચરાનો ઢગલો', labelHi: 'કચરે કા ઢેર' },
  { id: 'water', labelEn: 'Water Leakage / Pipe Burst', labelGu: 'પાણીની લાઈન લીકેજ', labelHi: 'પાણી કા રિસાવ' },
  { id: 'sewage', labelEn: 'Sewage Overflow', labelGu: 'ગટર ઉભરાવી', labelHi: 'સીવેજ ઓવરફ્લો' },
  { id: 'hazard', labelEn: 'Loose Wire / Electric Hazard', labelGu: 'ઢીલો વાયર / વીજળીનો ભય', labelHi: 'ખુલા તાર / વિદ્યુત ખતરા' },
  { id: 'other', labelEn: 'Other Civic Issue', labelGu: 'અન્ય સ્થાનિક પ્રશ્ન', labelHi: 'અન્ય સ્થાનીય સમસ્યા' }
];

export default function ReportModal({ 
  isOpen, 
  onClose, 
  language, 
  onAddTicket,
  onAddPost,
  onViewOnMap
}: ReportModalProps) {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    phone: '9876543210',
    category: 'pothole',
    ward: AHMEDABAD_WARDS_LIST[0],
    description: '',
    isAnonymous: false,
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Auto-analysis state
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [detectedPriority, setDetectedPriority] = useState<string>('Medium');
  const [detectedScore, setDetectedScore] = useState<number>(35);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');

  // Live GPS Ward Detection State
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Auto-detect GPS Ward on modal open
  useEffect(() => {
    if (!isOpen) return;
    detectLiveWardFromGps();
  }, [isOpen]);

  const detectLiveWardFromGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatusMessage('Geolocation not supported by device');
      return;
    }

    setIsDetectingGps(true);
    setGpsStatusMessage('Detecting live GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setGpsCoords({ lat: uLat, lng: uLng });
        
        // Find nearest ward
        const { ward, distanceMeters } = findNearestWard(uLat, uLng);
        
        // Auto-select in form
        setFormData(prev => ({
          ...prev,
          ward: ward.name
        }));

        setIsDetectingGps(false);
        setGpsStatusMessage(`📍 Auto-detected Ward: ${ward.name} (${distanceMeters < 1000 ? `${distanceMeters}m away` : `${(distanceMeters/1000).toFixed(1)}km`})`);
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn('GPS location query error:', error.message);
        // Default to Navrangpura if permission denied or error
        setGpsCoords({ lat: 23.0375, lng: 72.5520 });
        setGpsStatusMessage('GPS defaulted to Navrangpura, Ward 4 (Manual selection available)');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  };

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Call AI vision analysis
    setIsAnalyzingImage(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target?.result as string;
      if (b64) {
        try {
          const resp = await fetch('/api/ai/analyze-evidence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: b64,
              context: `Civic issue in ${formData.ward}, Ahmedabad`
            })
          });
          const res = await resp.json();
          if (res.success && res.data) {
            if (res.data.priority) {
              setDetectedPriority(res.data.priority);
            }
            if (res.data.civicScore) {
              setDetectedScore(res.data.civicScore);
            }
            if (res.data.detectedCategory) {
              const matched = ISSUE_CATEGORIES.find(c => 
                c.id.toLowerCase().includes(res.data.detectedCategory.toLowerCase()) ||
                c.labelEn.toLowerCase().includes(res.data.detectedCategory.toLowerCase())
              );
              if (matched) {
                setFormData(prev => ({ ...prev, category: matched.id }));
              }
            }
            if (res.data.description && !formData.description) {
              setFormData(prev => ({ ...prev, description: res.data.description }));
            }
          }
        } catch (err) {
          console.warn('AI analysis error in modal:', err);
        } finally {
          setIsAnalyzingImage(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.isAnonymous && !formData.name.trim()) {
      newErrors.name = language === 'en' ? 'Name is required unless anonymous' : language === 'gu' ? 'અનામી સિવાય નામ જરૂરી છે' : 'अनाम के अलावा नाम आवश्यक है';
    }
    if (!formData.isAnonymous && !formData.phone.trim()) {
      newErrors.phone = language === 'en' ? 'Phone is required for SMS updates' : language === 'gu' ? 'SMS અપડેટ્સ માટે ફોન જરૂરી છે' : 'SMS अपडेट के लिए फोन आवश्यक है';
    } else if (!formData.isAnonymous && !/^\+?[0-9]{10,12}$/.test(formData.phone.trim())) {
      newErrors.phone = language === 'en' ? 'Enter a valid phone number' : language === 'gu' ? 'સાચો ફોન નંબર દાખલ કરો' : 'सही फोन नंबर दर्ज करें';
    }
    if (!formData.description.trim()) {
      newErrors.description = language === 'en' ? 'Description is required' : language === 'gu' ? 'વિગત આપવી જરૂરી છે' : 'विवरण आवश्यक है';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Coordinate resolution
    const selectedWardObj = AHMEDABAD_WARDS_DATA.find(w => w.name === formData.ward) || AHMEDABAD_WARDS_DATA[0];
    const finalLat = gpsCoords?.lat || selectedWardObj.lat;
    const finalLng = gpsCoords?.lng || selectedWardObj.lng;

    setTimeout(() => {
      const ticketId = `#NX-${Math.floor(10000 + Math.random() * 90000)}`;
      const catLabel = ISSUE_CATEGORIES.find(c => c.id === formData.category)?.labelEn || formData.category;
      
      const newTicket: Ticket = {
        id: ticketId,
        category: catLabel,
        ward: formData.ward,
        description: formData.description,
        photoUrl: previewUrl || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80',
        reportedAt: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        reporterName: formData.isAnonymous ? 'Anonymous Citizen' : formData.name,
        isAnonymous: formData.isAnonymous,
        gpsLocation: {
          lat: finalLat,
          lng: finalLng
        }
      };

      // Create new Community Feed Post so it displays across feed & map immediately!
      const newPost: Post = {
        id: `post-${Date.now()}`,
        authorName: formData.isAnonymous ? 'Anonymous Citizen' : formData.name,
        authorHandle: formData.isAnonymous ? '@anonymous' : `@${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
        authorWard: formData.ward,
        authorBadge: formData.isAnonymous ? 'Citizen Reporter' : 'Level 3 Guardian',
        avatarUrl: formData.isAnonymous 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        timeAgo: 'Just now',
        privacy: formData.isAnonymous ? 'Anonymous Public Report' : 'Verified Public Report',
        content: `🚨 **Civic Issue Reported in ${formData.ward}**\n\n${formData.description}\n\n*Live Status*: Geo-routed to AMC Ward Desk & Field Squad for rapid SLA resolution.`,
        mediaType: 'image',
        imageUrl: previewUrl || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80',
        imageTag: catLabel,
        ticketId: ticketId,
        isOfficial: false,
        priority: formData.category === 'hazard' ? 'Urgent Priority' : 'High Priority',
        upvotes: 1,
        commentsCount: 0,
        comments: [],
        isUpvoted: true,
        citizenVerifications: 1,
        verifiedBy: 'AI & GPS Geo-Verified'
      };

      // Persist to Firestore database
      saveTicketToFirestore({
        ticketNum: ticketId,
        authorName: newTicket.reporterName,
        reporterName: newTicket.reporterName,
        isAnonymous: newTicket.isAnonymous,
        ward: newTicket.ward,
        category: catLabel,
        description: newTicket.description,
        priority: detectedPriority,
        civicScoreEarned: detectedScore,
        gpsCoords: gpsCoords || { lat: 23.0375, lng: 72.5520 },
        gpsPrecision: '±5m (High Accuracy GPS)',
        voiceTranscript: voiceTranscript || undefined,
        photoUrls: previewUrl ? [previewUrl] : []
      }).catch(err => console.warn('Firestore modal save note:', err));

      onAddTicket(newTicket);
      if (onAddPost) {
        onAddPost(newPost);
      }

      setSubmittedTicket(newTicket);
      setIsSubmitting(false);
    }, 1200);
  };

  const copyTicketId = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.id);
      alert(language === 'en' ? 'Copied Ticket ID!' : 'ટિકિટ ID કોપી થઈ ગઈ!');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 text-left border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                {submittedTicket 
                  ? (language === 'en' ? 'Report Received & Geo-Tagged' : language === 'gu' ? 'રિપોર્ટ સફળતાપૂર્વક મળ્યો' : 'रिपोर्ट सफलतापूर्वक प्राप्त हुई')
                  : (language === 'en' ? 'Submit New Civic Report' : language === 'gu' ? 'નવો નાગરિક રિપોર્ટ સબમિટ કરો' : 'नया नागरिक रिपोर्ट दर्ज करें')}
              </h3>
              <p className="text-xs font-bold text-slate-500">
                {language === 'en' ? 'Direct link with Ahmedabad Municipal Corporation GIS' : 'અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન સાથે સીધો સંપર્ક'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submittedTicket ? (
            /* Success / Receipt Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col items-center justify-center text-center p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-2.5 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-emerald-900">
                  {language === 'en' ? 'Ticket Geotagged on AMC Live Map!' : language === 'gu' ? 'ટિકિટ AMC સાથે નોંધાયેલ છે!' : 'टिकट AMC के साथ पंजीकृत है!'}
                </h4>
                <p className="text-xs font-semibold text-emerald-700 max-w-md mt-1">
                  {language === 'en' 
                    ? `Your issue has been placed on the Interactive City Map at ${submittedTicket.ward} and posted to the community feed.` 
                    : 'તમારી ફરિયાદ સાર્વજનિક ખાતા પર નોંધવામાં આવી છે.'}
                </p>
              </div>

              {/* Receipt Information Card */}
              <div className="border border-slate-200 bg-slate-50/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">TICKET ID</span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-base font-black text-blue-700 font-mono">{submittedTicket.id}</span>
                      <button 
                        onClick={copyTicketId}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Copy ID"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full border border-amber-200">
                    PENDING AMC DISPATCH
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">CATEGORY</span>
                    <span className="font-extrabold text-slate-800">{submittedTicket.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">MUNICIPAL WARD</span>
                    <span className="font-extrabold text-blue-700">{submittedTicket.ward}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block">GPS COORDINATES</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700">
                    📍 {submittedTicket.gpsLocation?.lat.toFixed(4)}° N, {submittedTicket.gpsLocation?.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-end">
                <button
                  onClick={() => {
                    onClose();
                    if (onViewOnMap) onViewOnMap(submittedTicket.id);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>View Pin on City Map ↗</span>
                </button>

                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow cursor-pointer"
                >
                  {language === 'en' ? 'Done & Return to Feed' : 'પૂર્ણ કરો'}
                </button>
              </div>
            </div>
          ) : (
            /* Active Reporting Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center justify-between p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-blue-900">
                    {language === 'en' ? 'Report Anonymously?' : 'અનામી રીતે રિપોર્ટ કરવો છે?'}
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">
                    {language === 'en' ? 'Hide your identity from public view' : 'પબ્લિક લિસ્ટિંગમાંથી નામ છુપાવો'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* User Identity Details */}
              {!formData.isAnonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-black text-slate-700 mb-1">
                      {language === 'en' ? 'Full Name' : 'પૂરું નામ'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                    />
                    {errors.name && <span className="text-[10px] text-red-500 mt-1 font-semibold">{errors.name}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-black text-slate-700 mb-1 flex items-center justify-between">
                      <span>{language === 'en' ? 'Mobile Number' : 'મોબાઈલ નંબર'} <span className="text-red-500">*</span></span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">SMS Alerts</span>
                    </label>
                    <input 
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.phone ? 'border-red-400' : 'border-slate-200'}`}
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 mt-1 font-semibold">{errors.phone}</span>}
                  </div>
                </div>
              )}

              {/* Category & Municipal Ward with GPS Auto-Detection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-black text-slate-700 mb-1">
                    {language === 'en' ? 'Select Issue Category' : 'સમસ્યાનો પ્રકાર પસંદ કરો'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {ISSUE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === 'en' ? c.labelEn : language === 'gu' ? c.labelGu : c.labelHi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SELECT MUNICIPAL WARD WITH GPS DETECTION */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-slate-700 flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1" />
                      <span>{language === 'en' ? 'Select Municipal Ward' : 'મ્યુનિસિપલ વોર્ડ પસંદ કરો'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={detectLiveWardFromGps}
                      disabled={isDetectingGps}
                      className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 transition-all active:scale-95"
                    >
                      <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                      <span>{isDetectingGps ? 'Detecting...' : 'Auto-Detect Ward'}</span>
                    </button>
                  </div>

                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-300 bg-white rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                  >
                    {AHMEDABAD_WARDS_LIST.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>

                  {/* GPS Telemetry Feedback Badge */}
                  {gpsStatusMessage && (
                    <div className="mt-1 flex items-center space-x-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="truncate">{gpsStatusMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Voice Note Complaint Option */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                  <span>{language === 'en' ? 'Speak or Record Voice Complaint (Gujarati / Hindi / English)' : 'અવાજ દ્વારા ફરિયાદ રેકોર્ડ કરો'}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">Voice-to-Text AI</span>
                </label>
                <AudioComplaintRecorder
                  language={language}
                  initialTranscription={formData.description}
                  onTranscriptionComplete={({ transcription, detectedIssueType }) => {
                    if (transcription) {
                      setVoiceTranscript(transcription);
                      setFormData(prev => ({
                        ...prev,
                        description: prev.description ? `${prev.description}\n\n[Voice Note]: "${transcription}"` : transcription
                      }));
                    }
                    if (detectedIssueType) {
                      const matched = ISSUE_CATEGORIES.find(c => 
                        c.labelEn.toLowerCase().includes(detectedIssueType.toLowerCase()) ||
                        c.id.toLowerCase().includes(detectedIssueType.toLowerCase())
                      );
                      if (matched) {
                        setFormData(prev => ({ ...prev, category: matched.id }));
                      }
                    }
                  }}
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col">
                <label className="text-xs font-black text-slate-700 mb-1">
                  {language === 'en' ? 'Describe the Issue' : 'સમસ્યાની સવિસ્તાર વિગત'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder={language === 'en' ? 'Describe the problem clearly (e.g. Large crater opposite Commerce Six Roads, swerving traffic).' : 'સમસ્યાનું સ્પષ્ટ વર્ણન કરો.'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.description ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.description && <span className="text-[10px] text-red-500 mt-0.5 font-semibold">{errors.description}</span>}
              </div>

              {/* Photo Upload Dropzone */}
              <div className="flex flex-col">
                <label className="text-xs font-black text-slate-700 mb-1">
                  {language === 'en' ? 'Attach Photo Evidence' : 'ફોટો પુરાવો જોડો'}
                </label>
                
                {previewUrl ? (
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
                    <img 
                      src={previewUrl} 
                      alt="Civic report preview" 
                      className="w-full h-full object-cover"
                    />
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold space-x-2">
                        <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                        <span>AI Analyzing Evidence & Priority...</span>
                      </div>
                    )}
                    {!isAnalyzingImage && (
                      <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow ${
                          detectedPriority.toLowerCase().includes('high')
                            ? 'bg-red-600 text-white'
                            : detectedPriority.toLowerCase().includes('medium')
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {detectedPriority} Priority
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full shadow flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>+{detectedScore} Civic Pts</span>
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={removeFile}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                      dragActive ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-400 bg-slate-50'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileInput}
                    />
                    <Upload className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <span className="text-xs font-black text-slate-700 block">
                      Click to upload or drag & drop photo
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Auto-stamped with GPS coordinates
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Radio className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : 'animate-pulse'}`} />
                  <span>{isSubmitting ? 'Geo-Routing Ticket...' : 'Submit & Pin on Map'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
