import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Filter, Plus, ThumbsUp, MessageSquare, Share2, 
  Bookmark, Calendar, MapPin, CheckCircle2, Clock, Zap, Users, 
  Building2, ArrowRight, ShieldCheck, Check, ChevronRight, Vote, 
  Sparkles, ExternalLink, Navigation, Compass, Heart, X, Send, 
  AlertCircle, Copy, Share, Download, CheckCheck, Map, Eye,
  SlidersHorizontal, RefreshCw, Layers, Award, Radio, Phone,
  Flame, TrendingUp, Info, UserCheck, MessageCircle
} from 'lucide-react';
import { Language, Post } from '../types';

import potholeImg from '../assets/images/pothole_repaired_after_1789742513449.jpg';
import avatarImg from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';
import wasteSpillImg from '../assets/images/evidence_waste_spillage_1789743181414.jpg';
import wireHazardImg from '../assets/images/evidence_wire_hazard_1789743199289.jpg';
import sabarmatiImg from '../assets/images/sabarmati_riverfront_drive_1789740233986.jpg';
import resolvedImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import ahmedabadHeroImg from '../assets/images/ahmedabad_hero_real_1789766454218.jpg';

interface ExplorePageProps {
  language: Language;
  posts: Post[];
  onOpenReportModal: () => void;
  onSelectWard?: (wardName: string) => void;
}

interface CommentItem {
  id: string;
  author: string;
  role?: string;
  ward: string;
  time: string;
  avatar: string;
  text: string;
  likes: number;
  userLiked?: boolean;
}

interface ExplorePostItem {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isOfficial?: boolean;
    role: string;
    ward: string;
    zone: string;
  };
  timeAgo: string;
  locationDetails: string;
  badgeType: 'progress' | 'event' | 'notice' | 'utility' | 'success';
  badgeLabel: string;
  title: string;
  body: string;
  hashtags: string[];
  category: 'roads' | 'environment' | 'heritage' | 'utilities' | 'safety' | 'events';
  image?: string;
  hasMapOverlay?: boolean;
  mapLabel?: string;
  isEvent?: boolean;
  eventDetails?: {
    month: string;
    day: string;
    title: string;
    location: string;
    joinedCount: number;
    initialJoined: number;
    time: string;
  };
  isUtility?: boolean;
  utilityMetrics?: {
    availableBays: string;
    maxOutput: string;
    operatingHours: string;
    tariff: string;
  };
  upvotesCount: number;
  commentsList: CommentItem[];
  bookmarksCount: number;
  coordinates?: { lat: number; lng: number };
  googleMapsUrl?: string;
}

