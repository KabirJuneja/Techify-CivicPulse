import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, Navigation, Building2, Map, ClipboardList, Users, 
  Calendar, Landmark, ShieldCheck, Settings, Plus, Search, Globe, 
  Bell, MessageSquare, MapPin, Sparkles, Image as ImageIcon, Video, 
  AlertTriangle, ThumbsUp, MessageCircle, Share2, Bookmark, CheckCircle2, 
  Radio, ArrowRight, Check, X, Shield, ExternalLink, LogOut, ChevronDown, 
  Sun, Wind, Activity, HeartHandshake, Eye, Award, Volume2, Filter, Wrench, Trash2, Zap
} from 'lucide-react';
import { Language, UserProfile, Post, ModalType, Ticket, FeedComment } from '../types';
import { translations } from '../translations';
import { subscribeToTickets } from '../lib/firebase';
import ReportIssuePage from './ReportIssuePage';
import LegalAuditModal from './LegalAuditModal';
import AuthorityPortal from './AuthorityPortal';
import HighAuthorityDashboard from './HighAuthorityDashboard';
import CityMapPage from './CityMapPage';
import ExplorePage from './ExplorePage';
import CityHubPage from './CityHubPage';
import NearbyPage from './NearbyPage';
import MyReportsPage from './MyReportsPage';
import CommunitiesPage from './CommunitiesPage';
import EventsPage from './EventsPage';
import NagarXLogo from './NagarXLogo';
import UserProfilePage from './UserProfilePage';
import GoogleMapsGroundingSearch from './GoogleMapsGroundingSearch';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';
import { RestrictedAccessView } from './RestrictedAccessView';
import { DEMO_USERS, canAccessWardDesk, canAccessCommissionerPortal } from '../data/demoUsers';
import { UserRole } from '../types';

interface FeedDashboardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onBackToHome?: () => void;
  onOpenModal: (type: ModalType) => void;
  userTickets: Ticket[];
  currentUser?: UserProfile;
  onUpdateCurrentUser?: (user: UserProfile) => void;
}

