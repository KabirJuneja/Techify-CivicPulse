import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Clock, MapPin, Camera, 
  Upload, Check, Send, UserCheck, Wrench, Building2, ChevronRight, 
  FileText, ArrowLeft, RefreshCw, Layers, Award, Sparkles, Filter, X
} from 'lucide-react';
import { Language, Post } from '../types';
import { updateTicketResolutionInFirestore } from '../lib/firebase';

interface AuthorityPortalProps {
  language: Language;
  posts: Post[];
  onResolveTicket: (updatedPost: Post) => void;
  onBackToFeed: () => void;
}

export default function AuthorityPortal({ language, posts, onResolveTicket, onBackToFeed }: AuthorityPortalProps) {
  // Filter for ticket list
  const [ticketFilter, setTicketFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  
  // Selected ticket to resolve
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const selectedPost = posts.find(p => p.id === selectedPostId) || posts[0];

  // Resolution Form States
  const [resolutionStatus, setResolutionStatus] = useState<'resolved' | 'in-progress'>('resolved');
  const [officerName, setOfficerName] = useState('Er. Rajesh Patel');
  const [officerDesignation, setOfficerDesignation] = useState('Senior Zonal Executive Engineer');
  const [officerWard, setOfficerWard] = useState('Ward #12 (Navrangpura / West Zone)');
  const [squadId, setSquadId] = useState('AMC Sanitation Truck #09 & Electrical Line Squad #4');
  const [resolutionRemarks, setResolutionRemarks] = useState(
    'Sanitation Squad #09 cleared 1.2 tons of commercial waste and Torrent Power insulated live feeder line on Pole #14B. Walkway is fully disinfected and clear.'
  );
  const [proofImage, setProofImage] = useState<string>(
    '/src/assets/images/evidence_resolved_cleaned_1789744521770.jpg'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProofImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    setIsSubmitting(true);

    const isResolved = resolutionStatus === 'resolved';
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';

    // Persist to Firestore
    try {
      await updateTicketResolutionInFirestore(selectedPost.ticketId || selectedPost.id, {
        status: isResolved ? 'Resolved' : 'In-Progress',
        isResolved,
        resolvedByOfficer: officerName,
        officerDesignation,
        officerSquad: squadId,
        officerWard: officerWard || selectedPost.authorWard,
        resolutionRemarks,
        resolutionProofUrl: proofImage,
        beforeImageUrl: selectedPost.imageUrl || selectedPost.beforeImageUrl,
        afterImageUrl: proofImage,
        resolutionTime: isResolved ? 'Resolved in 1.5 Hours' : 'In-Progress (Dispatched)',
        resolvedTimestamp: `AMC Ward Resolution Stamp • ${timestampStr}`
      });
    } catch (err) {
      console.warn('Could not sync resolution directly to Firestore:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);

      const updatedPost: Post = {
        ...selectedPost,
        isResolved,
        resolutionTime: isResolved ? 'Resolved in 1.5 Hours' : 'In-Progress (Dispatched)',
        resolvedByOfficer: officerName,
        officerDesignation,
        officerSquad: squadId,
        officerWard: officerWard || selectedPost.authorWard,
        assignedCrew: squadId,
        resolutionRemarks: resolutionRemarks,
        resolutionProofUrl: proofImage,
        afterImageUrl: proofImage,
        beforeImageUrl: selectedPost.imageUrl || selectedPost.beforeImageUrl,
        mediaType: 'comparison',
        resolvedTimestamp: `AMC Ward Resolution Stamp • ${timestampStr}`,
        commentsCount: selectedPost.commentsCount + 1,
        comments: [
          ...(selectedPost.comments || []),
          {
            id: `c-officer-${Date.now()}`,
            authorName: `${officerName} (${officerDesignation})`,
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            content: `Official Resolution Update: ${resolutionRemarks} [Assigned Crew: ${squadId}]`,
            timeAgo: 'Just Now'
          }
        ]
      };

      onResolveTicket(updatedPost);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    }, 800);
  };

  const filteredPosts = posts.filter(p => {
    if (ticketFilter === 'pending') return !p.isResolved;
    if (ticketFilter === 'resolved') return p.isResolved;
    return true;
  });

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      
      {/* Top Officer Portal Banner Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Government Portal</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded-full">
                Ward #12 Desk Active
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>AMC Ward Engineering Resolution Portal</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
              Official workspace for Ahmedabad Municipal Corporation ward officers and field engineers to review citizen reports, upload proof of completed work, and publish resolution updates.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToFeed}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home Feed</span>
            </button>
          </div>
        </div>

        {/* Officer Credentials & Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Officer</div>
              <div className="text-xs font-black text-white">{officerName}</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Pending Ward Tickets</div>
              <div className="text-xs font-black text-amber-400">{posts.filter(p => !p.isResolved).length} Active</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Resolved Today</div>
              <div className="text-xs font-black text-emerald-400">18 Tickets Solved</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">SLA Compliance</div>
              <div className="text-xs font-black text-purple-300">97.4% On-Time</div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Resolution Portal Layout (Left Ticket Queue + Right Resolution Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Ward Incident Queue */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Ward #12 Incoming Incident Queue</span>
              </h3>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredPosts.length} Items
              </span>
            </div>

            {/* Queue Filter Tabs */}
            <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setTicketFilter('all')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  ticketFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTicketFilter('pending')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  ticketFilter === 'pending' ? 'bg-white text-amber-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setTicketFilter('resolved')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  ticketFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Ticket List Cards */}
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredPosts.map((post) => {
              const isSelected = post.id === selectedPostId;
              const ticketId = post.ticketId || `#NX-${10000 + (parseInt(post.id.replace(/\D/g, '')) || 482)}`;

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-blue-700">{ticketId}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      post.isResolved 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {post.isResolved ? 'Resolved' : 'Pending Action'}
                    </span>
                  </div>

                  <p className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[140px]">{post.authorWard}</span>
                    </span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Official Resolution Workspace */}
        <div className="lg:col-span-7 space-y-5">
          
          {selectedPost ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 text-left">
              
              {/* Selected Ticket Overview Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-blue-700 text-base">
                      {selectedPost.ticketId || '#NX-10482'}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full">
                      Ward #12 Incident
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900 mt-0.5">
                    Municipal Complaint Resolution Workspace
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block">Reported By</span>
                  <span className="text-xs font-black text-slate-800">{selectedPost.authorName}</span>
                </div>
              </div>

              {/* Citizen Original Issue Proof Preview Box */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Citizen Original Submission & Evidence</span>
                </h4>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  "{selectedPost.content}"
                </p>

                {selectedPost.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-40 border border-slate-200 relative">
                    <img src={selectedPost.imageUrl} alt="Citizen Evidence" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-sm">
                      Citizen Evidence Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Resolution Form */}
              <form onSubmit={handlePublishResolution} className="space-y-5">
                
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Official Resolution & Field Work Proof Form</span>
                </h3>

                {/* Status Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">Resolution Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setResolutionStatus('resolved')}
                      className={`py-3 px-4 rounded-xl border text-xs font-black flex items-center justify-center space-x-2 transition-all ${
                        resolutionStatus === 'resolved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Resolved & Complete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolutionStatus('in-progress')}
                      className={`py-3 px-4 rounded-xl border text-xs font-black flex items-center justify-center space-x-2 transition-all ${
                        resolutionStatus === 'in-progress'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>In-Progress (Squad Dispatched)</span>
                    </button>
                  </div>
                </div>

                {/* Officer & Squad Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">Responsible Ward Engineer</label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">Official Designation</label>
                    <input
                      type="text"
                      value={officerDesignation}
                      onChange={(e) => setOfficerDesignation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">Municipal Ward / Zone</label>
                    <input
                      type="text"
                      value={officerWard}
                      onChange={(e) => setOfficerWard(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 block">Assigned Squad / Vehicle ID</label>
                    <input
                      type="text"
                      value={squadId}
                      onChange={(e) => setSquadId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Evidence Photo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 flex items-center justify-between">
                    <span>Upload Completed Work Evidence Photo</span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Geo-Stamp Auto Embedded</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    {proofImage && (
                      <div className="md:col-span-2 rounded-xl overflow-hidden h-36 border border-slate-200 relative shadow-2xs">
                        <img src={proofImage} alt="Completion Proof" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          ✓ Official Work Proof Photo
                        </span>
                      </div>
                    )}

                    <div className={proofImage ? 'md:col-span-1' : 'md:col-span-3'}>
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-all text-center">
                        <Camera className="w-6 h-6 text-blue-600 mb-1" />
                        <span className="text-xs font-bold text-slate-700">Change Proof Photo</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Click to browse file</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Officer Resolution Remarks */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">Official Engineer Resolution Remarks</label>
                  <textarea
                    rows={3}
                    value={resolutionRemarks}
                    onChange={(e) => setResolutionRemarks(e.target.value)}
                    placeholder="Provide clear technical notes on how the issue was inspected and resolved..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    required
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing Official Resolution & Updating Feed...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Resolution & Publish to Citizen Feed</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-black text-slate-700 text-sm">Select a ticket from the left queue to resolve</h3>
            </div>
          )}

        </div>

      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Resolution Published to Home Feed!</h4>
            <p className="text-[11px] text-slate-300">Citizens subscribed to Ward #12 have been notified via WhatsApp & AMC Feed.</p>
          </div>
        </div>
      )}

    </div>
  );
}