const INITIAL_EXPLORE_POSTS: ExplorePostItem[] = [
  {
    id: 'p1',
    author: {
      name: 'AMC West Zone Engineering',
      isOfficial: true,
      role: 'Municipal Road Maintenance Unit',
      ward: 'Bodakdev - Ward 8',
      zone: 'West Zone'
    },
    timeAgo: '2 hours ago',
    locationDetails: 'Judges Bungalow Road Sector',
    badgeType: 'progress',
    badgeLabel: 'AMC In-Progress',
    title: 'Major road re-carpeting started on Judges Bungalow Road! AMC crews on-site.',
    body: 'In response to 127 citizen upvotes and civic petitions regarding monsoon potholes, heavy machinery and bitumen surfacing units are actively deploying along the 1.8km stretch from Pakwan Cross Road to Judges Bungalow. Commuters are advised to utilize alternate routing via SG Highway service lanes between 10 PM and 6 AM.',
    hashtags: ['#SGHighwayFlyover', '#BodakdevDrainage', '#AMCRoadWorks'],
    category: 'roads',
    image: potholeImg,
    hasMapOverlay: true,
    mapLabel: 'Judges Bungalow Rd, Bodakdev (Ward 8)',
    upvotesCount: 348,
    bookmarksCount: 42,
    coordinates: { lat: 23.0385, lng: 72.5119 },
    googleMapsUrl: 'https://maps.google.com/?q=Judges+Bungalow+Road+Bodakdev+Ahmedabad',
    commentsList: [
      {
        id: 'c1',
        author: 'Nirav Patel',
        role: 'Verified Resident',
        ward: 'Bodakdev',
        time: '1 hour ago',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        text: 'Great initiative! Finally the deep potholes near Pakwan circle are getting asphalted before the Navratri rush.',
        likes: 14
      },
      {
        id: 'c2',
        author: 'Meera Trivedi',
        role: 'RWA President',
        ward: 'Judges Bungalow Area',
        time: '45 mins ago',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
        text: 'Please also inspect the storm water drain grill right outside Galaxy Cinema corner so rainwater does not puddle.',
        likes: 8
      },
      {
        id: 'c3',
        author: 'AMC Helpline Desk',
        role: 'Official Response',
        ward: 'West Zone Desk',
        time: '20 mins ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        text: 'Noted @Meera! The drainage cleaning team has been dispatched along with the re-carpeting team.',
        likes: 19
      }
    ]
  },
  {
    id: 'p2',
    author: {
      name: 'Devang Vora',
      avatar: avatarImg,
      role: 'Civic Volunteer Lead - South Zone Chapter',
      ward: 'Maninagar - Ward 32',
      zone: 'South Zone'
    },
    timeAgo: '3 hours ago',
    locationDetails: 'Kankaria Lakefront Gate 3',
    badgeType: 'event',
    badgeLabel: '🎉 Community Event',
    title: 'Kankaria Lakefront cleanliness volunteer drive this Sunday. Welcoming volunteers from all wards!',
    body: 'Calling residents from Satellite, Navrangpura, and beyond! Join the South Zone Eco-Civic crew at Gate No. 3 this Sunday morning at 6:30 AM. Gloves, eco-bags, and municipal waste segregators will be provided by AMC solid waste teams. Let\'s unite across neighborhoods to preserve Ahmedabad\'s premier public waterbody.',
    hashtags: ['#SabarmatiCleanDrive', '#CleanKankaria', '#GreenAhmedabad'],
    category: 'events',
    isEvent: true,
    eventDetails: {
      month: 'OCT',
      day: '27',
      title: 'Sunday Eco-Drive · 06:30 AM - 09:00 AM',
      location: 'Kankaria Lakefront, Gate 3, Maninagar (Open to all Ahmedabad)',
      joinedCount: 84,
      initialJoined: 84,
      time: '06:30 AM - 09:00 AM'
    },
    upvotesCount: 192,
    bookmarksCount: 65,
    coordinates: { lat: 23.0063, lng: 72.5995 },
    googleMapsUrl: 'https://maps.google.com/?q=Kankaria+Lake+Gate+3+Maninagar+Ahmedabad',
    commentsList: [
      {
        id: 'c201',
        author: 'Ananya Joshi',
        ward: 'Satellite',
        time: '2 hours ago',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
        text: 'Our college youth club from LD Engineering is coming with 25 volunteers! See you on Sunday at 6:30 AM.',
        likes: 22
      },
      {
        id: 'c202',
        author: 'Harshil Shah',
        ward: 'Maninagar',
        time: '1 hour ago',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces',
        text: 'Parking will be arranged free at the Multi-level parking lot opposite Gate 3 for all verified volunteers.',
        likes: 11
      }
    ]
  },
  {
    id: 'p3',
    author: {
      name: 'Ahmedabad World Heritage Cell',
      isOfficial: true,
      role: 'UNESCO Heritage Zone Coordination',
      ward: 'Old City - Ward 2',
      zone: 'Central Zone'
    },
    timeAgo: '4 hours ago',
    locationDetails: 'Teen Darwaza Precinct',
    badgeType: 'notice',
    badgeLabel: '📢 Official Notice',
    title: 'Heritage wooden facade structural concern reported near Teen Darwaza. Forwarded to AMC Heritage Cell.',
    body: 'Citizens in the Walled City alerted the municipal cell to micro-fissures in a 140-year-old carved wooden bracket (chhatri) on Haveli Lane. AMC conservation engineers alongside CEPT heritage specialists have cordoned off the immediate pedestrian corridor for precision bracing and restorative timber stabilization.',
    hashtags: ['#HeritageWalkAhmedabad', '#OldCityPreservation', '#UNESCOAhmedabad'],
    category: 'heritage',
    image: sabarmatiImg,
    hasMapOverlay: true,
    mapLabel: 'Teen Darwaza Precinct, Ward 2',
    upvotesCount: 164,
    bookmarksCount: 29,
    coordinates: { lat: 23.0248, lng: 72.5858 },
    googleMapsUrl: 'https://maps.google.com/?q=Teen+Darwaza+Old+City+Ahmedabad',
    commentsList: [
      {
        id: 'c301',
        author: 'Prof. B.V. Doshi Foundation',
        role: 'Architectural Historian',
        ward: 'Navrangpura',
        time: '3 hours ago',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        text: 'Thank you for swift structural cordoning. The teak carvings in this pol are among the rarest Sultanate-period wooden facades in Gujarat.',
        likes: 31
      }
    ]
  },
  {
    id: 'p4',
    author: {
      name: 'AMC Urban Utility Board',
      isOfficial: true,
      role: 'Smart Infrastructure Directorate',
      ward: 'Vastrapur - Ward 14',
      zone: 'West Zone'
    },
    timeAgo: 'Yesterday',
    locationDetails: 'Vastrapur Lake Hub',
    badgeType: 'utility',
    badgeLabel: '⚡ City Utility',
    title: 'New EV fast-charging depot opened near Vastrapur Lake. Open for public 24/7.',
    body: 'Eight high-power CCS2 and Type-2 chargers are now fully operational at the municipal parking hub opposite Vastrapur Amphitheatre. Powered by rooftop solar arrays with dynamic AMC Smart City grid load balancing. Standard rate ₹13.5/kWh via NAGAR-X wallet integration.',
    hashtags: ['#VastrapurEVHub', '#GreenMobility', '#SmartAhmedabad'],
    category: 'utilities',
    isUtility: true,
    utilityMetrics: {
      availableBays: '6 / 8',
      maxOutput: '120 kW',
      operatingHours: '24 / 7',
      tariff: '₹13.5/u'
    },
    upvotesCount: 218,
    bookmarksCount: 77,
    coordinates: { lat: 23.0350, lng: 72.5293 },
    googleMapsUrl: 'https://maps.google.com/?q=Vastrapur+Lake+Amphitheatre+Ahmedabad',
    commentsList: [
      {
        id: 'c401',
        author: 'Kunal Dave',
        ward: 'Vastrapur',
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        text: 'Charged my Nexon EV here yesterday night! Fast, seamless auto-cut after 80%, and zero waiting line.',
        likes: 18
      }
    ]
  },
  {
    id: 'p5',
    author: {
      name: 'Sabarmati Riverfront Development Trust',
      isOfficial: true,
      role: 'Urban Waterfront Authority',
      ward: 'Sabarmati - Ward 5',
      zone: 'North Zone'
    },
    timeAgo: 'Yesterday',
    locationDetails: 'Riverfront Phase 2 Promenade',
    badgeType: 'success',
    badgeLabel: '🌿 Environmental Landmark',
    title: '3,000 Miyawaki dense forest saplings planted along Riverfront Phase 2 promenade.',
    body: 'AMC along with forest department botanists completed urban biodiversity plantation on the eastern embankment. Includes indigenous species like Neem, Peepal, Gulmohar, and Banyan with drip irrigation sensors monitored via the AMC Command Center.',
    hashtags: ['#SabarmatiCleanDrive', '#GreenAhmedabad', '#MiyawakiForest'],
    category: 'environment',
    image: ahmedabadHeroImg,
    hasMapOverlay: true,
    mapLabel: 'Sabarmati Riverfront Phase 2, North Zone',
    upvotesCount: 289,
    bookmarksCount: 51,
    coordinates: { lat: 23.0560, lng: 72.5850 },
    googleMapsUrl: 'https://maps.google.com/?q=Sabarmati+Riverfront+Phase+2+Ahmedabad',
    commentsList: [
      {
        id: 'c501',
        author: 'Radha Sanghavi',
        ward: 'Sabarmati',
        time: '18 hours ago',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
        text: 'The walking path feels so refreshing in the morning! Thank you AMC for prioritizing green canopy over concrete.',
        likes: 24
      }
    ]
  },
  {
    id: 'p6',
    author: {
      name: 'Satellite Residents Action Group',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      role: 'Civic Watchdog Committee',
      ward: 'Satellite - Ward 15',
      zone: 'West Zone'
    },
    timeAgo: '2 days ago',
    locationDetails: 'Shivranjani Cross Roads',
    badgeType: 'progress',
    badgeLabel: 'AMC In-Progress',
    title: 'Smart LED streetlights and AI CCTV surveillance upgrade completed on 132ft Ring Road.',
    body: 'The 4.2km stretch from Shivranjani to Shyamal crossroads now features adaptive solar-hybrid streetlights with automatic dimming and automated fault detection, reducing energy consumption by 40%.',
    hashtags: ['#SGHighwayFlyover', '#SmartAhmedabad', '#SafeStreets'],
    category: 'safety',
    image: resolvedImg,
    hasMapOverlay: true,
    mapLabel: '132 Feet Ring Rd, Satellite (Ward 15)',
    upvotesCount: 175,
    bookmarksCount: 38,
    coordinates: { lat: 23.0225, lng: 72.5284 },
    googleMapsUrl: 'https://maps.google.com/?q=Shivranjani+Cross+Roads+Satellite+Ahmedabad',
    commentsList: [
      {
        id: 'c601',
        author: 'Tanmay Mehta',
        ward: 'Satellite',
        time: '1 day ago',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        text: 'Night visibility is 100x better now, especially for cyclists and pedestrians crossing Shyamal junction.',
        likes: 12
      }
    ]
  }
];

