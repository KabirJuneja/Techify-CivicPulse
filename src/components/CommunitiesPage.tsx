import React, { useState, useMemo } from 'react';
import { 
  Users, ShieldCheck, Lock, Plus, Search, 
  MessageSquare, ChevronRight, CheckCircle2, UserCheck, 
  Building2, MapPin, Calendar, Clock, Phone, Mail, Award, X, 
  ExternalLink, FileText, Send, Sparkles, AlertCircle, ArrowRight,
  ShieldAlert, Check, HelpCircle, ThumbsUp, Share2, Copy,
  CheckCheck, Vote, Download, Eye, AlertTriangle, Filter,
  Megaphone, Heart, RefreshCw, Layers
} from 'lucide-react';
import { Language, UserProfile } from '../types';

// Images
import sabarmatiImg from '../assets/images/sabarmati_riverfront_drive_1789740233986.jpg';
import potholeImg from '../assets/images/pothole_repaired_after_1789742513449.jpg';
import wasteAfterImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import avatarImg from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';
import ahmedabadHeroImg from '../assets/images/ahmedabad_hero_real_1789766454218.jpg';

interface CommunitiesPageProps {
  language: Language;
  currentUser?: UserProfile;
  onOpenReportModal?: () => void;
  onNavigateToEvents?: () => void;
}

export interface ForumMessage {
  id: string;
  author: string;
  role: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  isOfficial?: boolean;
  badge?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  department: string;
  summary: string;
  fileSize?: string;
}

export interface CommunityPoll {
  id: string;
  question: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    votes: number;
    userVoted?: boolean;
  }[];
  expiresIn: string;
  isClosed?: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  ward: string;
  verified: boolean;
  avatarInitials: string;
  color: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  badge: string;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  zone: string;
  adminName: string;
  membersCount: number;
  privacy: string;
  description: string;
  coverImage: string;
  activeTopic?: {
    title: string;
    timeAgo: string;
    responsesCount: number;
    officialStatus: string;
  };
  eventNotice?: string;
  charterNo?: string;
  isMember: boolean;
  requiresVerification?: boolean;
  verificationNote?: string;
  category: 'ward14' | 'ward8' | 'rwa' | 'environment';
  forumThreads?: ForumMessage[];
  notices?: NoticeItem[];
  polls?: CommunityPoll[];
  committee?: CommunityMember[];
}