export default function FeedDashboard({ 
  language, 
  onLanguageChange, 
  onLogout, 
  onBackToHome,
  onOpenModal,
  userTickets,
  currentUser: propCurrentUser,
  onUpdateCurrentUser
}: FeedDashboardProps) {
  
  const t = translations[language].dashboard;

  // Current user state (synced with props or internal state)
  const [internalUser, setInternalUser] = useState<UserProfile>(propCurrentUser || DEMO_USERS.citizen);
  const currentUser = propCurrentUser || internalUser;

  const setCurrentUser = (updater: React.SetStateAction<UserProfile>) => {
    if (typeof updater === 'function') {
      const nextUser = updater(currentUser);
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(nextUser);
      } else {
        setInternalUser(nextUser);
      }
    } else {
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(updater);
      } else {
        setInternalUser(updater);
      }
    }
  };

  const handleSwitchDemoRole = (newRole: UserRole) => {
    const selected = DEMO_USERS[newRole];
    setCurrentUser(selected);
  };

  // Active navigation tab on the left sidebar
  const [activeNav, setActiveNav] = useState<'home' | 'explore' | 'nearby' | 'city_hub' | 'city_map' | 'my_reports' | 'communities' | 'events' | 'transparency' | 'report_form' | 'authority_portal' | 'high_authority' | 'profile' | 'maps_search'>('home');
  const [selectedAuditPost, setSelectedAuditPost] = useState<Post | null>(null);

  // Automatically adjust navigation if active role changes to prevent unauthorized view
  useEffect(() => {
    if (activeNav === 'high_authority' && !canAccessCommissionerPortal(currentUser.role)) {
      setActiveNav(canAccessWardDesk(currentUser.role) ? 'authority_portal' : 'home');
    } else if (activeNav === 'authority_portal' && !canAccessWardDesk(currentUser.role)) {
      setActiveNav('home');
    }
  }, [currentUser.role, activeNav]);

  const handleResolveTicketFromPortal = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleOpenReportForm = () => {
    setActiveNav('report_form');
  };

  const handleReportCreated = (newReportPost: Post) => {
    setPosts([newReportPost, ...posts]);
    setCurrentUser(prev => ({
      ...prev,
      reportedCount: prev.reportedCount + 1,
      civicScore: prev.civicScore + 25,
      upvotesReceived: prev.upvotesReceived + 1
    }));
    setActiveNav('home');
    setSelectedAuditPost(newReportPost);
  };

  // Sync any newly submitted tickets from ReportModal into feed posts
  useEffect(() => {
    if (userTickets && userTickets.length > 0) {
      setPosts(prev => {
        const missingTickets = userTickets.filter(t => !prev.some(p => p.ticketId === t.id));
        if (missingTickets.length === 0) return prev;

        const generatedPosts: Post[] = missingTickets.map(t => ({
          id: `post-${t.id}`,
          authorName: t.reporterName,
          authorHandle: t.isAnonymous ? '@anonymous' : `@${t.reporterName.toLowerCase().replace(/\s+/g, '_')}`,
          authorWard: t.ward,
          authorBadge: t.isAnonymous ? 'Citizen Reporter' : 'Level 3 Guardian',
          avatarUrl: t.isAnonymous 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          timeAgo: 'Just now',
          privacy: t.isAnonymous ? 'Anonymous Public Report' : 'Verified Public Report',
          content: `🚨 **Civic Issue Reported in ${t.ward}**\n\n${t.description}\n\n*Live Status*: Geo-routed to AMC Ward Desk & Field Squad for rapid SLA resolution.`,
          mediaType: 'image',
          imageUrl: t.photoUrl || '/src/assets/images/evidence_waste_spillage_1789743181414.jpg',
          imageTag: t.category,
          ticketId: t.id,
          isOfficial: false,
          priority: 'High Priority',
          upvotes: 1,
          commentsCount: 0,
          comments: [],
          isUpvoted: true,
          citizenVerifications: 1,
          verifiedBy: 'AI & GPS Geo-Verified'
        }));

        return [...generatedPosts, ...prev];
      });
    }
  }, [userTickets]);

  
  // Feed filter tab (supports Their Feed / My Reports)
  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'nearby' | 'my_feed'>('for_you');

  // Field / Category filter tab
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('all');

  // Real-time Firestore tickets subscription so newly submitted reports auto-appear & sync resolutions
  useEffect(() => {
    const unsubscribe = subscribeToTickets((firestoreTickets) => {
      if (!firestoreTickets || firestoreTickets.length === 0) return;

      setPosts(prev => {
        let updated = [...prev];

        firestoreTickets.forEach(ft => {
          const existingIdx = updated.findIndex(p => p.ticketId === ft.ticketNum || p.id === `fs-${ft.id}`);
          
          if (existingIdx >= 0) {
            // Update resolution status if modified in Firestore
            if (ft.isResolved && !updated[existingIdx].isResolved) {
              updated[existingIdx] = {
                ...updated[existingIdx],
                isResolved: true,
                resolutionTime: ft.resolutionTime || 'Resolved in 1.5 Hours',
                resolvedByOfficer: ft.resolvedByOfficer || updated[existingIdx].resolvedByOfficer,
                officerDesignation: ft.officerDesignation || updated[existingIdx].officerDesignation,
                officerSquad: ft.officerSquad || updated[existingIdx].officerSquad,
                officerWard: ft.officerWard || updated[existingIdx].officerWard,
                assignedCrew: ft.officerSquad || updated[existingIdx].assignedCrew,
                resolutionRemarks: ft.resolutionRemarks || updated[existingIdx].resolutionRemarks,
                resolutionProofUrl: ft.resolutionProofUrl || ft.afterImageUrl || updated[existingIdx].resolutionProofUrl,
                afterImageUrl: ft.afterImageUrl || ft.resolutionProofUrl || updated[existingIdx].afterImageUrl,
                mediaType: 'comparison',
                resolvedTimestamp: ft.resolvedTimestamp || 'Just Now (Official AMC Stamp)'
              };
            }
          } else {
            // Prepend new post
            updated.unshift({
              id: `fs-${ft.id}`,
              authorName: ft.authorName || 'Verified Citizen',
              authorHandle: ft.isAnonymous ? '@anonymous' : `@${(ft.authorName || 'citizen').toLowerCase().replace(/\s+/g, '_')}`,
              authorWard: ft.ward,
              authorBadge: ft.isAnonymous ? 'Citizen Reporter' : 'Level 3 Guardian',
              avatarUrl: ft.isAnonymous 
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              timeAgo: 'Just now',
              privacy: ft.isAnonymous ? 'Anonymous Public Report' : 'Verified Public Report',
              content: `🚨 **Civic Issue Reported in ${ft.ward}**\n\n${ft.description}\n\n*Live Status*: Geo-routed to AMC Ward Desk & Field Squad for rapid SLA resolution.`,
              mediaType: ft.isResolved && ft.afterImageUrl ? 'comparison' : 'image',
              imageUrl: ft.photoUrls?.[0] || ft.imageUrl || '/src/assets/images/evidence_waste_spillage_1789743181414.jpg',
              beforeImageUrl: ft.photoUrls?.[0] || ft.imageUrl || '/src/assets/images/evidence_waste_spillage_1789743181414.jpg',
              afterImageUrl: ft.afterImageUrl || ft.resolutionProofUrl,
              imageTag: ft.category,
              ticketId: ft.ticketNum,
              isOfficial: false,
              priority: `${ft.priority} Priority`,
              upvotes: ft.upvotes || 1,
              commentsCount: 0,
              comments: [],
              isUpvoted: false,
              citizenVerifications: 1,
              verifiedBy: 'AI Vision & GPS Verified',
              fieldCategory: ft.fieldCategory || ft.category,
              civicScoreEarned: ft.civicScoreEarned || ft.civicScore || 35,
              landmark: ft.landmark || ft.location,
              gpsCoords: ft.gpsCoords,
              gpsPrecision: ft.gpsPrecision,
              voiceTranscript: ft.voiceTranscript,
              photoUrls: ft.photoUrls,
              isResolved: ft.isResolved || false,
              resolutionTime: ft.resolutionTime,
              resolvedByOfficer: ft.resolvedByOfficer,
              officerDesignation: ft.officerDesignation,
              officerSquad: ft.officerSquad,
              officerWard: ft.officerWard,
              assignedCrew: ft.officerSquad,
              resolutionRemarks: ft.resolutionRemarks,
              resolutionProofUrl: ft.resolutionProofUrl,
              resolvedTimestamp: ft.resolvedTimestamp
            });
          }
        });

        return updated;
      });
    });

    return () => unsubscribe();
  }, []);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // New post form state
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Joined communities state
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({});

  // Initial feed posts matching the exact screenshots provided
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      authorName: 'Priya Mehta',
      authorBadge: 'Eco Leader',
      authorWard: 'Vastrapur Ward',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      timeAgo: '25m ago',
      privacy: 'Public',
      content: 'Riverfront morning tree plantation drive with 40+ enthusiastic college students! 🌱 We planted native neem, gulmohar, and banyan saplings along the green corridor. Join our next drive on Saturday at 7:00 AM at Gandhi Ashram Promenade!',
      mediaType: 'image',
      imageUrl: '/src/assets/images/sabarmati_riverfront_drive_1789740233986.jpg',
      imageTag: 'Sabarmati Riverfront Phase II',
      upvotes: 142,
      commentsCount: 28,
      isUpvoted: false,
      isSaved: false,
      comments: [
        { id: 'c1', authorName: 'Dr. Alok Patel', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', content: 'Incredible work team! Will bring our society youth group this Saturday.', timeAgo: '18m ago' },
        { id: 'c2', authorName: 'Meera Shah', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', content: 'Are gloves and shovels provided at the site?', timeAgo: '10m ago' }
      ]
    },
    {
      id: 'post-2',
      authorName: 'Municipal Traffic Desk',
      authorWard: 'SG Highway Sector',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
      timeAgo: '1h ago',
      privacy: 'AMC Official',
      isOfficial: true,
      priority: 'High Priority',
      content: 'Flyover emergency joint repair underway near Pakwan Crossroad until 4:00 PM today. Heavy congestion expected on both northbound lanes. Citizens are strongly advised to divert via Drive-In Road or S.P. Ring Road.',
      mediaType: 'traffic_alert',
      upvotes: 310,
      commentsCount: 45,
      isUpvoted: false,
      verifiedBy: 'Verified by Ahmedabad Traffic Police',
      comments: [
        { id: 'c3', authorName: 'Harshil Trivedi', authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', content: 'Drive-In road route is clear right now. Thanks for the early heads up!', timeAgo: '40m ago' }
      ]
    },
    {
      id: 'post-3',
      authorName: 'Aniket Trivedi',
      authorHandle: '@aniket_t',
      authorWard: 'Navrangpura • Ward 14',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
      timeAgo: '3h ago',
      privacy: 'Public',
      isResolved: true,
      resolutionTime: 'Resolved in 48h',
      content: 'The deep pothole near Navrangpura 3rd Crossroad (outside Commerce College) got fully patched today after 42 community upvotes on NAGAR-X! Big thanks to Ward 14 AMC engineering squad for the quick turnaround 🙌. Civic participation works!',
      mediaType: 'comparison',
      beforeImageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
      afterImageUrl: '/src/assets/images/pothole_repaired_after_1789742513449.jpg',
      ticketId: 'AMC Ticket #AMD-W14-8892',
      upvotes: 186,
      commentsCount: 19,
      isUpvoted: false,
      citizenVerifications: 42
    }
  ]);

  // Open comments state
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Handle post submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorHandle: `@${currentUser.handle}`,
      authorWard: currentUser.ward,
      authorBadge: 'City Guardian',
      avatarUrl: currentUser.avatarUrl,
      timeAgo: 'Just now',
      privacy: 'Public',
      content: selectedTag ? `${selectedTag} ${newPostText}` : newPostText,
      upvotes: 1,
      commentsCount: 0,
      isUpvoted: true,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedTag(null);
    setCurrentUser(prev => ({
      ...prev,
      civicScore: prev.civicScore + 10,
      upvotesReceived: prev.upvotesReceived + 1
    }));
  };

  // Compute posts filtered by Feed Filter and Field Category
  const displayedPosts = posts.filter(post => {
    // 1. Field Category filter
    if (selectedFieldFilter !== 'all') {
      const targetField = selectedFieldFilter.toLowerCase();
      const matchesField = 
        post.fieldCategory?.toLowerCase().includes(targetField) ||
        post.imageTag?.toLowerCase().includes(targetField) ||
        post.content?.toLowerCase().includes(targetField);
      if (!matchesField) return false;
    }

    // 2. Feed tab filter
    if (feedFilter === 'my_feed') {
      const isMine = 
        post.authorHandle === `@${currentUser.handle}` ||
        post.authorName === currentUser.name ||
        post.authorName === 'Rahul Sharma' ||
        (post.authorName === 'Anonymous Citizen' && !!post.ticketId);
      return isMine;
    } else if (feedFilter === 'following') {
      return post.isOfficial || post.upvotes > 20;
    } else if (feedFilter === 'nearby') {
      return post.authorWard.toLowerCase().includes('navrangpura') || post.authorWard.toLowerCase().includes(currentUser.ward.toLowerCase());
    }

    return true;
  });

  // Toggle upvote on a post
  const toggleUpvote = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isUpvoted = !p.isUpvoted;
        return {
          ...p,
          isUpvoted,
          upvotes: isUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  };

  // Add comment to post
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newC: FeedComment = {
          id: `c-${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatarUrl,
          content: commentInput,
          timeAgo: 'Just now'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newC]
        };
      }
      return p;
    }));
    setCommentInput('');
  };

  // Toggle join community
  const toggleJoinCommunity = (id: string) => {
    setJoinedCommunities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* =========================================
          TOP FIXED HEADER NAVBAR
          ========================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-sm px-4 lg:px-6 py-2.5">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Ward Locator */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={onBackToHome || onLogout}
              className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
              title={t.backToHome}
            >
              <NagarXLogo size="sm" showTagline={true} />
            </button>

            {/* Back to Main Home Page Button */}
            <button 
              onClick={onBackToHome || onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs cursor-pointer"
              title={t.backToHome}
            >
              <Home className="w-4 h-4 text-blue-600" />
              <span>{t.backToHome}</span>
            </button>

            {/* City / Location Dropdown */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ahmedabad</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-slate-100/70 border border-slate-200/80 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-400"
              />
              <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Language Switcher Pills */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold">
              <button 
                onClick={() => onLanguageChange('en')} 
                className={`px-2 py-1 rounded-md text-[11px] transition-all ${language === 'en' ? 'bg-blue-600 text-white font-extrabold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN
              </button>
              <button 
                onClick={() => onLanguageChange('hi')} 
                className={`px-2 py-1 rounded-md text-[11px] transition-all ${language === 'hi' ? 'bg-blue-600 text-white font-extrabold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => onLanguageChange('gu')} 
                className={`px-2 py-1 rounded-md text-[11px] transition-all ${language === 'gu' ? 'bg-blue-600 text-white font-extrabold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Notifications & Chat */}
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>

            {/* Profile Avatar & Logout */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setActiveNav('profile')}
                title="View Profile Page"
                className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-none"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="hidden sm:inline-block text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  Profile
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Logout / Switch Account"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>


      {/* =========================================
          MAIN 3-COLUMN DASHBOARD GRID
          ========================================= */}
      <div className="max-w-[1500px] mx-auto w-full px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* =========================================
            LEFT COLUMN: SIDEBAR NAVIGATION & USER CARD
            ========================================= */}
        <aside className="lg:col-span-3 space-y-5 text-left sticky top-20">
          
          {/* Active Demo Role Switcher in Sidebar */}
          <DemoRoleSwitcher
            currentRole={currentUser.role}
            onSelectRole={handleSwitchDemoRole}
            variant="sidebar"
          />

          {/* Primary Report Button */}
          <button
            onClick={handleOpenReportForm}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-blue-500/15 flex items-center justify-center space-x-2.5 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>{t.reportIssueBtn}</span>
          </button>

          {/* Navigation Menu Links */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-6">
            
            {/* Community Feed Section */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 block mb-1">
                {t.communityFeed}
              </span>
              
              <button 
                onClick={() => setActiveNav('home')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
                  activeNav === 'home' 
                    ? 'bg-blue-50 text-blue-700 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4 text-blue-600" />
                <span>{t.homeFeed}</span>
              </button>

              <button 
                onClick={() => setActiveNav('explore')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'explore' 
                    ? 'bg-blue-50 text-blue-700 font-black' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Compass className={`w-4 h-4 ${activeNav === 'explore' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.explore}</span>
              </button>

              <button 
                onClick={() => setActiveNav('nearby')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'nearby' 
                    ? 'bg-blue-50 text-blue-700 font-black' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Navigation className={`w-4 h-4 ${activeNav === 'nearby' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.nearby}</span>
              </button>

              <button 
                onClick={() => setActiveNav('city_hub')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'city_hub' 
                    ? 'bg-blue-50 text-blue-700 font-black' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeNav === 'city_hub' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.cityServices}</span>
              </button>

              <button 
                onClick={() => setActiveNav('city_map')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'city_map' 
                    ? 'bg-blue-50 text-blue-700 font-black' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Map className={`w-4 h-4 ${activeNav === 'city_map' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.wardMap}</span>
              </button>
            </div>

            {/* Civic Action Section */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 block mb-1">
                Civic Action
              </span>

              <button 
                onClick={() => setActiveNav('my_reports')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'my_reports' 
                    ? 'bg-blue-50 text-blue-700 font-black' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ClipboardList className={`w-4 h-4 ${activeNav === 'my_reports' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.myReports}</span>
              </button>

              <button 
                onClick={() => setActiveNav('communities')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'communities'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className={`w-4 h-4 ${activeNav === 'communities' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.communities}</span>
              </button>

              <button 
                onClick={() => setActiveNav('events')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'events'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Calendar className={`w-4 h-4 ${activeNav === 'events' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{t.events}</span>
              </button>

              {/* Option 1: AMC Ward Officer Desk - ONLY for Authority or Admin users */}
              {canAccessWardDesk(currentUser.role) && (
                <button 
                  onClick={() => setActiveNav('authority_portal')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeNav === 'authority_portal' 
                      ? 'bg-blue-600 text-white shadow-md font-extrabold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${activeNav === 'authority_portal' ? 'text-white' : 'text-blue-600'}`} />
                  <span className="flex-1 text-left">{t.amcWardDesk}</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-100/90 text-blue-800">
                    Authority
                  </span>
                </button>
              )}

              {/* Option 2: Commissioner Audit Portal - ONLY for Admin users */}
              {canAccessCommissionerPortal(currentUser.role) && (
                <button 
                  onClick={() => setActiveNav('high_authority')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeNav === 'high_authority' 
                      ? 'bg-slate-900 text-white shadow-md font-extrabold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${activeNav === 'high_authority' ? 'text-blue-400' : 'text-purple-600'}`} />
                  <span className="flex-1 text-left">{t.highAuthority}</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                    All Access
                  </span>
                </button>
              )}
            </div>

            {/* Account Section */}
            <div className="space-y-1 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 block mb-1">
                Account
              </span>

              <button 
                onClick={() => setActiveNav('profile')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeNav === 'profile'
                    ? 'bg-blue-600 text-white shadow-md font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className={`w-4 h-4 ${activeNav === 'profile' ? 'text-white' : 'text-slate-400'}`} />
                <span>My Citizen Profile</span>
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

        </aside>


        {activeNav === 'report_form' ? (
          <div className="lg:col-span-9">
            <ReportIssuePage 
              language={language}
              onSubmitSuccess={handleReportCreated}
              onCancel={() => setActiveNav('home')}
            />
          </div>
        ) : activeNav === 'authority_portal' ? (
          <div className="lg:col-span-9">
            {canAccessWardDesk(currentUser.role) ? (
              <AuthorityPortal
                language={language}
                posts={posts}
                onResolveTicket={handleResolveTicketFromPortal}
                onBackToFeed={() => setActiveNav('home')}
              />
            ) : (
              <RestrictedAccessView
                requiredRole="authority"
                currentRole={currentUser.role}
                portalName="AMC Ward Officer Desk"
                onSwitchRole={handleSwitchDemoRole}
                onBackToFeed={() => setActiveNav('home')}
              />
            )}
          </div>
        ) : activeNav === 'high_authority' ? (
          <div className="lg:col-span-9">
            {canAccessCommissionerPortal(currentUser.role) ? (
              <HighAuthorityDashboard
                language={language}
                posts={posts}
                onBackToFeed={() => setActiveNav('home')}
                onOpenReportModal={() => onOpenModal('report')}
              />
            ) : (
              <RestrictedAccessView
                requiredRole="admin"
                currentRole={currentUser.role}
                portalName="Commissioner Audit Portal"
                onSwitchRole={handleSwitchDemoRole}
                onBackToFeed={() => setActiveNav('home')}
              />
            )}
          </div>
        ) : activeNav === 'city_map' ? (
          <div className="lg:col-span-9">
            <CityMapPage
              language={language}
              posts={posts}
              onOpenReportModal={() => onOpenModal('report')}
            />
          </div>
        ) : activeNav === 'explore' ? (
          <div className="lg:col-span-9">
            <ExplorePage
              language={language}
              posts={posts}
              onOpenReportModal={() => onOpenModal('report')}
            />
          </div>
        ) : activeNav === 'nearby' ? (
          <div className="lg:col-span-9">
            <NearbyPage
              language={language}
              posts={posts}
              onOpenReportModal={() => onOpenModal('report')}
            />
          </div>
        ) : activeNav === 'my_reports' ? (
          <div className="lg:col-span-9">
            <MyReportsPage
              language={language}
              posts={posts}
              userTickets={userTickets}
              currentUser={currentUser}
              onOpenReportModal={() => onOpenModal('report')}
              onViewMap={() => setActiveNav('city_map')}
              onViewAuditPost={(post) => {
                setSelectedAuditPost(post);
                setActiveNav('home');
              }}
            />
          </div>
        ) : activeNav === 'communities' ? (
          <div className="lg:col-span-9">
            <CommunitiesPage
              language={language}
              currentUser={currentUser}
              onOpenReportModal={() => onOpenModal('report')}
              onNavigateToEvents={() => setActiveNav('events')}
            />
          </div>
        ) : activeNav === 'events' ? (
          <div className="lg:col-span-9">
            <EventsPage
              language={language}
              currentUser={currentUser}
              onOpenReportModal={() => onOpenModal('report')}
            />
          </div>
        ) : activeNav === 'profile' ? (
          <div className="lg:col-span-9">
            <UserProfilePage
              language={language}
              onLogout={onLogout}
              onOpenReportModal={() => onOpenModal('report')}
              onNavigateToMyReports={() => setActiveNav('my_reports')}
              currentUser={currentUser}
              onSwitchDemoRole={handleSwitchDemoRole}
            />
          </div>
        ) : activeNav === 'city_hub' ? (
          <div className="lg:col-span-9">
            <CityHubPage
              language={language}
              posts={posts}
              onOpenReportModal={() => onOpenModal('report')}
            />
          </div>
        ) : (
          <>
            {/* =========================================
                CENTER COLUMN: USER STATS & FEED POSTS
                ========================================= */}
            <main className="lg:col-span-6 space-y-5 text-left">
          
          {/* Top User Profile Summary Card & Ward Desk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0 flex items-center justify-center text-[8px] text-white font-bold">✓</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-black text-slate-900 text-base leading-tight truncate">{currentUser.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">@{currentUser.handle}</span>
                  <span className="text-[11px] font-bold text-blue-600 mt-0.5">{currentUser.ward}</span>
                </div>
              </div>

              {/* Civic Score Progress */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>{t.civicScore}</span>
                  </span>
                  <span className="text-base font-black text-slate-900">{currentUser.civicScore} <span className="text-xs font-bold text-slate-400">pts</span></span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span className="text-blue-700 font-extrabold">{currentUser.level}</span>
                  <span>{currentUser.ptsToNextLevel} pts to Lv 4</span>
                </div>
              </div>

              {/* User Stats 3-Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-base font-black text-slate-900">{currentUser.reportedCount}</span>
                  <span className="text-[10px] font-bold text-slate-400">{t.reported}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-emerald-600">{currentUser.resolvedCount}</span>
                  <span className="text-[10px] font-bold text-slate-400">{t.resolved}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-blue-600">{currentUser.upvotesReceived}</span>
                  <span className="text-[10px] font-bold text-slate-400">{t.upvotes}</span>
                </div>
              </div>
            </div>

            {/* Ward Desk Live Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center space-x-1.5">
                    <span>Navrangpura Ward Desk</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </h4>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Councillor Office: Open till 6:00 PM • AMC Zone: West Zone Ahmedabad
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-extrabold text-slate-800 block">Ward Hearing: Water Supply</span>
                      <span className="text-[10px] font-bold text-slate-400">Thu, 4 PM</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">AMC Sanitation Schedule</span>
                      <span className="text-[10px] font-bold text-blue-700">Daily 7 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>


          {/* Feed Filter Navigation Tabs & Their Feed */}
          <div className="space-y-3 border-b border-slate-200/80 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFeedFilter('for_you')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  feedFilter === 'for_you' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {t.forYou}
              </button>

              <button
                onClick={() => setFeedFilter('following')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  feedFilter === 'following' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {t.following}
              </button>

              <button
                onClick={() => setFeedFilter('nearby')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  feedFilter === 'nearby' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.nearbyWards}</span>
              </button>

              {/* Their Feed / My Reports Filter Tab */}
              <button
                onClick={() => setFeedFilter('my_feed')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  feedFilter === 'my_feed' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Their Feed (My Reports)</span>
              </button>
            </div>

            {/* Field / Category Filter Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
              <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 shrink-0 pr-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter by Field:</span>
              </div>
              {[
                { id: 'all', label: 'All Fields' },
                { id: 'Garbage & Waste', label: 'Garbage & Waste' },
                { id: 'Streetlights & Grid', label: 'Streetlights & Grid' },
                { id: 'Roads & Potholes', label: 'Roads & Potholes' },
                { id: 'Water & Drainage', label: 'Water & Drainage' },
                { id: 'Traffic & Signals', label: 'Traffic & Signals' },
                { id: 'Safety & Hazards', label: 'Safety & Hazards' },
              ].map(field => {
                const isSelected = selectedFieldFilter === field.id;
                return (
                  <button
                    key={field.id}
                    onClick={() => setSelectedFieldFilter(field.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-black'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {field.label}
                  </button>
                );
              })}
            </div>
          </div>


          {/* Create Post Input Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex items-start space-x-3">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1">
                <textarea
                  rows={2}
                  placeholder={t.postPlaceholder}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="w-full resize-none border-none focus:outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 p-1"
                />

                {/* Hashtag Quick Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {['#Traffic Update', '#Community Alert', '#Civic Question'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Composer Action Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-3 text-slate-500 text-xs font-bold">
                <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span>Photo</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                  <Video className="w-4 h-4 text-slate-400" />
                  <span>Video</span>
                </button>
                <button 
                  onClick={handleOpenReportForm}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Report Issue</span>
                </button>
                <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Navrangpura</span>
                </span>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-sm disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>


          {/* Feed Posts List */}
          <div className="space-y-4">
            {displayedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">No reports found for this filter</h4>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  Try switching back to "All Fields" or file a new issue report to see it appear here immediately.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedFieldFilter('all');
                      setFeedFilter('for_you');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              displayedPosts.map((post) => (
              <article 
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 text-left transition-all hover:border-slate-300/80"
              >
                
                {/* Author Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.avatarUrl} 
                      alt={post.authorName} 
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-slate-900 text-sm">{post.authorName}</span>
                        
                        {post.authorBadge && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100">
                            {post.authorBadge}
                          </span>
                        )}

                        {post.isOfficial && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            <span>AMC Official</span>
                          </span>
                        )}

                        {post.priority && (
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                            post.priority.toLowerCase().includes('high')
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : post.priority.toLowerCase().includes('medium')
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {post.priority}
                          </span>
                        )}

                        {post.fieldCategory && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200">
                            {post.fieldCategory}
                          </span>
                        )}

                        {post.civicScoreEarned && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-black rounded-full border border-amber-200 flex items-center space-x-1">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>+{post.civicScoreEarned} pts</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 mt-0.5">
                        <span>{post.authorWard}</span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 text-slate-500">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{post.privacy}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {post.isResolved && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-200/60 flex items-center space-x-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>{post.resolutionTime || 'Resolved'}</span>
                    </span>
                  )}
                </div>

                {/* Post Content Text */}
                <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Voice Note Verbatim Transcript Box if recorded */}
                {post.voiceTranscript && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start space-x-2 text-xs text-blue-950">
                    <Volume2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[11px] text-blue-800 block">Voice Note Verbatim Transcript:</span>
                      <p className="italic text-slate-700 font-medium">"{post.voiceTranscript}"</p>
                    </div>
                  </div>
                )}

                {/* Official Ward Resolution Proof Banner (If Resolved by Authority) */}
                {post.isResolved && (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block">
                            Official Resolution • {post.officerWard || 'AMC Ward #12 Engineering Cell'}
                          </span>
                          {post.assignedCrew && (
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              Assigned: {post.assignedCrew}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {post.resolvedTimestamp || 'Verified Work Proof'}
                      </span>
                    </div>

                    {post.resolutionRemarks && (
                      <div className="p-3 bg-white/90 rounded-xl border border-emerald-100 text-xs text-slate-800 font-medium leading-relaxed">
                        <div className="flex items-center justify-between font-extrabold text-slate-900 mb-1">
                          <span>
                            Officer Note: {post.resolvedByOfficer || 'Er. Rajesh Patel'}
                            {post.officerDesignation && (
                              <span className="text-[10px] text-slate-500 font-bold ml-1.5 font-normal">
                                ({post.officerDesignation})
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">"{post.resolutionRemarks}"</p>
                      </div>
                    )}

                    {/* Proof Photo if provided and not already shown in comparison */}
                    {post.resolutionProofUrl && post.mediaType !== 'comparison' && (
                      <div className="rounded-xl overflow-hidden h-48 border border-emerald-200 relative">
                        <img src={post.resolutionProofUrl} alt="Work Completed Proof" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow">
                          ✓ Completed Work Evidence Photo
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {post.mediaType === 'image' && post.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img 
                      src={post.imageUrl} 
                      alt="Post visual" 
                      className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform duration-500"
                    />
                    {post.imageTag && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center space-x-1.5 shadow">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{post.imageTag}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Traffic Alert Card Visual */}
                {post.mediaType === 'traffic_alert' && (
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 inline-flex items-center space-x-3 shadow-2xs">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                      <div className="text-left">
                        <span className="font-black text-slate-900 text-xs block">Pakwan Crossroad Flyover Diversion</span>
                        <span className="text-[10px] font-bold text-slate-500">Estimated delay: 18 mins • Tap for live detour</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Comparison (Before / Repaired) */}
                {post.mediaType === 'comparison' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44">
                        <img 
                          src={post.beforeImageUrl} 
                          alt="Before repair" 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-md">
                          Before (Nov 14)
                        </span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44">
                        <img 
                          src={post.afterImageUrl} 
                          alt="Repaired today" 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow">
                          Repaired (Today)
                        </span>
                      </div>
                    </div>

                {/* Legal Ticket Audit Banner Bar */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-blue-700 font-black">{post.ticketId || `#NX-${10000 + (parseInt(post.id.replace(/\D/g, '')) || 482)}`}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-extrabold hidden sm:inline-block">
                      Master Incident Registered
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedAuditPost(post)}
                    className="text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                  >
                    <span>View Legal & Municipal Audit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                  </div>
                )}

                {/* Post Footer Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleUpvote(post.id)}
                      className={`flex items-center space-x-1.5 transition-colors ${
                        post.isUpvoted ? 'text-blue-600 font-black' : 'hover:text-slate-800'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.isUpvoted ? 'fill-blue-600' : ''}`} />
                      <span>{post.upvotes}</span>
                    </button>

                    <button
                      onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1.5 hover:text-slate-800 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    <button 
                      onClick={() => onOpenModal('share')}
                      className="flex items-center space-x-1.5 hover:text-slate-800 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {post.verifiedBy ? (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{post.verifiedBy}</span>
                    </span>
                  ) : post.citizenVerifications ? (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{post.citizenVerifications} Citizen Verifications</span>
                    </span>
                  ) : (
                    <button className="text-slate-400 hover:text-slate-700">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Expanded Comments Form */}
                {openCommentPostId === post.id && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="space-y-2">
                      {post.comments?.map((c) => (
                        <div key={c.id} className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-800">{c.authorName}</span>
                            <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                          </div>
                          <p className="text-slate-600 font-medium">{c.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Write a citizen comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

              </article>
            ))
          )}
          </div>

        </main>


        {/* =========================================
            RIGHT COLUMN: AHMEDABAD PULSE & TRENDING
            ========================================= */}
        <aside className="lg:col-span-3 space-y-5 text-left sticky top-20">
          
          {/* Ahmedabad Pulse Live Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="font-black text-slate-900 text-sm">Ahmedabad Pulse</h3>
              </div>
              <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Live</span>
              </span>
            </div>

            <div className="space-y-2.5">
              
              {/* AQI Indicator */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Wind className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">Air Quality (AQI)</span>
                    <span className="text-[10px] font-semibold text-emerald-600">Moderate / Satisfactory</span>
                  </div>
                </div>
                <span className="text-xl font-black text-slate-900">72</span>
              </div>

              {/* Weather Indicator */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">Weather</span>
                    <span className="text-[10px] font-semibold text-slate-500">Sunny & Warm</span>
                  </div>
                </div>
                <span className="text-xl font-black text-slate-900">31°C</span>
              </div>

              {/* Active Drives */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <HeartHandshake className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 leading-tight">Active Drives</span>
                    <span className="text-[10px] font-semibold text-blue-700">Navrangpura & Riverfront</span>
                  </div>
                </div>
                <span className="text-xl font-black text-blue-600">4</span>
              </div>

            </div>
          </div>


          {/* Trending Near You Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">Trending Near You</h3>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-3">
              {[
                { tag: '#RiverfrontClean', posts: '1.4k posts', desc: 'Community Saturday...' },
                { tag: '#NavrangpuraCivic', posts: '892 posts', desc: 'Ward 14 road repairs &...' },
                { tag: '#SGHwyFlyover', posts: '645 posts', desc: 'Traffic re-routing and...' },
                { tag: '#WeekendHeritageWalk', posts: '420 posts', desc: 'Old City pol architectu...' }
              ].map((item) => (
                <div key={item.tag} className="flex justify-between items-start group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.desc}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.posts}
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* Local Communities Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">Local Communities</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Explore</button>
            </div>

            <div className="space-y-3">
              {[
                { id: 'c1', name: 'Ahmedabad Cycling Club', citizens: '2.8k citizens', icon: '🚲' },
                { id: 'c2', name: 'Sabarmati Green Guild', citizens: '1.2k citizens', icon: '🏛️' },
                { id: 'c3', name: 'Clean Vastrapur Alliance', citizens: '950 citizens', icon: '🌱' }
              ].map((comm) => (
                <div key={comm.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm shadow-2xs">
                      {comm.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 truncate max-w-[120px]">{comm.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{comm.citizens}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleJoinCommunity(comm.id)}
                    className={`px-3 py-1 text-xs font-extrabold rounded-xl border transition-all ${
                      joinedCommunities[comm.id]
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {joinedCommunities[comm.id] ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 leading-relaxed px-2">
            NAGAR-X Ahmedabad Civic Mesh • In partnership with AMC Public Data Protocol.
          </div>

        </aside>
        </>
        )}

      </div>


      {/* =========================================
          FLOATING ACTION BUTTON (BOTTOM RIGHT)
          ========================================= */}
      <button
        onClick={handleOpenReportForm}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-full shadow-xl shadow-blue-500/25 flex items-center space-x-2 active:scale-95 transition-all"
      >
        <Radio className="w-4 h-4 animate-pulse" />
        <span>Report Civic Issue</span>
      </button>

      {/* =========================================
          LEGAL & MUNICIPAL AUDIT DATA MODAL
          ========================================= */}
      <LegalAuditModal 
        isOpen={!!selectedAuditPost}
        onClose={() => setSelectedAuditPost(null)}
        post={selectedAuditPost}
        language={language}
      />

    </div>
  );
}