const ALL_48_AHMEDABAD_WARDS = [
  { id: 1, name: 'Kubernagar', zone: 'North Zone', sla: 87, discussions: 194, councilor: 'Smt. Geetaben Patel' },
  { id: 2, name: 'Old City (Heritage - Khadia)', zone: 'Central Zone', sla: 92, discussions: 320, councilor: 'Shri Mayur Dave' },
  { id: 3, name: 'Shahpur', zone: 'Central Zone', sla: 84, discussions: 210, councilor: 'Shri Imtiyaz Shaikh' },
  { id: 4, name: 'Asarwa', zone: 'Central Zone', sla: 89, discussions: 175, councilor: 'Shri Rameshbhai Parmar' },
  { id: 5, name: 'Sabarmati', zone: 'North Zone', sla: 85, discussions: 280, councilor: 'Shri Bharatbhai Barot' },
  { id: 6, name: 'Chandkheda', zone: 'West Zone', sla: 90, discussions: 310, councilor: 'Smt. Shitalben Shah' },
  { id: 7, name: 'Ranip', zone: 'West Zone', sla: 86, discussions: 190, councilor: 'Shri Paresh Patel' },
  { id: 8, name: 'Bodakdev', zone: 'West Zone', sla: 94, discussions: 420, councilor: 'Shri Chetanbhai Shah' },
  { id: 9, name: 'Thaltej', zone: 'New West Zone', sla: 93, discussions: 395, councilor: 'Smt. Minakshiben Shukla' },
  { id: 10, name: 'Gota', zone: 'New West Zone', sla: 88, discussions: 340, councilor: 'Shri Dilipbhai Bagariya' },
  { id: 11, name: 'Ghatlodiya', zone: 'West Zone', sla: 91, discussions: 290, councilor: 'Shri Jatinbhai Patel' },
  { id: 12, name: 'Naranpura', zone: 'West Zone', sla: 93, discussions: 360, councilor: 'Smt. Pritiben Desai' },
  { id: 13, name: 'Navrangpura (Home)', zone: 'Central-West Zone', sla: 91, discussions: 388, councilor: 'Shri Hitesh Barot' },
  { id: 14, name: 'Vastrapur', zone: 'West Zone', sla: 95, discussions: 405, councilor: 'Smt. Binduben Patel' },
  { id: 15, name: 'Satellite', zone: 'West Zone', sla: 92, discussions: 350, councilor: 'Shri Amitbhai Shah' },
  { id: 16, name: 'Paldi', zone: 'West Zone', sla: 90, discussions: 280, councilor: 'Shri Niravbhai Raval' },
  { id: 17, name: 'Vasna', zone: 'West Zone', sla: 86, discussions: 220, councilor: 'Smt. Alkaben Modi' },
  { id: 18, name: 'Ellisbridge', zone: 'Central Zone', sla: 91, discussions: 260, councilor: 'Shri Jayeshbhai Trivedi' },
  { id: 19, name: 'Jamalpur', zone: 'Central Zone', sla: 83, discussions: 240, councilor: 'Shri Imran Khedawala' },
  { id: 20, name: 'Raikhad', zone: 'Central Zone', sla: 85, discussions: 180, councilor: 'Smt. Parulben Shah' },
  { id: 21, name: 'Dariapur', zone: 'Central Zone', sla: 84, discussions: 230, councilor: 'Shri Gyasuddin Shaikh' },
  { id: 22, name: 'Kalupur', zone: 'Central Zone', sla: 88, discussions: 270, councilor: 'Shri Rajeshbhai Patel' },
  { id: 23, name: 'Saraspur', zone: 'East Zone', sla: 82, discussions: 195, councilor: 'Shri Mukeshbhai Parmar' },
  { id: 24, name: 'Bapunagar', zone: 'East Zone', sla: 86, discussions: 310, councilor: 'Smt. Kokilaben Vaghela' },
  { id: 25, name: 'Rakhial', zone: 'East Zone', sla: 81, discussions: 190, councilor: 'Shri Farooqbhai Mansuri' },
  { id: 26, name: 'Gomtipur', zone: 'East Zone', sla: 80, discussions: 225, councilor: 'Shri Pravinbhai Solanki' },
  { id: 27, name: 'Amraiwadi', zone: 'East Zone', sla: 83, discussions: 240, councilor: 'Smt. Manjulaben Rathod' },
  { id: 28, name: 'Odhav', zone: 'East Zone', sla: 85, discussions: 285, councilor: 'Shri Pareshbhai Dave' },
  { id: 29, name: 'Nikol', zone: 'East Zone', sla: 89, discussions: 330, councilor: 'Shri Jagdishbhai Patel' },
  { id: 30, name: 'Viratnagar', zone: 'East Zone', sla: 84, discussions: 215, councilor: 'Smt. Sangitaben Patel' },
  { id: 31, name: 'India Colony', zone: 'North Zone', sla: 87, discussions: 260, councilor: 'Shri Bhaveshbhai Shah' },
  { id: 32, name: 'Maninagar', zone: 'South Zone', sla: 88, discussions: 315, councilor: 'Shri Surendrabhai Patel' },
  { id: 33, name: 'Isanpur', zone: 'South Zone', sla: 85, discussions: 270, councilor: 'Smt. Kalpanaben Vora' },
  { id: 34, name: 'Vatva', zone: 'South Zone', sla: 82, discussions: 290, councilor: 'Shri Balvantsinh Rajput' },
  { id: 35, name: 'Ghogha (Ghodasar)', zone: 'South Zone', sla: 86, discussions: 240, councilor: 'Shri Prakashbhai Parmar' },
  { id: 36, name: 'Danilimda', zone: 'South Zone', sla: 80, discussions: 250, councilor: 'Shri Shaileshbhai Parmar' },
  { id: 37, name: 'Behrampura', zone: 'South Zone', sla: 81, discussions: 230, councilor: 'Smt. Kamlaben Chavda' },
  { id: 38, name: 'Kankaria', zone: 'South Zone', sla: 91, discussions: 330, councilor: 'Shri Gautam Dave' },
  { id: 39, name: 'Sarkhej', zone: 'South-West Zone', sla: 84, discussions: 260, councilor: 'Shri Nareshbhai Patel' },
  { id: 40, name: 'Jodhpur', zone: 'South-West Zone', sla: 93, discussions: 375, councilor: 'Smt. Rashmiben Shah' },
  { id: 41, name: 'Maktampur (Vejalpur)', zone: 'South-West Zone', sla: 87, discussions: 295, councilor: 'Shri Kalpeshbhai Patel' },
  { id: 42, name: 'Bopal - Ghuma', zone: 'New West Zone', sla: 92, discussions: 410, councilor: 'Shri Rakesh Dave' },
  { id: 43, name: 'Lambha', zone: 'South Zone', sla: 79, discussions: 180, councilor: 'Shri Mahendrabhai Patel' },
  { id: 44, name: 'Naroda', zone: 'North Zone', sla: 86, discussions: 295, councilor: 'Smt. Rekhaben Parmar' },
  { id: 45, name: 'Saijpur Bogha', zone: 'North Zone', sla: 83, discussions: 210, councilor: 'Shri Jitubhai Vaghela' },
  { id: 46, name: 'Noblenagar', zone: 'North Zone', sla: 84, discussions: 170, councilor: 'Shri Sanjaybhai Patel' },
  { id: 47, name: 'Meghaninagar', zone: 'North Zone', sla: 85, discussions: 220, councilor: 'Smt. Jyotiben Patel' },
  { id: 48, name: 'Hansol', zone: 'North Zone', sla: 87, discussions: 200, councilor: 'Shri Nileshbhai Dave' }
];