// Initial seed communities with rich discussions, notices, polls & committee data
const INITIAL_COMMUNITIES: CommunityGroup[] = [
  {
    id: 'comm-1',
    name: 'Navrangpura Ward 14 Civic Action Council',
    badge: 'Ward Council Certified',
    badgeColor: 'blue',
    zone: 'AMC WEST ZONE • SECTOR 14',
    adminName: 'Er. Sanjay Patel (AMC Ward 14 Exec Engineer) & RWA Federation',
    membersCount: 1840,
    privacy: 'Private / Ward-Verified Only',
    description: 'Official municipal governance channel for road repair scheduling, stormwater drainage upgrades, water pressure optimization, and bi-weekly open ward corporator sessions for Navrangpura Central and Gujarat University Precinct.',
    coverImage: potholeImg,
    activeTopic: {
      title: 'Paving stone replacement schedule for Commerce Six Road',
      timeAgo: '12m ago',
      responsesCount: 28,
      officialStatus: 'AMC Assistant Engineer on thread'
    },
    isMember: true,
    category: 'ward14',
    forumThreads: [
      {
        id: 'msg-1',
        author: 'Er. Sanjay Patel',
        role: 'AMC Ward 14 Executive Engineer',
        text: 'Good morning residents. The paving stone repair work on Commerce Six Road starts tomorrow 8:00 AM. Traffic is safely diverted to lane 2. Heavy vehicles restricted during school rush.',
        time: '12m ago',
        likes: 42,
        isLiked: false,
        isOfficial: true,
        badge: 'Official Directive'
      },
      {
        id: 'msg-2',
        author: 'Rahul Sharma',
        role: 'Ward 14 Resident (Level 3 Guardian)',
        text: 'Thank you Er. Patel! Will the underground potable water pipe flange upgrade be synchronized before asphalt paving so we avoid re-excavation?',
        time: '8m ago',
        likes: 19,
        isLiked: true
      },
      {
        id: 'msg-3',
        author: 'JE Officer Dave',
        role: 'AMC Water Works Dept',
        text: '@Rahul Sharma Yes, the pressure testing of the 150mm main line was completed yesterday at 4.2 bar. Zero leakage detected. Paving team has green clearance.',
        time: 'Just now',
        likes: 14,
        isLiked: false,
        isOfficial: true,
        badge: 'Dept Verification'
      }
    ],
    notices: [
      {
        id: 'not-1',
        title: 'Monsoon De-siltation & Catch-basin Cleaning Schedule',
        date: 'Oct 20, 2026',
        department: 'AMC Drainage Cell (West Zone)',
        summary: 'Zonal suction trucks will operate across CG Road, Swastik Crossroad, and HL College precinct between 10:00 PM and 04:00 AM.',
        fileSize: '1.4 MB PDF'
      },
      {
        id: 'not-2',
        title: 'Corporator Monthly Public Sabha Announcement',
        date: 'Oct 25, 2026 (Saturday 10:00 AM)',
        department: 'Ward 14 Secretariat',
        summary: 'Open citizen hearing on street lighting, pedestrian crosswalk zebra markings, and parking zoning.',
        fileSize: '820 KB PDF'
      }
    ],
    polls: [
      {
        id: 'poll-1',
        question: 'Should speed humps and illuminated rumble strips be installed at HL Commerce College crossroad?',
        totalVotes: 348,
        expiresIn: '2 days left',
        options: [
          { id: 'opt-1', text: 'Yes, urgent safety need for college students', votes: 284, userVoted: true },
          { id: 'opt-2', text: 'No, install automated traffic blinkers instead', votes: 52 },
          { id: 'opt-3', text: 'Neutral / Need site survey first', votes: 12 }
        ]
      }
    ],
    committee: [
      { id: 'mem-1', name: 'Er. Sanjay Patel', role: 'Executive Engineer (Civil)', ward: 'Ward 14', verified: true, avatarInitials: 'SP', color: 'bg-blue-600' },
      { id: 'mem-2', name: 'Bhavik Shah', role: 'RWA Federation President', ward: 'Ward 14', verified: true, avatarInitials: 'BS', color: 'bg-indigo-600' },
      { id: 'mem-3', name: 'Ananya Mehta', role: 'Ward Cleanliness Coordinator', ward: 'Ward 14', verified: true, avatarInitials: 'AM', color: 'bg-emerald-600' },
      { id: 'mem-4', name: 'Rahul Sharma', role: 'Verified Citizen Guardian', ward: 'Ward 14', verified: true, avatarInitials: 'RS', color: 'bg-amber-600' }
    ]
  },
  {
    id: 'comm-2',
    name: 'Bodakdev & Judges Bungalow RWA Alliance',
    badge: 'Federated RWA Body',
    badgeColor: 'blue',
    zone: 'AMC NORTH WEST ZONE • WARD #8',
    adminName: 'Bodakdev Registered Residents Collective',
    membersCount: 920,
    privacy: 'Resident Proof Required',
    description: 'Hyper-local neighborhood coordination for residential waste composting, seasonal tree plantation, private night security patrol coordination, and street canine vaccination tracking across 22 participating housing societies.',
    coverImage: wasteAfterImg,
    activeTopic: {
      title: 'Door-to-door green compost bin collection timing changes starting next week',
      timeAgo: '2h ago',
      responsesCount: 19,
      officialStatus: 'Confirmed with Solid Waste Management Deputy Inspector'
    },
    charterNo: '#AHM-2021-994',
    isMember: true,
    category: 'ward8',
    forumThreads: [
      {
        id: 'msg-201',
        author: 'Kiran Desai',
        role: 'Judges Bungalow RWA Secretary',
        text: 'Residents note: Wet waste hydraulic tippers will now arrive between 07:30 AM and 08:30 AM daily to avoid morning school bus congestion.',
        time: '2h ago',
        likes: 24,
        isLiked: false,
        isOfficial: true,
        badge: 'RWA Notice'
      },
      {
        id: 'msg-202',
        author: 'Dr. Sunita Parikh',
        role: 'Bodakdev Sector 3 Resident',
        text: 'The segregated dry bin pilot in our apartment complex reached 92% compliance this week! Thank you to the volunteers.',
        time: '45m ago',
        likes: 31,
        isLiked: true
      }
    ],
    notices: [
      {
        id: 'not-201',
        title: 'Free Anti-Rabies Canine Vaccination Camp',
        date: 'Oct 28, 2026',
        department: 'AMC Cattle Nuisance & Health Cell',
        summary: 'Mobile veterinary clinic will cover all 22 society lanes starting 09:00 AM from Judges Bungalow circle.',
        fileSize: '540 KB PDF'
      }
    ],
    polls: [
      {
        id: 'poll-201',
        question: 'Adopt shared solar LED bollard lighting along internal society service lanes?',
        totalVotes: 182,
        expiresIn: '5 days left',
        options: [
          { id: 'opt-201', text: 'Approve 50% AMC subsidized scheme', votes: 154, userVoted: false },
          { id: 'opt-202', text: 'Maintain existing grid lighting', votes: 28 }
        ]
      }
    ],
    committee: [
      { id: 'mem-201', name: 'Kiran Desai', role: 'RWA Secretary', ward: 'Ward 8', verified: true, avatarInitials: 'KD', color: 'bg-sky-600' },
      { id: 'mem-202', name: 'Dr. Sunita Parikh', role: 'Environment Lead', ward: 'Ward 8', verified: true, avatarInitials: 'SP', color: 'bg-teal-600' }
    ]
  },
  {
    id: 'comm-3',
    name: 'Sabarmati Riverfront Green Guardians',
    badge: 'Civic Environment Taskforce',
    badgeColor: 'emerald',
    zone: 'CITY-WIDE INITIATIVE • AMC CENTRAL',
    adminName: 'AMC Parks & Gardens Wing & Volunteers Council',
    membersCount: 2420,
    privacy: 'Open to All Amdavadis',
    description: 'Municipal-citizen collaborative forum coordinating weekend cleanliness drives along riverfront promenades, tracking sapling hydration, bicycle path surface repairs, and organizing plastic-free civic drives every Sunday.',
    coverImage: sabarmatiImg,
    eventNotice: 'This Sunday 06:30 AM at Subhash Bridge Ghat',
    isMember: true,
    category: 'environment',
    forumThreads: [
      {
        id: 'msg-301',
        author: 'Prof. Jayant Joshi',
        role: 'Sabarmati Eco Action Lead',
        text: 'Over 250 volunteers registered for this Sunday cleanup drive! Gloves, biodegradable trash bags, and safety vests provided at Ghat #4 registration desk.',
        time: '3h ago',
        likes: 67,
        isLiked: true,
        isOfficial: true,
        badge: 'Drive Organizer'
      }
    ],
    notices: [
      {
        id: 'not-301',
        title: 'Riverfront Biodiversity & Native Flora Census 2026',
        date: 'Oct 15, 2026',
        department: 'Sabarmati Riverfront Development Corp (SRFDCL)',
        summary: 'Summary report on 12,000 newly planted Neem and Gulmohar saplings with geo-tagged drip irrigation.',
        fileSize: '3.1 MB PDF'
      }
    ],
    polls: [
      {
        id: 'poll-301',
        question: 'Next monthly cleanliness drive location preference:',
        totalVotes: 490,
        expiresIn: 'Tomorrow',
        options: [
          { id: 'opt-301', text: 'Subhash Bridge to Gandhi Ashram Walkway', votes: 290, userVoted: true },
          { id: 'opt-302', text: 'Atal Bridge to Flower Park Waterfront', votes: 160 },
          { id: 'opt-303', text: 'Ellisbridge Promenade Heritage Stretch', votes: 40 }
        ]
      }
    ],
    committee: [
      { id: 'mem-301', name: 'Prof. Jayant Joshi', role: 'Lead Naturalist', ward: 'Central Zone', verified: true, avatarInitials: 'JJ', color: 'bg-emerald-600' },
      { id: 'mem-302', name: 'Aakash Solanki', role: 'Logistics Coordinator', ward: 'Sabarmati Ward', verified: true, avatarInitials: 'AS', color: 'bg-green-700' }
    ]
  },
  {
    id: 'comm-4',
    name: 'Vastrapur Lake Senior Citizen Morning Walkers',
    badge: 'Restricted Verification',
    badgeColor: 'rose',
    zone: 'VASTRAPUR WARD #15',
    adminName: 'Vastrapur Ward Safety Inspector & Senior Council',
    membersCount: 340,
    privacy: 'Age & Resident Verified',
    description: 'Dedicated accessibility group for lakeside pedestrian track safety, illumination requests, rapid emergency medical responder network, and bench maintenance advocacy with AMC West Zone maintenance engineers.',
    coverImage: ahmedabadHeroImg,
    requiresVerification: true,
    verificationNote: 'Requires Aadhaar / Senior Citizen ID or Vastrapur residential proof verification by Ward Officer',
    isMember: false,
    category: 'rwa',
    forumThreads: [
      {
        id: 'msg-401',
        author: 'Ramanlal Trivedi',
        role: 'Vastrapur Walkers Club Convener',
        text: 'New rubberized non-slip walking matting has been installed on Sector B lakeside curve. Wheelchair ramp gradient verified.',
        time: '1d ago',
        likes: 18,
        isLiked: false,
        isOfficial: true
      }
    ],
    notices: [
      {
        id: 'not-401',
        title: 'Lakeside High-Mast Lighting Audit & First-Aid Box Refill',
        date: 'Oct 12, 2026',
        department: 'West Zone Health Dept',
        summary: 'Emergency AED defibrillator and automated calling button operational at Gate 2 security cabin.',
        fileSize: '410 KB PDF'
      }
    ],
    polls: [
      {
        id: 'poll-401',
        question: 'Proposed morning jogging track quiet hours (05:30 AM - 08:30 AM):',
        totalVotes: 98,
        expiresIn: '4 days left',
        options: [
          { id: 'opt-401', text: 'Support quiet zone regulation', votes: 88, userVoted: false },
          { id: 'opt-402', text: 'Allow portable speaker audio', votes: 10 }
        ]
      }
    ],
    committee: [
      { id: 'mem-401', name: 'Ramanlal Trivedi', role: 'Convener', ward: 'Ward 15', verified: true, avatarInitials: 'RT', color: 'bg-rose-600' }
    ]
  }
];