const CIVIC_GROUPS = [
  {
    id: 'g1',
    name: 'Green Ahmedabad',
    icon: '🌳',
    membersCount: 2420,
    category: 'Environment',
    description: 'City-wide citizen collective planting native trees & revitalizing public green patches.'
  },
  {
    id: 'g2',
    name: 'Pedestrian & Cycling Guild',
    icon: '🚴',
    membersCount: 1890,
    category: 'Mobility',
    description: 'Advocating for protected bicycle tracks, footpath safety, and car-free Sundays across 18 wards.'
  },
  {
    id: 'g3',
    name: 'Heritage Conservation Group',
    icon: '🏰',
    membersCount: 1140,
    category: 'Heritage',
    description: 'Preserving Ahmedabad\'s UNESCO Walled City pols, bird feeders (chabutras), and havelis.'
  },
  {
    id: 'g4',
    name: 'Clean Sabarmati Taskforce',
    icon: '🌊',
    membersCount: 3150,
    category: 'Waterways',
    description: 'Weekly riverbank cleanups, bio-enzyme testing, and anti-plastic river drives.'
  },
  {
    id: 'g5',
    name: 'Solar & Clean Energy Guild',
    icon: '☀️',
    membersCount: 960,
    category: 'Renewables',
    description: 'Assisting residential societies in rooftop solar subsidies, battery backup, and EV charger setups.'
  }
];

export default function ExplorePage({
  language,
  posts: externalPosts,
  onOpenReportModal,
  onSelectWard
}: ExplorePageProps) {

  // State: Posts Database
  const [explorePosts, setExplorePosts] = useState<ExplorePostItem[]>(INITIAL_EXPLORE_POSTS);

  // Selected Quick Ward Filter
  const [selectedWard, setSelectedWard] = useState<string>('All Ahmedabad');

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active City Buzz Filter
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);

  // Tab Selection
  const [activeTab, setActiveTab] = useState<'trending' | 'active' | 'recent' | 'stories'>('trending');

  // Sort Selection
  const [sortOption, setSortOption] = useState<'urgency' | 'upvotes' | 'newest' | 'comments'>('urgency');

  // Filter Drawer / Modal state
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');

  // Interactive Upvotes state (post ID -> boolean)
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});

  // Bookmarks state (post ID -> boolean)
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});

  // RSVP state for events (post ID -> boolean)
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});

  // Active Comments Modal state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Share Modal state
  const [shareModalPost, setShareModalPost] = useState<ExplorePostItem | null>(null);
  const [targetShareWard, setTargetShareWard] = useState<string>('All Ahmedabad');

  // EV Bay Reservation Modal state
  const [showEvModal, setShowEvModal] = useState<boolean>(false);
  const [selectedBay, setSelectedBay] = useState<number>(4);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM - 11:30 AM');
  const [evReservationConfirmed, setEvReservationConfirmed] = useState<boolean>(false);

  // All 48 Wards Explorer Modal state
  const [show48WardsModal, setShow48WardsModal] = useState<boolean>(false);
  const [wardSearchQuery, setWardSearchQuery] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');

  // Groups Modal state
  const [showGroupsModal, setShowGroupsModal] = useState<boolean>(false);
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({
    g1: true,
    g2: false,
    g3: false
  });

  // Civic Poll state
  const [selectedPollOption, setSelectedPollOption] = useState<'yes' | 'no' | null>(null);
  const [pollVoted, setPollVoted] = useState<boolean>(false);
  const [pollVotesCount, setPollVotesCount] = useState<number>(1280);
  const [pollYesPercent, setPollYesPercent] = useState<number>(74);

  // Create Ward Post Modal state
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostWard, setNewPostWard] = useState<string>('Navrangpura (Home)');
  const [newPostCategory, setNewPostCategory] = useState<'roads' | 'environment' | 'heritage' | 'utilities' | 'safety' | 'events'>('roads');
  const [newPostBody, setNewPostBody] = useState<string>('');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upvote Handler
  const handleUpvote = (postId: string) => {
    setExplorePosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isVoted = !!hasUpvoted[postId];
        return {
          ...post,
          upvotesCount: isVoted ? post.upvotesCount - 1 : post.upvotesCount + 1
        };
      }
      return post;
    }));

    setHasUpvoted(prev => {
      const isCurrentlyVoted = !!prev[postId];
      showToast(isCurrentlyVoted ? 'Upvote removed.' : 'Upvote added to city-wide discovery ranking!');
      return { ...prev, [postId]: !isCurrentlyVoted };
    });
  };

  // Bookmark / Track Resolution Handler
  const handleBookmarkToggle = (postId: string, title: string) => {
    setBookmarkedPosts(prev => {
      const isBookmarked = !prev[postId];
      showToast(isBookmarked ? `Subscribed to resolution updates for: ${title.slice(0, 30)}...` : 'Removed from tracked civic resolutions.');
      return { ...prev, [postId]: isBookmarked };
    });
  };

  // RSVP Toggle Handler
  const handleRsvpToggle = (postId: string) => {
    setExplorePosts(prev => prev.map(post => {
      if (post.id === postId && post.eventDetails) {
        const isRsvped = !!rsvpedEvents[postId];
        const newCount = isRsvped ? post.eventDetails.joinedCount - 1 : post.eventDetails.joinedCount + 1;
        return {
          ...post,
          eventDetails: {
            ...post.eventDetails,
            joinedCount: newCount
          }
        };
      }
      return post;
    }));

    setRsvpedEvents(prev => {
      const newState = !prev[postId];
      showToast(newState ? 'RSVP Confirmed! Event badge added to your Citizen Profile.' : 'RSVP cancelled.');
      return { ...prev, [postId]: newState };
    });
  };

  // Poll Vote Handler
  const handlePollVote = () => {
    if (!selectedPollOption) return;
    setPollVoted(true);
    setPollVotesCount(prev => prev + 1);
    if (selectedPollOption === 'yes') {
      setPollYesPercent(75);
    } else {
      setPollYesPercent(73);
    }
    showToast('Your vote was officially recorded in the Ahmedabad Cross-Area Civic Poll!');
  };

  // Group Join / Leave Handler
  const handleGroupToggle = (groupId: string, groupName: string) => {
    setJoinedGroups(prev => {
      const newState = !prev[groupId];
      showToast(newState ? `Joined ${groupName}! Circle discussions will appear in your feed.` : `Left ${groupName}`);
      return { ...prev, [groupId]: newState };
    });
  };

  // Add Comment Handler
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: 'Rahul Sharma (You)',
      role: 'Verified Citizen',
      ward: 'Ward 14 Navrangpura',
      time: 'Just now',
      avatar: avatarImg,
      text: newCommentText.trim(),
      likes: 0
    };

    setExplorePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsList: [newComment, ...post.commentsList]
        };
      }
      return post;
    }));

    setNewCommentText('');
    showToast('Your comment was published to the ward discovery forum!');
  };

  // Create Ward Post Handler
  const handleCreateWardPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    const createdPost: ExplorePostItem = {
      id: `p_${Date.now()}`,
      author: {
        name: 'Rahul Sharma (You)',
        avatar: avatarImg,
        role: 'Active Citizen Advocate',
        ward: newPostWard,
        zone: 'West Zone'
      },
      timeAgo: 'Just now',
      locationDetails: `${newPostWard} Sector`,
      badgeType: 'progress',
      badgeLabel: 'Citizen Post',
      title: newPostTitle.trim(),
      body: newPostBody.trim(),
      hashtags: [`#${newPostWard.replace(/\s+/g, '')}`, '#AhmedabadCivic'],
      category: newPostCategory,
      upvotesCount: 1,
      bookmarksCount: 0,
      commentsList: []
    };

    setExplorePosts(prev => [createdPost, ...prev]);
    setHasUpvoted(prev => ({ ...prev, [createdPost.id]: true }));
    setShowCreatePostModal(false);
    setNewPostTitle('');
    setNewPostBody('');
    showToast(`Published civic observation in ${newPostWard}!`);
  };

  // Filtered & Sorted Posts List
  const filteredPosts = useMemo(() => {
    return explorePosts.filter(post => {
      // 1. Ward Filter
      if (selectedWard !== 'All Ahmedabad') {
        const cleanSelected = selectedWard.replace(' (Home)', '').toLowerCase();
        const postWardLower = post.author.ward.toLowerCase();
        const postTitleLower = post.title.toLowerCase();
        const postBodyLower = post.body.toLowerCase();
        const postLocLower = post.locationDetails.toLowerCase();
        const matchesWard = postWardLower.includes(cleanSelected) || 
                            postTitleLower.includes(cleanSelected) || 
                            postBodyLower.includes(cleanSelected) ||
                            postLocLower.includes(cleanSelected);
        if (!matchesWard) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = post.title.toLowerCase().includes(q) ||
                             post.body.toLowerCase().includes(q) ||
                             post.author.name.toLowerCase().includes(q) ||
                             post.author.ward.toLowerCase().includes(q) ||
                             post.locationDetails.toLowerCase().includes(q) ||
                             post.hashtags.some(h => h.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 3. Active Hashtag Filter
      if (activeHashtag) {
        const matchesTag = post.hashtags.some(h => h.toLowerCase() === activeHashtag.toLowerCase()) ||
                           post.body.toLowerCase().includes(activeHashtag.toLowerCase()) ||
                           post.title.toLowerCase().includes(activeHashtag.toLowerCase());
        if (!matchesTag) return false;
      }

      // 4. Category Filter Modal
      if (filterCategory !== 'all') {
        if (post.category !== filterCategory) return false;
      }

      // 5. Status Filter Modal
      if (filterStatus !== 'all') {
        if (filterStatus === 'progress' && post.badgeType !== 'progress') return false;
        if (filterStatus === 'event' && post.badgeType !== 'event') return false;
        if (filterStatus === 'notice' && post.badgeType !== 'notice') return false;
        if (filterStatus === 'utility' && post.badgeType !== 'utility') return false;
      }

      // 6. Zone Filter Modal
      if (filterZone !== 'all') {
        if (!post.author.zone.toLowerCase().includes(filterZone.toLowerCase())) return false;
      }

      // 7. Tab Selection Filter
      if (activeTab === 'stories' && !post.isEvent && post.author.isOfficial) {
        // Tab stories prefers community events and citizen posts
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'upvotes') {
        return b.upvotesCount - a.upvotesCount;
      }
      if (sortOption === 'comments') {
        return b.commentsList.length - a.commentsList.length;
      }
      if (sortOption === 'newest') {
        return 0; // Default order is newest
      }
      // Default: Urgency & Activity (combines upvotes + comments)
      const scoreA = a.upvotesCount + (a.commentsList.length * 5) + (a.isEvent ? 50 : 0);
      const scoreB = b.upvotesCount + (b.commentsList.length * 5) + (b.isEvent ? 50 : 0);
      return scoreB - scoreA;
    });
  }, [explorePosts, selectedWard, searchQuery, activeHashtag, filterCategory, filterStatus, filterZone, activeTab, sortOption]);

  const activeCommentsPost = useMemo(() => {
    return explorePosts.find(p => p.id === activeCommentPostId);
  }, [explorePosts, activeCommentPostId]);

  const filtered48Wards = useMemo(() => {
    return ALL_48_AHMEDABAD_WARDS.filter(ward => {
      if (selectedZoneFilter !== 'all' && !ward.zone.toLowerCase().includes(selectedZoneFilter.toLowerCase())) {
        return false;
      }
      if (wardSearchQuery.trim()) {
        const q = wardSearchQuery.toLowerCase();
        return ward.name.toLowerCase().includes(q) || 
               ward.zone.toLowerCase().includes(q) || 
               ward.councilor.toLowerCase().includes(q);
      }
      return true;
    });
  }, [wardSearchQuery, selectedZoneFilter]);

  const WARD_PILLS = [
    'All Ahmedabad',
    'Navrangpura (Home)',
    'Bodakdev',
    'Maninagar',
    'Vastrapur',
    'Sabarmati',
    'Satellite',
    'Old City (Heritage)',
    'Thaltej',
    'Paldi'
  ];

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      
      {/* =========================================
          DARK EXECUTIVE DISCOVERY HEADER BANNER
          ========================================= */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
        
        {/* Subtle Background Glow Vector */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-black rounded-full flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>City-Wide Public Discovery</span>
              </span>
              <span className="text-xs text-slate-400 font-bold">• Ahmedabad Municipal Corporation (AMC)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Explore Beyond Your Ward
            </h1>

            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              Monitor civic infrastructure updates, attend inter-ward initiatives, and contribute verified observations to any of Ahmedabad's 48 administrative wards.
            </p>
          </div>

          <button
            onClick={() => setShowCreatePostModal(true)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 shrink-0 self-start md:self-center active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Post In This Area</span>
          </button>

        </div>

        {/* SEARCH BAR INSIDE HERO */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search any ward, neighborhood, or civic issue across Ahmedabad (e.g. Bodakdev, CG Road)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-400 text-xs font-semibold focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer ${
                filterCategory !== 'all' || filterStatus !== 'all' || filterZone !== 'all'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(filterCategory !== 'all' || filterStatus !== 'all' || filterZone !== 'all') && (
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => showToast(`Search updated for: ${searchQuery || selectedWard}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer"
            >
              Search Ward
            </button>
          </div>
        </div>

        {/* QUICK WARD SELECTOR PILLS */}
        <div className="space-y-2 pt-1 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400">
            <span className="uppercase tracking-wider">QUICK WARD SELECTOR</span>
            <button
              onClick={() => setShow48WardsModal(true)}
              className="text-blue-400 hover:underline cursor-pointer flex items-center space-x-1"
            >
              <span>Viewing 48 Wards Data Stream</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {WARD_PILLS.map((ward) => (
              <button
                key={ward}
                onClick={() => {
                  setSelectedWard(ward);
                  if (onSelectWard) onSelectWard(ward);
                  showToast(`Switched discovery stream to ${ward}`);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-bold cursor-pointer ${
                  selectedWard === ward
                    ? 'bg-white text-slate-900 font-black shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {ward}
              </button>
            ))}
          </div>
        </div>

      </div>


      {/* =========================================
          CITY BUZZ TICKER BAR (INTERACTIVE HASHTAGS)
          ========================================= */}
      <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-extrabold text-blue-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-blue-700 flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>CITY BUZZ:</span>
          </span>
          
          {['#SGHighwayFlyover', '#SabarmatiCleanDrive', '#BodakdevDrainage', '#VastrapurEVHub'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (activeHashtag === tag) {
                  setActiveHashtag(null);
                  showToast('Cleared hashtag filter.');
                } else {
                  setActiveHashtag(tag);
                  showToast(`Filtered by ${tag}`);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeHashtag === tag
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              {tag}
            </button>
          ))}

          {activeHashtag && (
            <button
              onClick={() => setActiveHashtag(null)}
              className="text-[11px] text-red-600 hover:underline cursor-pointer font-bold ml-1"
            >
              Clear Tag ✕
            </button>
          )}
        </div>

        <span className="text-slate-500 font-bold text-[11px]">
          • <strong className="text-slate-900">3,410</strong> active community posts across 48 AMC wards
        </span>
      </div>


      {/* =========================================
          TABS & SORT SELECTOR BAR
          ========================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'trending' ? 'bg-blue-600 text-white font-black shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Trending Across City
          </button>
          <button
            onClick={() => {
              setActiveTab('active');
              setSelectedWard('Bodakdev');
              showToast('Showing most active ward discussions.');
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'active' ? 'bg-blue-600 text-white font-black shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Most Active Wards
          </button>
          <button
            onClick={() => {
              setActiveTab('recent');
              setSortOption('newest');
              showToast('Showing recent official civic updates.');
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'recent' ? 'bg-blue-600 text-white font-black shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Recent Civic Updates
          </button>
          <button
            onClick={() => {
              setActiveTab('stories');
              showToast('Showing community event stories & drives.');
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'stories' ? 'bg-blue-600 text-white font-black shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Community Stories
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span>Sort:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-extrabold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="urgency">Urgency & Activity ∨</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="newest">Newest First</option>
            <option value="comments">Most Discussed</option>
          </select>
        </div>
      </div>


      {/* =========================================
          MAIN EXPLORE CONTENT & SIDEBAR GRID (2 COLS)
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: DISCOVERY FEED POSTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">No civic posts match your filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active issues found in {selectedWard} with query "{searchQuery}". Try clearing your filters or selecting All Ahmedabad.
              </p>
              <button
                onClick={() => {
                  setSelectedWard('All Ahmedabad');
                  setSearchQuery('');
                  setActiveHashtag(null);
                  setFilterCategory('all');
                  setFilterStatus('all');
                  setFilterZone('all');
                }}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4 hover:border-blue-200 transition-all text-left"
              >
                
                {/* Header Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-black text-xs shadow-xs">
                        AMC
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-black text-slate-900 text-sm">{post.author.name}</h3>
                        {post.author.isOfficial && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 stroke-white" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
                        <button 
                          onClick={() => {
                            setSelectedWard(post.author.ward.split(' - ')[0]);
                            showToast(`Filtered feed to ${post.author.ward}`);
                          }}
                          className="text-blue-700 font-extrabold hover:underline cursor-pointer"
                        >
                          {post.author.ward}
                        </button>
                        <span>•</span>
                        <span>{post.timeAgo} - {post.locationDetails}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className={`px-3 py-1 text-xs font-black rounded-full flex items-center space-x-1 ${
                    post.badgeType === 'progress'
                      ? 'bg-purple-50 text-purple-800 border border-purple-100'
                      : post.badgeType === 'event'
                      ? 'bg-blue-50 text-blue-800 border border-blue-100'
                      : post.badgeType === 'notice'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : post.badgeType === 'utility'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {post.badgeType === 'progress' && (
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></span>
                    )}
                    {post.badgeType === 'utility' && (
                      <Zap className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                    )}
                    <span>{post.badgeLabel}</span>
                  </span>
                </div>

                {/* Post Title & Body */}
                <div className="space-y-2">
                  <h2 className="text-base md:text-lg font-black text-slate-900 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                    {post.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.hashtags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setActiveHashtag(tag);
                          showToast(`Filtered by ${tag}`);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event Info Card Box */}
                {post.isEvent && post.eventDetails && (
                  <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md">
                        <span className="text-[9px] font-black uppercase text-blue-400">{post.eventDetails.month}</span>
                        <span className="text-lg font-black leading-none">{post.eventDetails.day}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          {post.eventDetails.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                          {post.eventDetails.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="flex -space-x-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">A</div>
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">P</div>
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">+{post.eventDetails.joinedCount - 2}</div>
                      </div>

                      <button
                        onClick={() => handleRsvpToggle(post.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer ${
                          rsvpedEvents[post.id]
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {rsvpedEvents[post.id] ? 'Joined ✓' : `RSVP · ${post.eventDetails.joinedCount} Joined`}
                      </button>
                    </div>
                  </div>
                )}

                {/* Utility Metrics 4-Grid Cards */}
                {post.isUtility && post.utilityMetrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Available Bays</span>
                      <span className="text-base font-black text-blue-700">{post.utilityMetrics.availableBays}</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Max Output</span>
                      <span className="text-base font-black text-slate-900">{post.utilityMetrics.maxOutput}</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Operating Hours</span>
                      <span className="text-base font-black text-slate-900">{post.utilityMetrics.operatingHours}</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Tariff Rate</span>
                      <span className="text-base font-black text-slate-900">{post.utilityMetrics.tariff}</span>
                    </div>
                  </div>
                )}

                {/* Photo Attachment with Geotag Overlay */}
                {post.image && (
                  <div className="relative rounded-2xl overflow-hidden h-64 border border-slate-200 bg-slate-100 group shadow-2xs">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    {post.hasMapOverlay && post.mapLabel && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{post.mapLabel}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs font-extrabold text-slate-700">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                        hasUpvoted[post.id] ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.upvotesCount} Upvotes</span>
                    </button>

                    <button 
                      onClick={() => setActiveCommentPostId(post.id)}
                      className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{post.commentsList.length} Comments</span>
                    </button>

                    <button 
                      onClick={() => setShareModalPost(post)}
                      className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-slate-400" />
                      <span>Share to Ward</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {post.googleMapsUrl && (
                      <a
                        href={post.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </a>
                    )}

                    {post.isUtility ? (
                      <button
                        onClick={() => setShowEvModal(true)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        Reserve Bay
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBookmarkToggle(post.id, post.title)}
                        className={`px-3.5 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center space-x-1 cursor-pointer ${
                          bookmarkedPosts[post.id]
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarkedPosts[post.id] ? 'fill-amber-600 text-amber-600' : 'text-slate-500'}`} />
                        <span>{bookmarkedPosts[post.id] ? 'Tracked ✓' : 'Track Resolution'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}

        </div>


        {/* RIGHT COLUMN: SIDEBAR WIDGETS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* WIDGET 1: Explore by Ward Activity */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Explore by Ward Activity</h3>
                <p className="text-[10px] text-slate-400 font-bold">Ranked by AMC SLA resolution speed 📉</p>
              </div>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-2.5">
              
              {/* Ward 1: Bodakdev */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center border border-slate-200">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Ward 8 · Bodakdev</h4>
                    <span className="text-[10px] text-slate-500 font-bold">420 Active Discussions - West</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">94% SLA</span>
                  <button 
                    onClick={() => {
                      setSelectedWard('Bodakdev');
                      showToast('Filtered feed to Ward 8 Bodakdev');
                    }}
                    className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer"
                  >
                    Explore &gt;
                  </button>
                </div>
              </div>

              {/* Ward 2: Navrangpura */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center border border-slate-200">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Ward 14 · Navrangpura</h4>
                    <span className="text-[10px] text-slate-500 font-bold">388 Active Discussions - Central-West</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">91% SLA</span>
                  <button 
                    onClick={() => {
                      setSelectedWard('Navrangpura (Home)');
                      showToast('Filtered feed to Ward 14 Navrangpura');
                    }}
                    className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer"
                  >
                    Explore &gt;
                  </button>
                </div>
              </div>

              {/* Ward 3: Maninagar */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center border border-slate-200">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Ward 32 · Maninagar</h4>
                    <span className="text-[10px] text-slate-500 font-bold">315 Active Discussions - South</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">88% SLA</span>
                  <button 
                    onClick={() => {
                      setSelectedWard('Maninagar');
                      showToast('Filtered feed to Ward 32 Maninagar');
                    }}
                    className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer"
                  >
                    Explore &gt;
                  </button>
                </div>
              </div>

              {/* Ward 4: Sabarmati */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-blue-50/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center border border-slate-200">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Ward 5 · Sabarmati</h4>
                    <span className="text-[10px] text-slate-500 font-bold">280 Active Discussions - North</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">85% SLA</span>
                  <button 
                    onClick={() => {
                      setSelectedWard('Sabarmati');
                      showToast('Filtered feed to Ward 5 Sabarmati');
                    }}
                    className="text-[10px] font-extrabold text-blue-600 hover:underline cursor-pointer"
                  >
                    Explore &gt;
                  </button>
                </div>
              </div>

            </div>

            <button 
              onClick={() => setShow48WardsModal(true)}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-100 transition-all text-center cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>View All 48 Ahmedabad Wards</span>
            </button>
          </div>


          {/* WIDGET 2: CROSS-AREA CIVIC POLL */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full uppercase">
                CROSS-AREA CIVIC POLL
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Ends in 2 days</span>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-black text-slate-900 text-sm leading-snug">
                Should AMC pedestrianize CG Road on Sunday evenings?
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Votes from all wards welcome. Proposal includes dedicated handicraft kiosks and non-motorized zones.
              </p>
            </div>

            {/* Options with Radio Selection */}
            <div className="space-y-2 text-xs font-extrabold">
              <div 
                onClick={() => {
                  if (!pollVoted) setSelectedPollOption('yes');
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedPollOption === 'yes' ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-900 font-black flex items-center space-x-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPollOption === 'yes' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                      {selectedPollOption === 'yes' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>Yes, pedestrianize</span>
                  </span>
                  <span className="text-blue-700 font-black">{pollYesPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${pollYesPercent}%` }}></div>
                </div>
              </div>

              <div 
                onClick={() => {
                  if (!pollVoted) setSelectedPollOption('no');
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedPollOption === 'no' ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-900 font-black flex items-center space-x-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedPollOption === 'no' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                      {selectedPollOption === 'no' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span>No, maintain vehicular flow</span>
                  </span>
                  <span className="text-slate-600 font-black">{100 - pollYesPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${100 - pollYesPercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-bold">
                {pollVotesCount.toLocaleString()} verified citizen votes
              </span>

              <button
                disabled={pollVoted || !selectedPollOption}
                onClick={handlePollVote}
                className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer ${
                  pollVoted
                    ? 'bg-emerald-600 text-white'
                    : selectedPollOption
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {pollVoted ? 'Voted ✓' : 'Cast Vote'}
              </button>
            </div>
          </div>


          {/* WIDGET 3: Popular Civic Groups */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">Popular Civic Groups</h3>
              <Users className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 text-xs font-semibold">
              
              {CIVIC_GROUPS.slice(0, 3).map((group) => (
                <div key={group.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                      {group.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{group.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {(group.membersCount + (joinedGroups[group.id] ? 1 : 0)).toLocaleString()} members • {group.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGroupToggle(group.id, group.name)}
                    className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      joinedGroups[group.id] ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    }`}
                  >
                    {joinedGroups[group.id] ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
              ))}

            </div>

            <button 
              onClick={() => setShowGroupsModal(true)}
              className="text-xs font-black text-blue-600 hover:underline block pt-1 cursor-pointer"
            >
              Discover More Groups →
            </button>
          </div>

        </div>

      </div>


      {/* =========================================
          MODAL 1: INTERACTIVE COMMENTS DRAWER
          ========================================= */}
      {activeCommentsPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100 max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Community Discussion ({activeCommentsPost.commentsList.length})
                </h3>
              </div>
              <button 
                onClick={() => setActiveCommentPostId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Summary Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
              <h4 className="text-xs font-black text-slate-900 truncate">
                {activeCommentsPost.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                {activeCommentsPost.author.name} • {activeCommentsPost.author.ward}
              </p>
            </div>

            {/* Comments List (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeCommentsPost.commentsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-bold">
                  No comments yet. Be the first citizen to voice your view!
                </div>
              ) : (
                activeCommentsPost.commentsList.map((comm) => (
                  <div key={comm.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={comm.avatar} 
                          alt={comm.author} 
                          className="w-6 h-6 rounded-full object-cover" 
                        />
                        <div>
                          <span className="text-xs font-black text-slate-900">{comm.author}</span>
                          {comm.role && (
                            <span className="ml-1.5 px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-black rounded-full">
                              {comm.role}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{comm.time}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed pl-8">
                      {comm.text}
                    </p>

                    <div className="flex items-center space-x-3 pl-8 pt-1 text-[11px] font-bold text-slate-500">
                      <button 
                        onClick={() => showToast('Upvoted comment!')}
                        className="hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comm.likes}</span>
                      </button>
                      <span>•</span>
                      <button 
                        onClick={() => showToast('Replying to ' + comm.author)}
                        className="hover:text-blue-600 cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input Box */}
            <div className="pt-2 border-t border-slate-100 shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add your verified observation or solution suggestion..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(activeCommentsPost.id);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={() => handleAddComment(activeCommentsPost.id)}
                  disabled={!newCommentText.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-2xl transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* =========================================
          MODAL 2: SHARE TO WARD FORUM
          ========================================= */}
      {shareModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Share Cross-Ward Update</h3>
              </div>
              <button onClick={() => setShareModalPost(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Forward this update to another AMC ward feed or civic group channel.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800">
              {shareModalPost.title}
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-extrabold text-slate-700 block">Select Destination Ward Channel:</label>
              <select
                value={targetShareWard}
                onChange={(e) => setTargetShareWard(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                {WARD_PILLS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/#explore?post=${shareModalPost.id}`);
                  showToast('Direct link copied to clipboard!');
                  setShareModalPost(null);
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Successfully forwarded post to ${targetShareWard} community circle!`);
                  setShareModalPost(null);
                }}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast to Ward</span>
              </button>
            </div>

          </div>
        </div>
      )}


      {/* =========================================
          MODAL 3: EV CHARGING BAY RESERVATION
          ========================================= */}
      {showEvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Reserve EV Charging Bay #{selectedBay}</span>
              </h3>
              <button onClick={() => setShowEvModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Vastrapur Lake Municipal Parking Hub • 120 kW CCS2 Fast Charger. Your slot will be held for 20 minutes with zero idle fee.
            </p>

            {/* Bay Selector (1 to 8) */}
            <div className="space-y-1.5 text-xs">
              <span className="font-black text-slate-700 block">Select Charging Bay:</span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(bay => {
                  const isOccupied = bay === 2 || bay === 7;
                  return (
                    <button
                      key={bay}
                      disabled={isOccupied}
                      onClick={() => setSelectedBay(bay)}
                      className={`p-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        isOccupied 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                          : selectedBay === bay
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Bay #{bay} {isOccupied ? '(Busy)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-1.5 text-xs">
              <span className="font-black text-slate-700 block">Arrival Slot:</span>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                <option>Now (Next 20 mins grace period)</option>
                <option>10:30 AM - 11:30 AM</option>
                <option>12:00 PM - 01:00 PM</option>
                <option>04:30 PM - 05:30 PM</option>
                <option>08:00 PM - 09:00 PM</option>
              </select>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1.5 text-xs font-bold text-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Tariff Rate:</span>
                <span>₹13.5 per kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hold Fee:</span>
                <span className="text-emerald-700 font-extrabold">₹0.00 (NAGAR-X Civic Pass)</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEvModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEvReservationConfirmed(true);
                  setShowEvModal(false);
                  showToast(`EV Bay #${selectedBay} successfully reserved! QR Gate Pass dispatched.`);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Confirm Slot Reservation
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================
          MODAL 4: VIEW ALL 48 AHMEDABAD WARDS DIRECTORY
          ========================================= */}
      {show48WardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100 max-h-[88vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Ahmedabad Municipal Corporation • All 48 Wards Directory
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  Browse civic SLA rankings, councilors, and filter streams by administrative jurisdiction.
                </p>
              </div>
              <button 
                onClick={() => setShow48WardsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Zone Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search ward name, zone, or councilor..."
                  value={wardSearchQuery}
                  onChange={(e) => setWardSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none"
              >
                <option value="all">All Zones</option>
                <option value="West">West Zone</option>
                <option value="Central">Central Zone</option>
                <option value="North">North Zone</option>
                <option value="South">South Zone</option>
                <option value="East">East Zone</option>
                <option value="New West">New West Zone</option>
              </select>
            </div>

            {/* Wards Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filtered48Wards.map(ward => (
                <div 
                  key={ward.id}
                  className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-2xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white text-slate-900 rounded-xl font-black text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                      {ward.id}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{ward.name}</h4>
                      <div className="text-[10px] text-slate-500 font-bold flex items-center space-x-2">
                        <span className="text-blue-700 font-extrabold">{ward.zone}</span>
                        <span>•</span>
                        <span>Councilor: {ward.councilor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <div>
                      <span className="text-xs font-black text-emerald-600 block">{ward.sla}% SLA</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{ward.discussions} reports</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedWard(ward.name.split(' (')[0]);
                        setShow48WardsModal(false);
                        showToast(`Filtered discovery feed to ${ward.name}`);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      Filter Feed
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}


      {/* =========================================
          MODAL 5: ADVANCED FILTER DRAWER
          ========================================= */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Discovery Stream Filters</h3>
              </div>
              <button onClick={() => setShowFilterModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Civic Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                <option value="all">All Civic Categories</option>
                <option value="roads">Roads & Transport</option>
                <option value="environment">Cleanliness & Environment</option>
                <option value="heritage">Heritage & Old City</option>
                <option value="utilities">Smart Utilities & EV</option>
                <option value="safety">Public Safety & Lighting</option>
                <option value="events">Community Drives & Events</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Publication Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="progress">AMC In-Progress Works</option>
                <option value="event">Community Events & Drives</option>
                <option value="notice">Official Municipal Notices</option>
                <option value="utility">City Utilities & EV Hubs</option>
              </select>
            </div>

            {/* Zone Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">AMC Zone:</label>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                <option value="all">All Ahmedabad Zones</option>
                <option value="West">West Zone</option>
                <option value="South">South Zone</option>
                <option value="Central">Central Zone</option>
                <option value="North">North Zone</option>
                <option value="East">East Zone</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setFilterCategory('all');
                  setFilterStatus('all');
                  setFilterZone('all');
                  showToast('Filters reset to default.');
                }}
                className="text-xs font-black text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowFilterModal(false);
                  showToast('Applied custom filters to feed.');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}


      {/* =========================================
          MODAL 6: CREATE POST IN WARD MODAL
          ========================================= */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleCreateWardPost}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Post In Any Ahmedabad Ward</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreatePostModal(false)} 
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Select Target Ward:</label>
              <select
                value={newPostWard}
                onChange={(e) => setNewPostWard(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                {WARD_PILLS.filter(w => w !== 'All Ahmedabad').map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Civic Category:</label>
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                <option value="roads">Roads, Footpaths & Traffic</option>
                <option value="environment">Cleanliness & Waste Management</option>
                <option value="heritage">Heritage & Pol Architecture</option>
                <option value="utilities">Water, EV & Smart Utilities</option>
                <option value="safety">Public Safety & Lighting</option>
                <option value="events">Community Event / Cleanliness Drive</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Post Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Volunteer tree plantation near Vastrapur amphitheatre..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-extrabold text-slate-700 block">Description & Details:</label>
              <textarea
                required
                rows={3}
                placeholder="Provide accurate location landmarks, timing, or civic context..."
                value={newPostBody}
                onChange={(e) => setNewPostBody(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreatePostModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Publish Ward Post
              </button>
            </div>

          </form>
        </div>
      )}


      {/* =========================================
          MODAL 7: POPULAR CIVIC GROUPS DIRECTORY
          ========================================= */}
      {showGroupsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 text-left space-y-4 border border-slate-100 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-black text-slate-900 text-base">Ahmedabad Citizen Circles & Guilds</h3>
                <p className="text-[11px] text-slate-500 font-bold">Join neighborhood collectives working across civic improvement sectors.</p>
              </div>
              <button onClick={() => setShowGroupsModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {CIVIC_GROUPS.map(group => (
                <div key={group.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs">{group.name}</h4>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {(group.membersCount + (joinedGroups[group.id] ? 1 : 0)).toLocaleString()} members • {group.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGroupToggle(group.id, group.name)}
                      className={`px-3.5 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                        joinedGroups[group.id] ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {joinedGroups[group.id] ? 'Joined ✓' : 'Join Guild'}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium">
                    {group.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}


      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <Globe className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