export const CommunitiesPage: React.FC<CommunitiesPageProps> = ({
  language,
  currentUser = {
    name: 'Rahul Sharma',
    handle: 'rahul_ahd',
    ward: 'Ward 14 • Navrangpura',
    civicScore: 480,
    level: 'Level 3 City Guardian',
    avatarUrl: avatarImg
  },
  onOpenReportModal,
  onNavigateToEvents
}) => {
  // Role demo mode state: 'citizen' | 'rwa_chairperson' | 'amc_admin'
  const [userRole, setUserRole] = useState<'citizen' | 'rwa_chairperson' | 'amc_admin'>('citizen');
  
  // Category & Filter state
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'ward14' | 'ward8' | 'rwa' | 'environment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'activity' | 'members' | 'ward' | 'name'>('activity');

  // Communities State
  const [communities, setCommunities] = useState<CommunityGroup[]>(INITIAL_COMMUNITIES);

  // Modals & Popups
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRwaAppModal, setShowRwaAppModal] = useState(false);
  const [selectedForumCommunity, setSelectedForumCommunity] = useState<CommunityGroup | null>(null);
  const [forumTab, setForumTab] = useState<'discussions' | 'notices' | 'polls' | 'members'>('discussions');
  const [showJoinVerifyModal, setShowJoinVerifyModal] = useState<CommunityGroup | null>(null);
  const [showOmbudsmanModal, setShowOmbudsmanModal] = useState(false);
  const [showBylawsModal, setShowBylawsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState<CommunityGroup | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; icon: 'check' | 'copy' | 'shield' } | null>(null);

  // Verification Form State
  const [verifyIdNumber, setVerifyIdNumber] = useState('');
  const [verifyAddress, setVerifyAddress] = useState('');
  const [verifyConsent, setVerifyConsent] = useState(true);

  // New Forum Message state
  const [newForumInput, setNewForumInput] = useState('');
  const [isOfficialNoticePost, setIsOfficialNoticePost] = useState(false);

  // Create Community Form State
  const [newCommTitle, setNewCommTitle] = useState('');
  const [newCommWard, setNewCommWard] = useState('Navrangpura Ward #14');
  const [newCommCategory, setNewCommCategory] = useState<'ward14' | 'ward8' | 'rwa' | 'environment'>('ward14');
  const [newCommPrivacy, setNewCommPrivacy] = useState('Private / Ward-Verified Only');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommAdminName, setNewCommAdminName] = useState('');
  const [newCommInitialTopic, setNewCommInitialTopic] = useState('');
  const [newCommCoverImage, setNewCommCoverImage] = useState(potholeImg);

  // RWA Application Form State
  const [rwaName, setRwaName] = useState('');
  const [rwaRegNo, setRwaRegNo] = useState('');
  const [rwaWardNo, setRwaWardNo] = useState('14');
  const [rwaChairperson, setRwaChairperson] = useState('');
  const [rwaContactPhone, setRwaContactPhone] = useState('');
  const [rwaEmail, setRwaEmail] = useState('');
  const [rwaSocietiesCount, setRwaSocietiesCount] = useState('12');

  // Ombudsman Booking Form State
  const [ombudsmanDate, setOmbudsmanDate] = useState('Tuesday, Sep 23, 2026 (11:00 AM)');
  const [ombudsmanTicketRef, setOmbudsmanTicketRef] = useState('Ticket #NX-10482 (Road Pothole SLA Breach)');
  const [ombudsmanNotes, setOmbudsmanNotes] = useState('Escalating asphalt caving delay on HL College road beyond the 48-hour SLA.');

  // Helper toast trigger
  const showToast = (title: string, subtitle?: string, icon: 'check' | 'copy' | 'shield' = 'check') => {
    setToastMessage({ title, subtitle, icon });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Toggle Subscribe / Membership
  const handleToggleJoin = (id: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === id) {
        const updatedIsMember = !c.isMember;
        showToast(
          updatedIsMember ? `Joined ${c.name}!` : `Left ${c.name}`,
          updatedIsMember 
            ? `You will now receive official ward alerts and can participate in voting and threads.` 
            : `You have unsubscribed from forum notifications.`,
          'check'
        );
        return { 
          ...c, 
          isMember: updatedIsMember,
          membersCount: updatedIsMember ? c.membersCount + 1 : Math.max(1, c.membersCount - 1)
        };
      }
      return c;
    }));
  };

  // Submit Restricted Verification
  const handleCompleteVerification = () => {
    if (!showJoinVerifyModal) return;
    const targetCommId = showJoinVerifyModal.id;

    setCommunities(prev => prev.map(c => {
      if (c.id === targetCommId) {
        return {
          ...c,
          isMember: true,
          requiresVerification: false,
          membersCount: c.membersCount + 1
        };
      }
      return c;
    }));

    showToast(
      'Verification Approved & Access Granted!',
      `Your Aadhaar / Resident credential was instantly validated by Gujarat Civic Registry. Welcome to ${showJoinVerifyModal.name}!`,
      'shield'
    );
    setShowJoinVerifyModal(null);
    setVerifyIdNumber('');
    setVerifyAddress('');
  };

  // Like Forum Message
  const handleLikeMessage = (commId: string, msgId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === commId && c.forumThreads) {
        return {
          ...c,
          forumThreads: c.forumThreads.map(msg => {
            if (msg.id === msgId) {
              const nextLiked = !msg.isLiked;
              return {
                ...msg,
                isLiked: nextLiked,
                likes: nextLiked ? msg.likes + 1 : msg.likes - 1
              };
            }
            return msg;
          })
        };
      }
      return c;
    }));

    // Update selectedForumCommunity
    if (selectedForumCommunity && selectedForumCommunity.id === commId) {
      setSelectedForumCommunity(prev => {
        if (!prev || !prev.forumThreads) return prev;
        return {
          ...prev,
          forumThreads: prev.forumThreads.map(msg => {
            if (msg.id === msgId) {
              const nextLiked = !msg.isLiked;
              return {
                ...msg,
                isLiked: nextLiked,
                likes: nextLiked ? msg.likes + 1 : msg.likes - 1
              };
            }
            return msg;
          })
        };
      });
    }
  };

  // Post to Forum
  const handlePostForumMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForumInput.trim() || !selectedForumCommunity) return;

    const newMsg: ForumMessage = {
      id: `msg-${Date.now()}`,
      author: userRole === 'amc_admin' ? 'Er. Sanjay Patel' : userRole === 'rwa_chairperson' ? 'RWA Chairperson (Ward 14)' : currentUser.name,
      role: userRole === 'amc_admin' ? 'AMC Ward 14 Executive Engineer' : userRole === 'rwa_chairperson' ? 'Verified RWA Executive' : `${currentUser.ward} Resident`,
      text: newForumInput.trim(),
      time: 'Just now',
      likes: 1,
      isLiked: true,
      isOfficial: userRole === 'amc_admin' || isOfficialNoticePost,
      badge: userRole === 'amc_admin' ? 'Official Municipal Reply' : undefined
    };

    setCommunities(prev => prev.map(c => {
      if (c.id === selectedForumCommunity.id) {
        return {
          ...c,
          forumThreads: [...(c.forumThreads || []), newMsg],
          activeTopic: {
            title: newForumInput.slice(0, 60) + (newForumInput.length > 60 ? '...' : ''),
            timeAgo: 'Just now',
            responsesCount: (c.activeTopic?.responsesCount || 0) + 1,
            officialStatus: userRole === 'amc_admin' ? 'AMC Executive Engineer replied' : 'Active Discussion'
          }
        };
      }
      return c;
    }));

    setSelectedForumCommunity(prev => prev ? {
      ...prev,
      forumThreads: [...(prev.forumThreads || []), newMsg]
    } : null);

    setNewForumInput('');
    setIsOfficialNoticePost(false);
    showToast('Message Published', 'Your response has been added to the public thread.', 'check');
  };

  // Vote on Poll
  const handleVotePoll = (commId: string, pollId: string, optionId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === commId && c.polls) {
        return {
          ...c,
          polls: c.polls.map(p => {
            if (p.id === pollId) {
              const alreadyVotedOption = p.options.find(o => o.userVoted);
              if (alreadyVotedOption?.id === optionId) return p; // already voted same
              
              return {
                ...p,
                totalVotes: alreadyVotedOption ? p.totalVotes : p.totalVotes + 1,
                options: p.options.map(o => {
                  if (o.id === optionId) {
                    return { ...o, votes: o.votes + 1, userVoted: true };
                  }
                  if (alreadyVotedOption && o.id === alreadyVotedOption.id) {
                    return { ...o, votes: Math.max(0, o.votes - 1), userVoted: false };
                  }
                  return { ...o, userVoted: false };
                })
              };
            }
            return p;
          })
        };
      }
      return c;
    }));

    if (selectedForumCommunity && selectedForumCommunity.id === commId) {
      setSelectedForumCommunity(prev => {
        if (!prev || !prev.polls) return prev;
        return {
          ...prev,
          polls: prev.polls.map(p => {
            if (p.id === pollId) {
              const alreadyVotedOption = p.options.find(o => o.userVoted);
              return {
                ...p,
                totalVotes: alreadyVotedOption ? p.totalVotes : p.totalVotes + 1,
                options: p.options.map(o => {
                  if (o.id === optionId) return { ...o, votes: o.votes + 1, userVoted: true };
                  if (alreadyVotedOption && o.id === alreadyVotedOption.id) return { ...o, votes: Math.max(0, o.votes - 1), userVoted: false };
                  return { ...o, userVoted: false };
                })
              };
            }
            return p;
          })
        };
      });
    }

    showToast('Vote Registered', 'Thank you! Your civic opinion has been recorded in the ward proposal tally.', 'check');
  };

  // Create Community Handler
  const handleCreateCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommTitle.trim() || !newCommDesc.trim()) return;

    const newGroup: CommunityGroup = {
      id: `comm-${Date.now()}`,
      name: newCommTitle,
      badge: userRole === 'amc_admin' ? 'Ward Council Certified' : 'Federated RWA Body',
      badgeColor: 'blue',
      zone: newCommWard.toUpperCase(),
      adminName: newCommAdminName || (userRole === 'amc_admin' ? 'AMC Ward Administrator' : 'Verified RWA President'),
      membersCount: 1,
      privacy: newCommPrivacy,
      description: newCommDesc,
      coverImage: newCommCoverImage,
      isMember: true,
      category: newCommCategory,
      activeTopic: newCommInitialTopic ? {
        title: newCommInitialTopic,
        timeAgo: 'Just now',
        responsesCount: 1,
        officialStatus: 'Discussion Open'
      } : undefined,
      forumThreads: [
        {
          id: `msg-${Date.now()}`,
          author: newCommAdminName || (userRole === 'amc_admin' ? 'AMC Administrator' : 'RWA Leader'),
          role: userRole === 'amc_admin' ? 'AMC Ward Admin' : 'RWA Chairperson',
          text: newCommInitialTopic || `Welcome to the official ${newCommTitle} civic community. Post neighborhood updates, civil works queries, and maintenance issues here.`,
          time: 'Just now',
          likes: 1,
          isLiked: true,
          isOfficial: true,
          badge: 'Founding Charter'
        }
      ],
      notices: [
        {
          id: `not-${Date.now()}`,
          title: `Statutory Inauguration Charter for ${newCommTitle}`,
          date: 'Today',
          department: newCommWard,
          summary: 'Community verified and recognized by AMC West Zone under Gujarat Municipal Governance Act 2026.',
          fileSize: '1.2 MB PDF'
        }
      ],
      committee: [
        {
          id: `mem-${Date.now()}`,
          name: newCommAdminName || currentUser.name,
          role: userRole === 'amc_admin' ? 'Ward Councillor & Admin' : 'RWA President',
          ward: newCommWard,
          verified: true,
          avatarInitials: 'AD',
          color: 'bg-blue-600'
        }
      ]
    };

    setCommunities([newGroup, ...communities]);
    setShowCreateModal(false);
    showToast(`Community "${newCommTitle}" Created!`, 'Forum initialized with active bylaws and instant ward verification.', 'check');

    // Reset form
    setNewCommTitle('');
    setNewCommDesc('');
    setNewCommAdminName('');
    setNewCommInitialTopic('');
  };

  // Submit RWA Application
  const handleRwaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rwaName || !rwaRegNo) return;

    const generatedRef = `#RWA-AHM-${Math.floor(1000 + Math.random() * 9000)}`;
    setShowRwaAppModal(false);
    showToast(
      `RWA Application Submitted (${generatedRef})`,
      `Verification docket sent to AMC Ward ${rwaWardNo} Executive Engineer. Review SLA: 48 hours.`,
      'shield'
    );
    setRwaName('');
    setRwaRegNo('');
    setRwaChairperson('');
    setRwaContactPhone('');
  };

  // Copy Community Link
  const handleCopyLink = (comm: CommunityGroup) => {
    const url = `${window.location.origin}?community=${comm.id}`;
    navigator.clipboard?.writeText?.(url);
    showToast('Community Link Copied', `Direct shareable URL for "${comm.name}" copied to clipboard.`, 'copy');
  };

  // Filtered and Sorted Communities
  const filteredCommunities = useMemo(() => {
    return communities.filter(c => {
      // Search
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.adminName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tab
      if (activeTab === 'my') return matchesSearch && c.isMember;
      if (activeTab === 'ward14') return matchesSearch && c.category === 'ward14';
      if (activeTab === 'ward8') return matchesSearch && c.category === 'ward8';
      if (activeTab === 'rwa') return matchesSearch && c.category === 'rwa';
      if (activeTab === 'environment') return matchesSearch && c.category === 'environment';
      
      return matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'members') return b.membersCount - a.membersCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'ward') return a.zone.localeCompare(b.zone);
      return 0; // Default order
    });
  }, [communities, activeTab, searchQuery, sortBy]);

  // Dynamic my communities count
  const myCommunitiesCount = useMemo(() => communities.filter(c => c.isMember).length, [communities]);

  return (
    <div className="space-y-6 text-left pb-16">

      {/* =========================================================================
          GLOBAL TOAST NOTIFICATION
          ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start space-x-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 max-w-md">
          {toastMessage.icon === 'check' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.icon === 'copy' && <CheckCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
          {toastMessage.icon === 'shield' && <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />}
          <div className="space-y-0.5">
            <span className="text-xs font-black block">{toastMessage.title}</span>
            {toastMessage.subtitle && (
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                {toastMessage.subtitle}
              </p>
            )}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          ROLE SWITCHER CONTROLLER BAR (ACCESS GOVERNANCE DEMO MODE)
          ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-white tracking-wide">ACCESS GOVERNANCE DEMO MODE</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/25 text-blue-300 border border-blue-400/30">
                ACTIVE ROLE: {userRole.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              Community creation policy restricts group creation to verified Ward Admins & RWA Chairpersons. Switch role below to test:
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
          <button 
            onClick={() => {
              setUserRole('citizen');
              showToast('Role Switched: Citizen', 'Operating as authenticated resident Rahul Sharma with voting & discussion privileges.');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'citizen' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            👤 Citizen
          </button>
          <button 
            onClick={() => {
              setUserRole('rwa_chairperson');
              showToast('Role Switched: RWA Chairperson', 'Unlocked verified community initialization & RWA circular broadcast tools.');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'rwa_chairperson' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 RWA Chairperson
          </button>
          <button 
            onClick={() => {
              setUserRole('amc_admin');
              showToast('Role Switched: AMC Ward Admin', 'Unlocked full statutory authority, municipal notice publishing, and ward committee controls.');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'amc_admin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ AMC Ward Admin
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP HEADER BANNER & ACTIONS
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>OFFICIAL AMC GOVERNED</span>
            </span>

            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>Admin-Only Creation Policy</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span>📍 48 Wards Active</span>
            </span>
          </div>

          {/* Action Button */}
          {userRole === 'citizen' ? (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all border border-slate-200/80 shadow-2xs cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Request New Community Creation</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Verified Community ({userRole === 'amc_admin' ? 'Ward Admin' : 'RWA Leader'})</span>
            </button>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Verified Civic Communities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl font-medium leading-relaxed">
            Hyper-local neighborhood and ward forums moderated by authorized AMC Ward Councils and verified Resident Welfare Associations (RWAs). To prevent spam, community creation is strictly restricted to verified ward administrators and registered RWAs.
          </p>
        </div>

        {/* NOTICE BANNER: Notice on Community Moderation */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5 max-w-2xl">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900">
                  Notice on Community Moderation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Statutory Bylaw 24B
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                To maintain public safety and authentic civic dialogue, communities cannot be created arbitrarily. Only registered Ward Councillors, Zonal Engineers, or verified RWA Chairpersons can initialize a community forum.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowRwaAppModal(true)}
            className="px-4.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-black border border-blue-200 shadow-2xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer active:scale-98"
          >
            <span>Submit RWA Application</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          SEARCH BAR, SORTING & CATEGORY PILLS
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        
        {/* Search Input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities by ward, sector, housing society, or topic..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="activity">Activity (Recent First)</option>
              <option value="members">Most Verified Members</option>
              <option value="ward">Ward Number / Zone</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              All Communities ({communities.length})
            </button>

            <button 
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'my' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>My Communities</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'my' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myCommunitiesCount}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('ward14')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'ward14' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Navrangpura Ward #14
            </button>

            <button 
              onClick={() => setActiveTab('ward8')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'ward8' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Bodakdev Ward #8
            </button>

            <button 
              onClick={() => setActiveTab('rwa')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'rwa' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Residents & RWAs
            </button>

            <button 
              onClick={() => setActiveTab('environment')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'environment' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              Cleanliness & Environment
            </button>
          </div>

          {(searchQuery || activeTab !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                setSortBy('activity');
              }}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* =========================================================================
          MAIN TWO-COLUMN LAYOUT: COMMUNITY CARDS LEFT (8 COLS), GOVERNANCE SIDEBAR RIGHT (4 COLS)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: COMMUNITY GROUPS FEED (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {filteredCommunities.map((group) => (
            <div 
              key={group.id} 
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all space-y-0"
            >
              
              {/* Cover Banner Image with Overlay Title */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 group">
                <img 
                  src={group.coverImage} 
                  alt={group.name} 
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
                
                {/* Top Badge Overlay */}
                <div className="absolute top-3.5 right-3.5 flex items-center space-x-2">
                  <button 
                    onClick={() => handleCopyLink(group)}
                    title="Share Community"
                    className="p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-xs ${
                    group.badgeColor === 'rose' ? 'text-rose-700' : 'text-slate-800'
                  }`}>
                    ● {group.badge}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left space-y-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-blue-300 uppercase block">
                    {group.zone}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {group.name}
                  </h2>
                </div>
              </div>

              {/* Card Meta Bar & Admin Info */}
              <div className="p-5 sm:p-6 space-y-4">
                
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-2 text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Admin: <strong className="font-extrabold text-slate-900">{group.adminName}</strong></span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{group.membersCount.toLocaleString()} {group.category === 'environment' ? 'Volunteers' : group.requiresVerification ? 'Verified Members' : 'Verified Residents'}</span>
                    </span>

                    <span className="flex items-center space-x-1 text-slate-600 font-bold">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{group.privacy}</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed text-left">
                  {group.description}
                </p>

                {/* Active Discussion Box */}
                {group.activeTopic && (
                  <div 
                    onClick={() => {
                      setSelectedForumCommunity(group);
                      setForumTab('discussions');
                    }}
                    className="bg-blue-50/70 hover:bg-blue-50 border border-blue-200/60 rounded-2xl p-4 space-y-2 text-left cursor-pointer transition-colors group/topic"
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-900">
                      <div className="flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span className="uppercase tracking-wider">ACTIVE DISCUSSION</span>
                      </div>
                      <span className="text-slate-400 font-medium group-hover/topic:text-blue-700">{group.activeTopic.timeAgo} • Click to open &rarr;</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover/topic:text-blue-700 transition-colors">
                      Topic: {group.activeTopic.title}
                    </h4>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                      <span>{group.activeTopic.responsesCount} ward members responding</span>
                      <span className="text-blue-700 font-bold">• {group.activeTopic.officialStatus}</span>
                    </div>
                  </div>
                )}

                {/* Event Notice Box */}
                {group.eventNotice && (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Next Cleanliness Drive: {group.eventNotice}</span>
                    </div>
                    {onNavigateToEvents && (
                      <button 
                        onClick={onNavigateToEvents}
                        className="text-[11px] font-black text-emerald-700 hover:underline cursor-pointer"
                      >
                        View Drive & RSVP &rarr;
                      </button>
                    )}
                  </div>
                )}

                {/* Verification Required Note */}
                {group.requiresVerification && (
                  <div className="bg-rose-50 border border-rose-200/70 rounded-2xl p-3 text-xs text-rose-800 font-medium flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{group.verificationNote}</span>
                    </div>
                    <button 
                      onClick={() => setShowJoinVerifyModal(group)}
                      className="text-[11px] font-black text-rose-700 hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      Verify Now &rarr;
                    </button>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  
                  {group.charterNo ? (
                    <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Official RWA Charter {group.charterNo}</span>
                    </span>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">SP</div>
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">RK</div>
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">AB</div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 ml-1.5">+{group.membersCount} participants</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    
                    {/* Subscribe / Join button */}
                    <button 
                      onClick={() => handleToggleJoin(group.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer active:scale-98 ${
                        group.isMember 
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {group.isMember ? '🔔 Subscribed' : '+ Join Group'}
                    </button>

                    {/* Open Forum button */}
                    {group.requiresVerification && !group.isMember ? (
                      <button 
                        onClick={() => setShowJoinVerifyModal(group)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Request to Join (Verification Needed)</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setSelectedForumCommunity(group);
                          setForumTab('discussions');
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Forum ({group.forumThreads?.length || 3})</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </div>
          ))}

          {filteredCommunities.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">No Communities Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No verified community forums match your active search or filter. Try resetting filters or request a new community forum.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                  setSortBy('activity');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
              >
                View All Communities
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: GOVERNANCE & ENROLLED WIDGETS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* WIDGET 1: COMMUNITY GOVERNANCE */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Community Governance
                </h3>
              </div>
              <button 
                onClick={() => setShowBylawsModal(true)}
                className="text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer"
              >
                View Bylaws &rarr;
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              All discussions carry statutory weight. Posts are audited by the Gujarat Civic Transparency Board.
            </p>

            <div className="space-y-3.5">
              
              {/* Rule 1 */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">No Commercial Ads or Politics</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    Strict prohibition on promotional marketing, political campaign messaging, or unauthorized solicitation.
                  </p>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Geo-Verified Resident Tagging</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    Discussions reflect your verified electoral ward to safeguard authentic local accountability.
                  </p>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zero Tolerance for Rumors</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    Unsubstantiated civic rumors or hate speech result in immediate token suspension and RWA deregistration.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* WIDGET 2: MY ENROLLED FORUMS */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                My Enrolled Forums
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                {myCommunitiesCount} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {communities.filter(c => c.isMember).map((comm, idx) => (
                <button 
                  key={comm.id}
                  onClick={() => {
                    setSelectedForumCommunity(comm);
                    setForumTab('discussions');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center shrink-0 text-[11px] ${
                      idx === 0 ? 'bg-blue-100 text-blue-800' :
                      idx === 1 ? 'bg-sky-100 text-sky-800' : 'bg-slate-900 text-white'
                    }`}>
                      {comm.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="font-extrabold text-slate-900 block group-hover:text-blue-600 transition-colors truncate max-w-[170px]">
                        {comm.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[170px]">
                        {comm.zone}
                      </span>
                    </div>
                  </div>

                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {comm.forumThreads?.length || 2}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* WIDGET 3: WARD 14 AUTHORITY CONTACTS */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Ward 14 Authority Contacts
              </h3>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Contact designated municipal representatives directly for urgent escalation outside public threads.
            </p>

            <div className="space-y-2.5">
              
              {/* Contact 1 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 font-black flex items-center justify-center text-xs shrink-0">
                    SP
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Er. Sanjay Patel</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">AMC Ward 14 Executive Engineer</span>
                  </div>
                </div>

                <a 
                  href="tel:07926578000"
                  onClick={() => showToast('Calling Ward Engineer', 'Connecting to AMC West Zone Engineering Desk (079-26578000)...')}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-extrabold text-blue-700 hover:bg-blue-50 transition-all shrink-0 flex items-center space-x-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span>Call Office</span>
                </a>
              </div>

              {/* Contact 2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 font-black flex items-center justify-center text-xs shrink-0">
                    MJ
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Meera Joshi, IAS</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">Zonal Public Grievance Ombudsman</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowOmbudsmanModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-extrabold text-purple-700 hover:bg-purple-50 transition-all shrink-0 flex items-center space-x-1 cursor-pointer"
                >
                  <Calendar className="w-3 h-3 text-purple-600" />
                  <span>Book Slot</span>
                </button>
              </div>

            </div>

            <div className="text-[10px] text-slate-400 font-semibold text-center pt-1 border-t border-slate-100">
              Hearings: Tue & Thu 11 AM at West Zone Civic Center
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}

      {/* 1. CREATE COMMUNITY MODAL (ADMIN & RWA ALLOWED / CITIZEN DEMO RESTRICTION) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  COMMUNITY INITIALIZATION
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {userRole === 'citizen' ? 'Creation Policy Restriction' : 'Initialize Verified Community Forum'}
                </h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {userRole === 'citizen' ? (
              <div className="space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-rose-900">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-rose-950">Citizen Access Policy Restriction</h4>
                    <p className="mt-1 font-medium leading-relaxed">
                      You are currently logged in as a standard Resident Citizen. Statutory Bylaw 24B requires community forums to be created strictly by verified Ward Administrators or registered RWAs.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-black text-slate-900 block">How to create a community in demo mode:</span>
                  <ul className="space-y-1.5 text-slate-600 list-disc pl-4 font-medium">
                    <li>Switch role in the top dark demo bar to <strong>"RWA Chairperson"</strong> or <strong>"AMC Ward Admin"</strong>.</li>
                    <li>Or submit an official RWA verification application to AMC Ward Council.</li>
                  </ul>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowRwaAppModal(true);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-blue-50 text-blue-700 text-xs font-extrabold hover:bg-blue-100 cursor-pointer"
                  >
                    Submit RWA Application
                  </button>

                  <button 
                    onClick={() => {
                      setUserRole('rwa_chairperson');
                      showToast('Switched to RWA Chairperson Role', 'You can now publish verified communities.');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    Switch to RWA Leader Role
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateCommunitySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Community Forum Name</label>
                  <input 
                    type="text" 
                    value={newCommTitle}
                    onChange={(e) => setNewCommTitle(e.target.value)}
                    placeholder="e.g. Navrangpura Sector 12 Security & Cleanliness Forum"
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Ward / Zone</label>
                    <select 
                      value={newCommWard}
                      onChange={(e) => setNewCommWard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium cursor-pointer"
                    >
                      <option>Navrangpura Ward #14</option>
                      <option>Bodakdev Ward #8</option>
                      <option>Vastrapur Ward #15</option>
                      <option>Sabarmati Ward #3</option>
                      <option>Satellite Ward #10</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Forum Category</label>
                    <select 
                      value={newCommCategory}
                      onChange={(e) => setNewCommCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium cursor-pointer"
                    >
                      <option value="ward14">Navrangpura Ward #14</option>
                      <option value="ward8">Bodakdev Ward #8</option>
                      <option value="rwa">Residents & RWAs</option>
                      <option value="environment">Cleanliness & Environment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Moderator / Admin Title</label>
                  <input 
                    type="text" 
                    value={newCommAdminName}
                    onChange={(e) => setNewCommAdminName(e.target.value)}
                    placeholder={userRole === 'amc_admin' ? 'AMC Exec Engineer / Corporator' : 'RWA President / Secretary Name'}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Description & Civic Mandate</label>
                  <textarea 
                    value={newCommDesc}
                    onChange={(e) => setNewCommDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe the scope of discussion, housing societies covered, or municipal objectives..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">First Pinned Discussion Topic (Optional)</label>
                  <input 
                    type="text" 
                    value={newCommInitialTopic}
                    onChange={(e) => setNewCommInitialTopic(e.target.value)}
                    placeholder="e.g. Schedule for road resurfacing and water supply timings"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 shadow-md cursor-pointer active:scale-98"
                  >
                    Publish Verified Community
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 2. SUBMIT RWA APPLICATION MODAL */}
      {showRwaAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  STATUTORY REGISTRATION
                </span>
                <h3 className="text-lg font-black text-slate-900">Submit RWA Verification Application</h3>
              </div>
              <button 
                onClick={() => setShowRwaAppModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRwaSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">RWA Association Name</label>
                <input 
                  type="text" 
                  value={rwaName}
                  onChange={(e) => setRwaName(e.target.value)}
                  placeholder="e.g. Navrangpura Central Housing Societies Federation"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Registration No. (Charity Commissioner)</label>
                  <input 
                    type="text" 
                    value={rwaRegNo}
                    onChange={(e) => setRwaRegNo(e.target.value)}
                    placeholder="e.g. AHM-2021-994"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ward Number</label>
                  <select 
                    value={rwaWardNo}
                    onChange={(e) => setRwaWardNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium cursor-pointer"
                  >
                    <option value="14">Ward 14 (Navrangpura)</option>
                    <option value="8">Ward 8 (Bodakdev)</option>
                    <option value="15">Ward 15 (Vastrapur)</option>
                    <option value="3">Ward 3 (Sabarmati)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chairperson / President Name</label>
                  <input 
                    type="text" 
                    value={rwaChairperson}
                    onChange={(e) => setRwaChairperson(e.target.value)}
                    placeholder="Full legal name"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Mobile</label>
                  <input 
                    type="tel" 
                    value={rwaContactPhone}
                    onChange={(e) => setRwaContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-[11px] text-blue-900 font-medium leading-relaxed">
                Upon submission, AMC Ward Executive Engineer will verify society registry documents within 48 hours and issue the RWA Charter Token with official broadcast authority.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setShowRwaAppModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 shadow-md cursor-pointer active:scale-98"
                >
                  Submit RWA Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. OPEN FORUM DISCUSSION & COMMUNITY HUB MODAL */}
      {selectedForumCommunity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-4 text-left border border-slate-100 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                  {selectedForumCommunity.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{selectedForumCommunity.name}</h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    {selectedForumCommunity.membersCount.toLocaleString()} Verified Members • {selectedForumCommunity.zone}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleCopyLink(selectedForumCommunity)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Share Forum Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedForumCommunity(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs within Community */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2 shrink-0">
              <button
                onClick={() => setForumTab('discussions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  forumTab === 'discussions' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussions ({selectedForumCommunity.forumThreads?.length || 0})</span>
              </button>

              <button
                onClick={() => setForumTab('notices')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  forumTab === 'notices' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ward Notices ({selectedForumCommunity.notices?.length || 0})</span>
              </button>

              <button
                onClick={() => setForumTab('polls')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  forumTab === 'polls' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Proposals & Polls</span>
              </button>

              <button
                onClick={() => setForumTab('members')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  forumTab === 'members' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Committee</span>
              </button>
            </div>

            {/* TAB CONTENT 1: DISCUSSIONS */}
            {forumTab === 'discussions' && (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[260px]">
                  {selectedForumCommunity.forumThreads && selectedForumCommunity.forumThreads.length > 0 ? (
                    selectedForumCommunity.forumThreads.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                          msg.isOfficial 
                            ? 'bg-blue-50/70 border-blue-200' 
                            : 'bg-slate-50 border-slate-200/70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-slate-900">{msg.author}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              msg.isOfficial ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {msg.role}
                            </span>
                            {msg.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                                ★ {msg.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                        </div>

                        <p className="text-slate-700 font-medium leading-relaxed">
                          {msg.text}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                          <button
                            onClick={() => handleLikeMessage(selectedForumCommunity.id, msg.id)}
                            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              msg.isLiked ? 'text-blue-600 bg-blue-100/80 font-black' : 'text-slate-500 hover:bg-slate-200/70'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{msg.likes} Helpful</span>
                          </button>

                          <span className="text-[10px] text-slate-400">
                            Audited by Civic Transparency Node
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      No discussions in this forum yet. Be the first to start the thread below!
                    </div>
                  )}
                </div>

                {/* Message Input Form */}
                <div className="shrink-0 pt-2 border-t border-slate-100 space-y-2">
                  {userRole === 'amc_admin' && (
                    <div className="flex items-center space-x-2 text-[11px] text-blue-700 font-bold">
                      <input 
                        type="checkbox"
                        id="officialCheck"
                        checked={isOfficialNoticePost}
                        onChange={(e) => setIsOfficialNoticePost(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <label htmlFor="officialCheck" className="cursor-pointer">
                        Post as Official Municipal Executive Directive (Signed Stamp)
                      </label>
                    </div>
                  )}

                  <form onSubmit={handlePostForumMessage} className="flex items-center space-x-2">
                    <input 
                      type="text"
                      value={newForumInput}
                      onChange={(e) => setNewForumInput(e.target.value)}
                      placeholder={`Post message to ${selectedForumCommunity.name}...`}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs cursor-pointer active:scale-98 flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* TAB CONTENT 2: NOTICES */}
            {forumTab === 'notices' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[260px]">
                {selectedForumCommunity.notices && selectedForumCommunity.notices.length > 0 ? (
                  selectedForumCommunity.notices.map((notice) => (
                    <div key={notice.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                          {notice.department}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{notice.date}</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm">{notice.title}</h4>
                      <p className="text-slate-600 leading-relaxed font-medium">{notice.summary}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">{notice.fileSize || 'PDF Circular'}</span>
                        <button 
                          onClick={() => showToast('Circular Downloaded', `Official PDF for "${notice.title}" saved to device.`)}
                          className="flex items-center space-x-1 text-blue-600 font-extrabold hover:underline cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download Circular</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No official circulars published for this ward yet.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: POLLS */}
            {forumTab === 'polls' && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[260px]">
                {selectedForumCommunity.polls && selectedForumCommunity.polls.length > 0 ? (
                  selectedForumCommunity.polls.map((poll) => (
                    <div key={poll.id} className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 uppercase">
                          CIVIC PROPOSAL POLL
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{poll.expiresIn}</span>
                      </div>

                      <h4 className="font-black text-slate-900 text-sm">{poll.question}</h4>

                      <div className="space-y-2">
                        {poll.options.map((opt) => {
                          const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleVotePoll(selectedForumCommunity.id, poll.id, opt.id)}
                              className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                                opt.userVoted 
                                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20' 
                                  : 'border-slate-200 bg-white hover:bg-slate-100/60'
                              }`}
                            >
                              <div 
                                className="absolute inset-y-0 left-0 bg-blue-100/60 -z-0 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className={`font-bold ${opt.userVoted ? 'text-blue-900 font-black' : 'text-slate-800'}`}>
                                  {opt.text} {opt.userVoted && '✓ (Your Vote)'}
                                </span>
                                <span className="font-black text-slate-700 ml-2">
                                  {percentage}% ({opt.votes})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-slate-400 font-semibold text-right">
                        Total {poll.totalVotes} verified citizen votes recorded
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No active proposals or polls currently open.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: COMMITTEE MEMBERS */}
            {forumTab === 'members' && (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[260px]">
                {selectedForumCommunity.committee && selectedForumCommunity.committee.length > 0 ? (
                  selectedForumCommunity.committee.map((mem) => (
                    <div key={mem.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl ${mem.color} text-white font-black flex items-center justify-center text-xs shrink-0`}>
                          {mem.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-black text-slate-900">{mem.name}</span>
                            {mem.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">{mem.role} • {mem.ward}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Verified Member
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Committee roster updating with AMC West Zone Secretariat.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4. JOIN VERIFICATION MODAL */}
      {showJoinVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Request Restricted Access</h3>
              <button 
                onClick={() => setShowJoinVerifyModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {showJoinVerifyModal.verificationNote}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Aadhaar / Senior Citizen ID Number</label>
                <input 
                  type="text" 
                  value={verifyIdNumber}
                  onChange={(e) => setVerifyIdNumber(e.target.value)}
                  placeholder="XXXX - XXXX - 4821" 
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Residential Address in Vastrapur / Ward</label>
                <input 
                  type="text" 
                  value={verifyAddress}
                  onChange={(e) => setVerifyAddress(e.target.value)}
                  placeholder="Flat No, Society, Vastrapur Lake Precinct" 
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input 
                  type="checkbox" 
                  id="consentCheck"
                  checked={verifyConsent}
                  onChange={(e) => setVerifyConsent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="consentCheck" className="text-[11px] text-slate-600 font-medium cursor-pointer">
                  I certify I am a verified resident or eligible senior citizen in this precinct.
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button 
                onClick={() => setShowJoinVerifyModal(null)}
                className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleCompleteVerification}
                className="px-5 py-2 rounded-2xl bg-blue-600 text-white font-extrabold text-xs shadow-xs cursor-pointer active:scale-98"
              >
                Submit Verification Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. OMBUDSMAN BOOKING MODAL */}
      {showOmbudsmanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">
                  PUBLIC GRIEVANCE OMBUDSMAN
                </span>
                <h3 className="text-base font-black text-slate-900">Book Hearing Slot with Meera Joshi, IAS</h3>
              </div>
              <button 
                onClick={() => setShowOmbudsmanModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Hearing Date & Time</label>
                <select 
                  value={ombudsmanDate}
                  onChange={(e) => setOmbudsmanDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium cursor-pointer"
                >
                  <option>Tuesday, Sep 23, 2026 (11:00 AM)</option>
                  <option>Thursday, Sep 25, 2026 (11:30 AM)</option>
                  <option>Tuesday, Sep 30, 2026 (11:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Escalated Civic Issue Reference</label>
                <input 
                  type="text" 
                  value={ombudsmanTicketRef}
                  onChange={(e) => setOmbudsmanTicketRef(e.target.value)}
                  placeholder="Ticket #NX-10482 (Road Pothole SLA Breach)" 
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Brief Description for Hearing Docket</label>
                <textarea 
                  value={ombudsmanNotes}
                  onChange={(e) => setOmbudsmanNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button 
                onClick={() => setShowOmbudsmanModal(false)}
                className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowOmbudsmanModal(false);
                  showToast(
                    'Hearing Slot Confirmed!',
                    `Slot booked for ${ombudsmanDate} at West Zone Civic Center (Hall 2B). SMS docket generated.`,
                    'shield'
                  );
                }}
                className="px-5 py-2 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-xs cursor-pointer active:scale-98"
              >
                Confirm Hearing Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GUJARAT CIVIC BYLAWS MODAL */}
      {showBylawsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  STATUTORY ACT 2026
                </span>
                <h3 className="text-lg font-black text-slate-900">Gujarat Civic Community Bylaws (24B)</h3>
              </div>
              <button 
                onClick={() => setShowBylawsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <strong className="text-blue-900 block font-black">Section 1: Verified Identity Mandate</strong>
                All participants in ward governance forums are cryptographically authenticated against AMC electoral records. Impersonation of ward officers carries penalty under Section 419 IPC.
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-slate-900 block font-black">Section 2: Response SLA Requirements</strong>
                AMC Zonal Engineers assigned to certified ward communities must furnish written operational updates on logged civic tickets within 48 business hours.
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-slate-900 block font-black">Section 3: Binding Community Petitions</strong>
                Civic proposals receiving upwards of 250 verified ward votes are automatically placed on the agenda of the upcoming Ward Committee monthly sabha.
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button 
                onClick={() => showToast('Bylaws PDF Saved', 'Gujarat Civic Bylaws 2026 official gazette downloaded.')}
                className="flex items-center space-x-1 text-blue-600 font-extrabold hover:underline text-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Gazette (PDF)</span>
              </button>

              <button 
                onClick={() => setShowBylawsModal(false)}
                className="px-5 py-2 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunitiesPage;
