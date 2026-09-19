import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Plus, CheckCircle2, Clock, ShieldCheck, 
  Search, Filter, ChevronDown, MapPin, Truck, AlertTriangle, 
  Phone, Mail, Calendar, User, Download, RefreshCw, Star, 
  Check, ArrowRight, ExternalLink, ShieldAlert, Award, X,
  Building, Wrench, Info, Zap, MessageSquare, Share2, Copy,
  CheckCheck, Droplets, Sparkles, AlertCircle, Eye, Printer
} from 'lucide-react';
import { Language, Post, Ticket, UserProfile } from '../types';

// Import images
import potholeImg from '../assets/images/pothole_repaired_after_1789742513449.jpg';
import wireImg from '../assets/images/evidence_wire_hazard_1789743199289.jpg';
import wasteBeforeImg from '../assets/images/evidence_waste_spillage_1789743181414.jpg';
import wasteAfterImg from '../assets/images/evidence_resolved_cleaned_1789744521770.jpg';
import avatarImg from '../assets/images/rahul_sharma_avatar_1789742493368.jpg';

export interface ReportItem {
  id: string;
  ticketId: string;
  title: string;
  category: string;
  ward: string;
  location: string;
  reportedAt: string;
  timestamp: number;
  priority: 'Critical' | 'High Priority' | 'Medium Priority' | 'Standard Priority';
  status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'action_required';
  statusLabel: string;
  department: string;
  assignedOfficer: string;
  officerRole: string;
  officerPhone?: string;
  description: string;
  liveUpdate?: string;
  photoUrl?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  gpsVerified: boolean;
  slaTurnaround?: string;
  signedBy?: string;
  validationCount?: number;
  userRating?: number;
  milestones: {
    step1: { title: string; subtitle: string; completed: boolean; current?: boolean };
    step2: { title: string; subtitle: string; completed: boolean; current?: boolean };
    step3: { title: string; subtitle: string; completed: boolean; current?: boolean };
    step4: { title: string; subtitle: string; completed: boolean; current?: boolean };
  };
  auditTrail: { time: string; text: string; actor: string }[];
}

// Initial realistic seed reports for the logged-in user Rahul Sharma
const INITIAL_USER_REPORTS: ReportItem[] = [
  {
    id: '#NX-10482',
    ticketId: '#NX-10482',
    title: 'Severe Road Pothole & Caved Asphalt on HL College Crossroad',
    category: 'Roads & Traffic',
    ward: 'Ward 14 Navrangpura',
    location: 'Opposite HL Commerce College, Navrangpura, Ahmedabad',
    reportedAt: 'Today, 09:15 AM',
    timestamp: Date.now() - 3600 * 1000 * 4,
    priority: 'High Priority',
    status: 'in_progress',
    statusLabel: 'Field Crew Active',
    department: 'Ward 14 Civil Roads Dept',
    assignedOfficer: 'JE Officer Dave',
    officerRole: 'Junior Engineer (Civil Infrastructure)',
    officerPhone: '+91 98795 24101',
    description: 'Deep hazardous caved crater asphalt right in front of HL College gate causing severe traffic choking and 2-wheeler skidding risk during peak college rush.',
    liveUpdate: 'Asphalt patching truck Unit 4B on site. Hot mix bitumen leveling underway. Estimated completion in 2 hours.',
    photoUrl: potholeImg,
    gpsVerified: true,
    milestones: {
      step1: { title: 'Reported', subtitle: 'Today, 09:15 AM', completed: true },
      step2: { title: 'Ward Inspected', subtitle: '11:30 AM by Officer Dave', completed: true },
      step3: { title: 'Crew Dispatched', subtitle: 'Target Fix: Today 17:00 IST', completed: false, current: true },
      step4: { title: 'Resolution Sign-off', subtitle: 'Citizen Verification', completed: false }
    },
    auditTrail: [
      { time: 'Today 09:15 AM', text: 'Ticket logged via Nagar-X Mobile with Geotag & AI photo diagnosis.', actor: 'Rahul Sharma (Citizen)' },
      { time: 'Today 10:05 AM', text: 'AI auto-routed to West Zone Ward 14 Road Maintenance Division.', actor: 'Nagar-X AI Triage' },
      { time: 'Today 11:30 AM', text: 'Physical site validation by JE Officer Dave. Pothole depth measured at 14cm. Work order #WO-492 issued.', actor: 'JE Officer Dave' },
      { time: 'Today 01:15 PM', text: 'Asphalt crew Unit 4B dispatched with road roller & cold-patch bitumen mix.', actor: 'AMC Roads Dispatch Desk' }
    ]
  },
  {
    id: '#NX-10490',
    ticketId: '#NX-10490',
    title: 'Streetlight Array Failure & Exposed Wire (Poles #NW-89 to #NW-92)',
    category: 'Streetlights & Electrical',
    ward: 'Ward 14 Navrangpura',
    location: 'Vastrapur Lake Outer Jogging Track, Ahmedabad',
    reportedAt: 'Yesterday, 06:40 PM',
    timestamp: Date.now() - 3600 * 1000 * 24,
    priority: 'Medium Priority',
    status: 'in_progress',
    statusLabel: 'Parts Requisitioned',
    department: 'Torrent Power / Streetlight Cell',
    assignedOfficer: 'JE R. Parmar',
    officerRole: 'Junior Engineer (Electrical Maintenance)',
    officerPhone: '+91 98795 38210',
    description: 'Continuous 4 LED streetlight poles dark on jogging track. Junction box loose hanging with open bare wire risk for morning runners and children.',
    liveUpdate: 'Emergency night patrol cordoned loose wires safely. 4 replacement 90W LED luminaires requisitioned from AMC central depot.',
    photoUrl: wireImg,
    gpsVerified: true,
    milestones: {
      step1: { title: 'Reported', subtitle: 'Yesterday 18:40', completed: true },
      step2: { title: 'Safety Cordoned', subtitle: 'Night patrol squad', completed: true },
      step3: { title: 'Luminaires Ordered', subtitle: 'Dispatch ETA 12h', completed: false, current: true },
      step4: { title: 'Restored', subtitle: 'Awaiting Sign-off', completed: false }
    },
    auditTrail: [
      { time: 'Yesterday 06:40 PM', text: 'Citizen report logged with night GPS coordinates.', actor: 'Rahul Sharma (Citizen)' },
      { time: 'Yesterday 08:15 PM', text: 'Night emergency squad insulated exposed wires and installed caution cones.', actor: 'Torrent Emergency Crew' },
      { time: 'Today 09:00 AM', text: 'Requisition order #ELE-882 approved for 4 new IP66 LED fixtures.', actor: 'JE R. Parmar' }
    ]
  },
  {
    id: '#NX-10505',
    ticketId: '#NX-10505',
    title: 'Drinking Water Pipeline Leakage & Pressure Loss at Swastik Crossroad',
    category: 'Water Supply & Pipelines',
    ward: 'Ward 14 Navrangpura',
    location: 'Near Swastik Char Rasta, CG Road, Navrangpura',
    reportedAt: '2 Days Ago, 08:30 AM',
    timestamp: Date.now() - 3600 * 1000 * 48,
    priority: 'High Priority',
    status: 'action_required',
    statusLabel: 'Action Required: Citizen Co-Verification',
    department: 'AMC Water Supply & Sewerage Board',
    assignedOfficer: 'AE Suresh Prajapati',
    officerRole: 'Assistant Engineer (Water Works)',
    officerPhone: '+91 98251 12940',
    description: 'Main potable water supply pipe flange leaking clean water onto sidewalk causing muddy puddles and low water pressure in adjacent apartments.',
    liveUpdate: 'Municipal water squad replaced rubber gasket and welded steel sleeve. System repressurized. Please inspect and co-verify resolution.',
    photoUrl: potholeImg,
    gpsVerified: true,
    milestones: {
      step1: { title: 'Reported', subtitle: '2 Days Ago', completed: true },
      step2: { title: 'Hydraulic Test', subtitle: 'Inspected by AE Suresh', completed: true },
      step3: { title: 'Pipeline Repaired', subtitle: 'Sleeve welded', completed: true },
      step4: { title: 'Citizen Sign-off', subtitle: 'Pending Your Review', completed: false, current: true }
    },
    auditTrail: [
      { time: '2 Days Ago 08:30 AM', text: 'Reported by citizen with GPS location.', actor: 'Rahul Sharma (Citizen)' },
      { time: 'Yesterday 02:00 PM', text: 'AMC water squad isolated leak zone and fitted high-pressure sleeve.', actor: 'AE Suresh Prajapati' },
      { time: 'Today 10:00 AM', text: 'Water line turned back on. Marked ready for citizen co-verification.', actor: 'AMC Water Works Desk' }
    ]
  },
  {
    id: '#NX-10312',
    ticketId: '#NX-10312',
    title: 'Commercial Green Waste Overflow & Blocked Pedestrian Walkway',
    category: 'Green Waste & Sanitation',
    ward: 'Ward 14 Navrangpura',
    location: 'Behind Gulmohar Park Mall, Satellite, Ahmedabad',
    reportedAt: 'Oct 18, 2024, 02:20 PM',
    timestamp: Date.now() - 3600 * 1000 * 24 * 10,
    priority: 'Medium Priority',
    status: 'resolved',
    statusLabel: 'Resolved & Verified',
    department: 'AMC Solid Waste Management Cell',
    assignedOfficer: 'Sanitary Inspector H. Mehta',
    officerRole: 'Sanitary Inspector (West Zone)',
    officerPhone: '+91 98791 44550',
    description: 'Tree trimmings and discarded commercial horticulture green waste blocking footpath and spilling into roadway lane.',
    slaTurnaround: '22 hr Turnaround (SLA Met)',
    signedBy: 'Sanitary Inspector H. Mehta',
    validationCount: 16,
    userRating: 5,
    beforePhotoUrl: wasteBeforeImg,
    afterPhotoUrl: wasteAfterImg,
    gpsVerified: true,
    milestones: {
      step1: { title: 'Reported', subtitle: 'Oct 18, 14:20', completed: true },
      step2: { title: 'Inspector Triage', subtitle: 'Oct 18, 16:00', completed: true },
      step3: { title: 'Compactor Cleared', subtitle: 'Oct 19, 11:30', completed: true },
      step4: { title: 'Citizen Verified', subtitle: 'Oct 19, 12:45', completed: true }
    },
    auditTrail: [
      { time: 'Oct 18 02:20 PM', text: 'Reported with citizen photographic proof.', actor: 'Rahul Sharma (Citizen)' },
      { time: 'Oct 18 04:00 PM', text: 'Sanitary Inspector H. Mehta assigned waste removal task order.', actor: 'AMC Solid Waste Desk' },
      { time: 'Oct 19 11:30 AM', text: 'Hydraulic tipper truck #GJ-01-CZ-8120 hauled 2.4 tonnes of green waste to composting plant.', actor: 'Field Clean Squad' },
      { time: 'Oct 19 12:45 PM', text: 'Citizen verified before/after photo evidence and gave 5-star rating.', actor: 'Rahul Sharma (Citizen)' }
    ]
  },
  {
    id: '#NX-10188',
    ticketId: '#NX-10188',
    title: 'Monsoon Drain Grate Blockage and Heavy Silt Removal',
    category: 'Drainage & Monsoon',
    ward: 'Ward 14 Navrangpura',
    location: 'Commerce Six Road Drainage Junction, Navrangpura',
    reportedAt: 'Oct 11, 2024, 11:15 AM',
    timestamp: Date.now() - 3600 * 1000 * 24 * 18,
    priority: 'Standard Priority',
    status: 'resolved',
    statusLabel: 'Archived & Verified',
    department: 'AMC Stormwater Drainage Cell',
    assignedOfficer: 'Assistant Engineer V. Solanki',
    officerRole: 'Assistant Engineer (Stormwater Management)',
    officerPhone: '+91 98254 77810',
    description: 'Catch basin clogged with leaves, plastic bottles, and thick silt causing heavy rainwater stagnation during brief spells.',
    slaTurnaround: '48 hr Turnaround',
    signedBy: 'Assistant Engineer V. Solanki',
    validationCount: 24,
    userRating: 5,
    photoUrl: potholeImg,
    gpsVerified: true,
    milestones: {
      step1: { title: 'Reported', subtitle: 'Oct 11, 11:15', completed: true },
      step2: { title: 'Ward Inspected', subtitle: 'Oct 11, 15:00', completed: true },
      step3: { title: 'Suction Cleaning', subtitle: 'Oct 12, 10:00', completed: true },
      step4: { title: 'Flow Verified', subtitle: 'Oct 13, 09:00', completed: true }
    },
    auditTrail: [
      { time: 'Oct 11 11:15 AM', text: 'Logged by citizen before monsoon alert.', actor: 'Rahul Sharma (Citizen)' },
      { time: 'Oct 12 10:00 AM', text: 'Super suction tanker Unit 2 flushed drain line and removed silt cake.', actor: 'AMC Drainage Crew' },
      { time: 'Oct 13 09:00 AM', text: 'Chamber open inspection verified 100% flow restored. Ticket closed.', actor: 'AE V. Solanki' }
    ]
  }
];

interface MyReportsPageProps {
  language: Language;
  posts?: Post[];
  userTickets?: Ticket[];
  currentUser?: UserProfile;
  onOpenReportModal: () => void;
  onViewMap?: () => void;
  onViewAuditPost?: (post: Post) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({
  language,
  posts = [],
  userTickets = [],
  currentUser = {
    name: 'Rahul Sharma',
    handle: 'rahul_ahd',
    phone: '9876543210',
    ward: 'Ward 14 • Navrangpura',
    civicScore: 480,
    level: 'Level 3 City Guardian',
    ptsToNextLevel: 20,
    reportedCount: 18,
    resolvedCount: 15,
    upvotesReceived: 142,
    avatarUrl: avatarImg
  },
  onOpenReportModal,
  onViewMap
}) => {
  // Main filter tabs
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved' | 'action'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [timeFilter, setTimeFilter] = useState('All Time');

  // Interactive user reports state (persisted during session, seeded with initial user data)
  const [userReports, setUserReports] = useState<ReportItem[]>(INITIAL_USER_REPORTS);

  // Sync new user-created reports from props (from userTickets & posts created by user)
  useEffect(() => {
    // 1. Convert userTickets into ReportItems if not already present
    const newReportsFromTickets: ReportItem[] = userTickets.map((t, idx) => {
      const isResolved = t.status === 'resolved';
      return {
        id: t.id.startsWith('#') ? t.id : `#${t.id}`,
        ticketId: t.id.startsWith('#') ? t.id : `#${t.id}`,
        title: t.description.slice(0, 70) + (t.description.length > 70 ? '...' : ''),
        category: t.category || 'Roads & Traffic',
        ward: t.ward || 'Ward 14 Navrangpura',
        location: `${t.ward || 'Ward 14 Navrangpura'}, Ahmedabad`,
        reportedAt: t.reportedAt || 'Just now',
        timestamp: Date.now() - idx * 1000,
        priority: 'High Priority',
        status: isResolved ? 'resolved' : 'under_review',
        statusLabel: isResolved ? 'Resolved & Verified' : 'Under Ward Desk Triage',
        department: t.category === 'Streetlights' ? 'Torrent Power / Streetlight Cell' :
                    t.category === 'Garbage' || t.category === 'Sanitation' ? 'AMC Solid Waste Management' :
                    t.category === 'Water' ? 'AMC Water Supply Board' : 'Ward 14 Civil Roads Dept',
        assignedOfficer: 'Ward 14 Duty Officer',
        officerRole: 'Junior Engineer On-Duty',
        officerPhone: '+91 98795 00014',
        description: t.description,
        liveUpdate: 'Geo-tagged ticket verified by AI diagnostic engine. Work order generated for field inspection.',
        photoUrl: t.photoUrl || potholeImg,
        gpsVerified: !!t.gpsLocation,
        milestones: {
          step1: { title: 'Reported', subtitle: t.reportedAt || 'Just now', completed: true },
          step2: { title: 'Ward Triage', subtitle: 'AI Routing Active', completed: true },
          step3: { title: 'Crew Assignment', subtitle: 'Queue Priority High', completed: false, current: !isResolved },
          step4: { title: 'Resolution Sign-off', subtitle: 'Citizen Verification', completed: isResolved }
        },
        auditTrail: [
          { time: t.reportedAt || 'Just now', text: `Report submitted by ${t.reporterName} via Citizen Portal.`, actor: t.reporterName },
          { time: 'Just now', text: `AI Vision matched category: ${t.category}. Priority set to High.`, actor: 'Nagar-X Core Engine' }
        ]
      };
    });

    // 2. Convert posts that were authored by the user into reports
    const userAuthoredPosts = posts.filter(p => 
      p.authorName === 'Rahul Sharma' || 
      p.authorHandle === '@rahul_ahd' || 
      p.authorName === 'Anonymous Citizen' ||
      (p.ticketId && p.ticketId.startsWith('#NX'))
    );

    const newReportsFromPosts: ReportItem[] = userAuthoredPosts.map((p, idx) => {
      const ticketId = p.ticketId || `#NX-${10500 + idx}`;
      const isResolved = !!p.isResolved;
      return {
        id: ticketId,
        ticketId: ticketId,
        title: p.content.split('\n')[0].replace(/^[🚨📍\s*]+/, '').slice(0, 75) || 'Civic Issue Report',
        category: p.imageTag || 'Roads & Traffic',
        ward: p.authorWard || 'Ward 14 Navrangpura',
        location: `${p.authorWard || 'Ward 14 Navrangpura'}, Ahmedabad`,
        reportedAt: p.timeAgo || 'Just now',
        timestamp: Date.now() - (idx + 1) * 2000,
        priority: (p.priority as any) || 'High Priority',
        status: isResolved ? 'resolved' : 'in_progress',
        statusLabel: isResolved ? 'Resolved & Verified' : 'Under Ward Desk Triage',
        department: 'Ward 14 Zonal Engineering Cell',
        assignedOfficer: p.resolvedByOfficer || 'Ward 14 Duty Officer',
        officerRole: 'Junior Engineer On-Duty',
        officerPhone: '+91 98795 00014',
        description: p.content,
        liveUpdate: p.isResolved 
          ? `Resolution signed off: ${p.resolutionRemarks || 'Repaired and verified.'}`
          : 'Ticket active on AMC municipal dashboard. Assigned to local response unit.',
        photoUrl: p.imageUrl || p.beforeImageUrl || potholeImg,
        beforePhotoUrl: p.beforeImageUrl,
        afterPhotoUrl: p.afterImageUrl,
        gpsVerified: true,
        userRating: isResolved ? 5 : undefined,
        milestones: {
          step1: { title: 'Reported', subtitle: p.timeAgo || 'Just now', completed: true },
          step2: { title: 'Ward Inspected', subtitle: 'Inspection Verified', completed: true },
          step3: { title: 'Field Action', subtitle: isResolved ? 'Work Done' : 'In Progress', completed: isResolved, current: !isResolved },
          step4: { title: 'Resolution Sign-off', subtitle: isResolved ? 'Citizen Verified' : 'Pending', completed: isResolved }
        },
        auditTrail: [
          { time: p.timeAgo || 'Just now', text: 'Report published to Ward Feed and Civic Desk.', actor: 'Rahul Sharma' }
        ]
      };
    });

    setUserReports(prev => {
      const combined = [...prev];
      // Merge unique by ticketId
      [...newReportsFromTickets, ...newReportsFromPosts].forEach(item => {
        const existingIdx = combined.findIndex(r => r.ticketId === item.ticketId || r.id === item.id);
        if (existingIdx >= 0) {
          // Update existing with any fresh data
          combined[existingIdx] = { ...combined[existingIdx], ...item };
        } else {
          // Prepend new report to top
          combined.unshift(item);
        }
      });
      return combined;
    });
  }, [userTickets, posts]);

  // Modal & Interactive states
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<ReportItem | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState<ReportItem | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<ReportItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; icon: 'call' | 'check' | 'copy' } | null>(null);
  const [recurringReason, setRecurringReason] = useState('Issue has resurfaced / incomplete fix on site');
  const [recurringNotes, setRecurringNotes] = useState('');
  
  // Supplementary note state in details modal
  const [newAuditNote, setNewAuditNote] = useState('');

  // Meeting Form state
  const [meetingDate, setMeetingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [meetingTime, setMeetingTime] = useState('10:00 AM - 11:00 AM');
  const [meetingReason, setMeetingReason] = useState('Discussion on Road Infrastructure & Streetlights in Ward 14');
  const [meetingOfficer, setMeetingOfficer] = useState('JE Officer Dave (Civil Roads)');
  const [meetingConfirmed, setMeetingConfirmed] = useState(false);

  // Helper toast trigger
  const showToast = (title: string, subtitle?: string, icon: 'call' | 'check' | 'copy' = 'check') => {
    setToastMessage({ title, subtitle, icon });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // 1. Request call from Junior Engineer
  const handleRequestCall = (officer: string, ticketId: string) => {
    showToast(
      `Call Request Placed with ${officer}`,
      `AMC Ward 14 Desk has notified the engineer for Ticket ${ticketId}. Expect a callback within 30 minutes.`,
      'call'
    );
  };

  // 2. Co-verify / Rate an issue
  const handleRateIssue = (ticketId: string, rating: number) => {
    setUserReports(prev => prev.map(report => {
      if (report.ticketId === ticketId) {
        return {
          ...report,
          userRating: rating,
          status: 'resolved',
          statusLabel: 'Citizen Verified & Closed',
          milestones: {
            ...report.milestones,
            step4: { title: 'Citizen Verified', subtitle: `${rating} ★ Rating Submitted`, completed: true }
          },
          auditTrail: [
            ...report.auditTrail,
            { time: 'Just now', text: `Citizen co-verified resolution and provided a ${rating}-star rating.`, actor: 'Rahul Sharma (Citizen)' }
          ]
        };
      }
      return report;
    }));

    if (selectedTicketForDetails?.ticketId === ticketId) {
      setSelectedTicketForDetails(prev => prev ? {
        ...prev,
        userRating: rating,
        status: 'resolved',
        statusLabel: 'Citizen Verified & Closed'
      } : null);
    }

    showToast(
      'Citizen Verification Registered!',
      `Thank you! Your ${rating}-star feedback and co-signature have been recorded for ${ticketId}.`,
      'check'
    );
  };

  // 3. Escalate / Report Recurring Issue
  const handleConfirmRecurringEscalation = () => {
    if (!showRecurringModal) return;
    const tId = showRecurringModal.ticketId;
    
    setUserReports(prev => prev.map(r => {
      if (r.ticketId === tId) {
        return {
          ...r,
          status: 'in_progress',
          statusLabel: 'Reopened: Priority Supervisor Review',
          priority: 'Critical',
          liveUpdate: `Escalated by citizen: "${recurringReason}". Assigned to Ward 14 Zonal Supervisor for emergency site visit.`,
          auditTrail: [
            ...r.auditTrail,
            { time: 'Just now', text: `Recurring issue escalation filed: ${recurringReason}. Notes: ${recurringNotes || 'None'}`, actor: 'Rahul Sharma (Citizen)' }
          ]
        };
      }
      return r;
    }));

    setShowRecurringModal(null);
    setRecurringNotes('');
    showToast(
      `Ticket ${tId} Escalated!`,
      `Flagged for urgent supervisor inspection. SMS alert dispatched to Ward 14 Executive Engineer.`,
      'check'
    );
  };

  // 4. Add supplementary citizen note to audit trail
  const handleAddAuditNote = (ticketId: string) => {
    if (!newAuditNote.trim()) return;
    const noteText = newAuditNote.trim();
    setUserReports(prev => prev.map(r => {
      if (r.ticketId === ticketId) {
        const updated = {
          ...r,
          auditTrail: [
            ...r.auditTrail,
            { time: 'Just now', text: noteText, actor: 'Rahul Sharma (Citizen Note)' }
          ]
        };
        if (selectedTicketForDetails?.ticketId === ticketId) {
          setSelectedTicketForDetails(updated);
        }
        return updated;
      }
      return r;
    }));
    setNewAuditNote('');
    showToast('Citizen Note Added', 'Your comment has been attached to the official AMC ticket file.', 'check');
  };

  // 5. Copy ticket share link
  const handleCopyTicketLink = (ticketId: string) => {
    navigator.clipboard?.writeText?.(window.location.origin + `?ticket=${ticketId.replace('#', '')}`);
    showToast('Ticket Link Copied', `Direct tracking link for ${ticketId} copied to clipboard.`, 'copy');
  };

  // 6. Dynamic Stats Computations
  const stats = useMemo(() => {
    const total = userReports.length;
    const inProgress = userReports.filter(r => r.status === 'in_progress').length;
    const underReview = userReports.filter(r => r.status === 'under_review' || r.status === 'pending').length;
    const actionRequired = userReports.filter(r => r.status === 'action_required').length;
    const resolved = userReports.filter(r => r.status === 'resolved').length;
    const satisfaction = resolved > 0 ? 94 : 100;

    return { total, inProgress, underReview, actionRequired, resolved, satisfaction };
  }, [userReports]);

  // 7. Filtered Reports calculation
  const filteredReports = useMemo(() => {
    return userReports.filter(report => {
      // Tab filter
      if (activeTab === 'active' && !(report.status === 'in_progress' || report.status === 'under_review' || report.status === 'pending')) {
        return false;
      }
      if (activeTab === 'resolved' && report.status !== 'resolved') {
        return false;
      }
      if (activeTab === 'action' && report.status !== 'action_required') {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All Categories') {
        if (!report.category.toLowerCase().includes(categoryFilter.toLowerCase().replace(/&|\s+/g, ' ').split(' ')[0])) {
          return false;
        }
      }

      // Time filter
      if (timeFilter === 'Past 30 Days') {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
        if (report.timestamp < thirtyDaysAgo) return false;
      } else if (timeFilter === 'Past 60 Days') {
        const sixtyDaysAgo = Date.now() - 60 * 24 * 3600 * 1000;
        if (report.timestamp < sixtyDaysAgo) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = report.ticketId.toLowerCase().includes(q) || report.id.toLowerCase().includes(q);
        const matchesTitle = report.title.toLowerCase().includes(q);
        const matchesLocation = report.location.toLowerCase().includes(q);
        const matchesDept = report.department.toLowerCase().includes(q);
        const matchesDesc = report.description.toLowerCase().includes(q);
        const matchesOfficer = report.assignedOfficer.toLowerCase().includes(q);

        if (!matchesId && !matchesTitle && !matchesLocation && !matchesDept && !matchesDesc && !matchesOfficer) {
          return false;
        }
      }

      return true;
    });
  }, [userReports, activeTab, categoryFilter, timeFilter, searchQuery]);

  return (
    <div className="space-y-6 text-left pb-16">
      
      {/* =========================================================================
          GLOBAL TOAST NOTIFICATION
          ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start space-x-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 max-w-md">
          {toastMessage.icon === 'call' && <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />}
          {toastMessage.icon === 'check' && <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
          {toastMessage.icon === 'copy' && <CheckCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />}
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
          TOP DASHBOARD HEADER BANNER
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>WARD 14 NAVRANGPURA CITIZEN DESK</span>
            </span>
            <span className="text-xs font-medium text-slate-400">• Authenticated Citizen: {currentUser.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowPdfModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download History (PDF)</span>
            </button>

            <button 
              onClick={onOpenReportModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Civic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl font-medium leading-relaxed">
            Real-time tracking of all civic issues logged by you. Track municipal triage, ward engineer assignments, field squad dispatches, and sign off official resolutions.
          </p>
        </div>

        {/* 4 STAT METRIC CARDS (DYNAMICALLY COMPUTED) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          
          {/* Total Reported */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5 hover:bg-slate-100/60 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                TOTAL REPORTED
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                <span className="text-[11px] font-semibold text-slate-500">Your Logs</span>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5 hover:bg-slate-100/60 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                IN PROGRESS
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{stats.inProgress}</span>
                <span className="text-[11px] font-bold text-amber-600">Crews on-site</span>
              </div>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5 hover:bg-slate-100/60 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                UNDER REVIEW
              </span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{stats.underReview}</span>
                <span className="text-[11px] font-semibold text-slate-500">Ward inspection</span>
              </div>
            </div>
          </div>

          {/* Resolved & Verified */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60 flex items-center space-x-3.5 hover:bg-slate-100/60 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                RESOLVED & VERIFIED
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">{stats.resolved}</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800 border border-emerald-200/50">
                  <span>Closed</span>
                  <span className="font-bold">👍 {stats.satisfaction}%</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          FILTER TABS, SEARCH & DROPDOWNS
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        
        {/* Filter Pills with dynamic counts */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>All Reports</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {stats.total}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'active' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>Active & In-Progress</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {stats.inProgress + stats.underReview}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'resolved' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>Resolved</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'resolved' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {stats.resolved}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('action')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'action' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>Action Required</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${stats.actionRequired > 0 ? 'bg-rose-500 text-white font-black animate-pulse' : 'bg-slate-200 text-slate-700'}`}>
                {stats.actionRequired}
              </span>
            </button>
          </div>

          {(searchQuery || categoryFilter !== 'All Categories' || timeFilter !== 'All Time') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All Categories');
                setTimeFilter('All Time');
              }}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Search & Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ticket ID (e.g. #NX-10482), keywords, location, or department..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option>All Categories</option>
              <option>Roads & Traffic</option>
              <option>Streetlights & Electrical</option>
              <option>Green Waste & Sanitation</option>
              <option>Drainage & Monsoon</option>
              <option>Water Supply & Pipelines</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option>All Time</option>
              <option>Past 30 Days</option>
              <option>Past 60 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN TWO-COLUMN LAYOUT: CARDS (8 COLS), SIDEBAR (4 COLS)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TICKET REPORT CARDS (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">No matching reports found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No civic reports match your active filter or search query. Try broadening your criteria or submit a new report.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                    setCategoryFilter('All Categories');
                    setTimeFilter('All Time');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold hover:bg-slate-200 transition-all"
                >
                  View All Reports ({userReports.length})
                </button>
                <button
                  onClick={onOpenReportModal}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 transition-all shadow-xs"
                >
                  Report New Issue
                </button>
              </div>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isResolved = report.status === 'resolved';
              const isActionRequired = report.status === 'action_required';
              const isInProgress = report.status === 'in_progress';
              const isUnderReview = report.status === 'under_review' || report.status === 'pending';

              return (
                <div 
                  key={report.id} 
                  className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-5 ${
                    isActionRequired ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200/90'
                  }`}
                >
                  
                  {/* Card Badges Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center bg-slate-100 px-2.5 py-1 rounded-full text-xs font-black text-slate-800 space-x-1">
                        <span>{report.ticketId}</span>
                        <button 
                          onClick={() => handleCopyTicketLink(report.ticketId)}
                          title="Copy direct ticket URL"
                          className="text-slate-400 hover:text-slate-700 ml-1"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Priority Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center space-x-1 ${
                        report.priority === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        report.priority === 'High Priority' ? 'bg-rose-50 text-rose-700 border-rose-200/60' :
                        report.priority === 'Medium Priority' ? 'bg-amber-50 text-amber-800 border-amber-200/60' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          report.priority === 'Critical' || report.priority === 'High Priority' ? 'bg-rose-500 animate-pulse' :
                          report.priority === 'Medium Priority' ? 'bg-amber-500' : 'bg-slate-400'
                        }`}></span>
                        <span>{report.priority}</span>
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center space-x-1 ${
                        isResolved ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                        isActionRequired ? 'bg-rose-50 text-rose-700 border-rose-200/80' :
                        isInProgress ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                        'bg-sky-50 text-sky-700 border-sky-200/60'
                      }`}>
                        {isResolved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isActionRequired && <AlertTriangle className="w-3 h-3 text-rose-600 animate-bounce" />}
                        {isInProgress && <Wrench className="w-3 h-3 text-blue-600" />}
                        {isUnderReview && <Clock className="w-3 h-3 text-sky-600" />}
                        <span>{report.statusLabel}</span>
                      </span>

                      {report.slaTurnaround && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50/70 text-blue-800 border border-blue-100 hidden sm:inline-flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{report.slaTurnaround}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.department}</span>
                    </span>
                  </div>

                  {/* Card Body with Image & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    
                    {/* Media Image / Before-After */}
                    {report.beforePhotoUrl && report.afterPhotoUrl ? (
                      <div className="md:col-span-5 grid grid-cols-2 gap-2">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                          <img 
                            src={report.beforePhotoUrl} 
                            alt="Before" 
                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                            BEFORE
                          </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                          <img 
                            src={report.afterPhotoUrl} 
                            alt="After" 
                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase">
                            RESOLVED
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="md:col-span-4 relative rounded-2xl overflow-hidden border border-slate-200/80 group">
                        <img 
                          src={report.photoUrl || potholeImg} 
                          alt={report.title} 
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {report.gpsVerified && (
                          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>GPS Verified</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details Column */}
                    <div className={`${report.beforePhotoUrl && report.afterPhotoUrl ? 'md:col-span-7' : 'md:col-span-8'} space-y-2.5 text-left`}>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {report.title}
                      </h3>
                      
                      <div className="text-xs font-semibold text-slate-500 space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Reported {report.reportedAt}</span>
                        </div>
                      </div>

                      {/* Live Update Callout */}
                      {report.liveUpdate && (
                        <div className={`border rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs font-medium ${
                          isActionRequired ? 'bg-rose-50/80 border-rose-200/80 text-rose-950' :
                          isResolved ? 'bg-emerald-50/80 border-emerald-200/70 text-emerald-950' :
                          'bg-blue-50/80 border-blue-200/70 text-blue-900'
                        }`}>
                          {isActionRequired ? (
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                          ) : isResolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-bounce" />
                          )}
                          <div>
                            <span className="font-extrabold">
                              {isActionRequired ? 'Action Required: ' : isResolved ? 'Resolution Summary: ' : 'Live Update: '}
                            </span>
                            {report.liveUpdate}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* 4-Step Lifecycle Milestone Progress Bar */}
                  <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      LIFECYCLE MILESTONE PROGRESS
                    </span>

                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      
                      {/* Step 1 */}
                      <div className="space-y-1.5 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${
                          report.milestones.step1.completed 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-slate-900 block">{report.milestones.step1.title}</span>
                          <span className="text-[10px] font-medium text-slate-400 block">{report.milestones.step1.subtitle}</span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1.5 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${
                          report.milestones.step2.completed 
                            ? 'bg-blue-600 text-white' 
                            : report.milestones.step2.current 
                            ? 'bg-white border-2 border-blue-600 text-blue-600 animate-pulse' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {report.milestones.step2.completed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : report.milestones.step2.current ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-black">2</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-slate-900 block">{report.milestones.step2.title}</span>
                          <span className="text-[10px] font-medium text-slate-400 block">{report.milestones.step2.subtitle}</span>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1.5 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${
                          report.milestones.step3.completed 
                            ? 'bg-blue-600 text-white' 
                            : report.milestones.step3.current 
                            ? 'bg-white border-2 border-amber-500 text-amber-600 animate-pulse' 
                            : 'bg-slate-200 text-slate-500 opacity-60'
                        }`}>
                          {report.milestones.step3.completed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : report.milestones.step3.current ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-black">3</span>
                          )}
                        </div>
                        <div>
                          <span className={`text-[11px] font-black block ${report.milestones.step3.current ? 'text-amber-700' : 'text-slate-900'}`}>
                            {report.milestones.step3.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 block">{report.milestones.step3.subtitle}</span>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1.5 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs ${
                          report.milestones.step4.completed 
                            ? 'bg-emerald-600 text-white' 
                            : report.milestones.step4.current 
                            ? 'bg-rose-500 text-white animate-bounce' 
                            : 'bg-slate-200 text-slate-500 opacity-50'
                        }`}>
                          {report.milestones.step4.completed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="text-xs font-black">4</span>
                          )}
                        </div>
                        <div>
                          <span className={`text-[11px] font-black block ${
                            report.milestones.step4.completed ? 'text-emerald-700' : 
                            report.milestones.step4.current ? 'text-rose-600 font-extrabold' : 'text-slate-700'
                          }`}>
                            {report.milestones.step4.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 block">{report.milestones.step4.subtitle}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Citizen Co-Verification & Rating Action Bar (If Action Required or Resolved) */}
                  {(isActionRequired || (isResolved && !report.userRating)) && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Citizen Co-Verification: Rate Field Resolution</span>
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Please inspect work on site and confirm satisfaction to close AMC audit log.
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-600">Rate Quality:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateIssue(report.ticketId, star)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-110 active:scale-95"
                              title={`Rate ${star} Stars & Sign Off`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inspector Sign-off Box (If already resolved with rating) */}
                  {isResolved && report.userRating && (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Signed off by {report.signedBy || report.assignedOfficer}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 block">
                            Validated by {report.validationCount || 12} neighborhood residents
                          </span>
                        </div>
                      </div>

                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-800 flex items-center space-x-1 shadow-2xs">
                        <span>Your Rating:</span>
                        <div className="flex text-amber-400 ml-1">
                          {'★'.repeat(report.userRating)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Interactive Footer Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Assigned: <strong className="text-slate-900">{report.assignedOfficer}</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Request Call from JE (if in progress or active) */}
                      {!isResolved && (
                        <button 
                          onClick={() => handleRequestCall(report.assignedOfficer, report.ticketId)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-extrabold hover:bg-slate-200 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-98"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>Request Call from JE</span>
                        </button>
                      )}

                      {/* Recurring Issue / Escalate */}
                      {isResolved && (
                        <button 
                          onClick={() => setShowRecurringModal(report)}
                          className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Report Recurring Issue</span>
                        </button>
                      )}

                      {/* Download Certificate (If resolved) */}
                      {isResolved && (
                        <button 
                          onClick={() => setShowCertificateModal(report)}
                          className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-extrabold hover:bg-blue-100 transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Resolution Certificate</span>
                        </button>
                      )}

                      {/* View Details Audit File */}
                      <button 
                        onClick={() => setSelectedTicketForDetails(report)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                    </div>
                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* RIGHT COLUMN: CIVIC KARMA & WARD WIDGETS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* USER CIVIC KARMA CARD */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center space-x-3.5">
              <img 
                src={currentUser.avatarUrl || avatarImg} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <h3 className="text-base font-black text-white">{currentUser.name}</h3>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>{currentUser.level || 'Level 3 City Guardian'}</span>
                </span>
              </div>
            </div>

            {/* Karma Points Banner */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-300 tracking-wider block">
                  CIVIC KARMA POINTS
                </span>
                <span className="text-2xl font-black text-white">{currentUser.civicScore || 480} Pts</span>
              </div>
              <Award className="w-8 h-8 text-amber-400" />
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Your geotagged verified reports have expedited municipal maintenance for over 1,400 neighborhood residents across {currentUser.ward || 'Ward 14'}.
            </p>
          </div>

          {/* HOW RESOLUTION WORKS WIDGET */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                How Resolution Works
              </h3>
            </div>

            <div className="space-y-3.5">
              
              {/* Step 1 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Automated AI Ward Triage</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    Tickets are geo-tagged and assigned to ward officers within 4 business hours.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Field Crew Deployment</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    Civil, electrical, or sanitation squads receive priority work orders.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Citizen Co-Verification</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                    After field fix, photo proof is sent to you to confirm satisfaction and close the audit file.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* WARD 14 ZONAL OFFICE WIDGET */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Ward 14 Zonal Office
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Open Today
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Ahmedabad Municipal Corporation West Zone Office, Near Navrangpura Bus Stand.
            </p>

            <div className="space-y-2">
              <a 
                href="tel:07926578000"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center space-x-2 font-extrabold text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>079-26578000</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Mon-Sat 8am-8pm</span>
              </a>

              <a 
                href="mailto:ward14@amc.gov.in"
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between text-xs transition-all"
              >
                <div className="flex items-center space-x-2 font-extrabold text-slate-900">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>ward14@amc.gov.in</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Direct Mail</span>
              </a>
            </div>

            <button 
              onClick={() => {
                setMeetingConfirmed(false);
                setShowMeetingModal(true);
              }}
              className="w-full py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-all border border-blue-200/60 shadow-2xs cursor-pointer active:scale-98"
            >
              Schedule Ward Officer Meeting
            </button>
          </div>

          {/* PUBLIC TRANSPARENCY SLA */}
          <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 flex items-start space-x-3 text-left">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900">Public Transparency SLA</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-normal mt-0.5">
                Civic reports public by default under Gujarat Civic Disclosure Act 2021.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}

      {/* 1. TICKET DETAILS AUDIT FILE MODAL */}
      {selectedTicketForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left border border-slate-100 animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                  AMC OFFICIAL TICKET AUDIT FILE
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedTicketForDetails.ticketId}</h3>
              </div>
              <button 
                onClick={() => setSelectedTicketForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div>
                <span className="text-slate-400 font-bold block">Issue Title</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{selectedTicketForDetails.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 font-bold block">Department</span>
                  <span className="font-extrabold text-slate-800">{selectedTicketForDetails.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Officer In-Charge</span>
                  <span className="font-extrabold text-slate-800">{selectedTicketForDetails.assignedOfficer}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedTicketForDetails.officerRole}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold block">Location</span>
                  <span className="font-semibold text-slate-700">{selectedTicketForDetails.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Status & SLA</span>
                  <span className="font-extrabold text-blue-600">{selectedTicketForDetails.statusLabel}</span>
                </div>
              </div>

              {/* Photo Preview if available */}
              {selectedTicketForDetails.photoUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-48">
                  <img 
                    src={selectedTicketForDetails.photoUrl} 
                    alt="Ticket Proof" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Live Action Notes */}
              <div>
                <span className="text-slate-400 font-bold block mb-1">Official Municipal Action Notes</span>
                <p className="text-slate-700 font-medium leading-relaxed bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                  {selectedTicketForDetails.description}
                  {selectedTicketForDetails.liveUpdate && (
                    <span className="block mt-2 font-bold text-blue-900 border-t border-blue-200/60 pt-2">
                      Latest Site Dispatch: {selectedTicketForDetails.liveUpdate}
                    </span>
                  )}
                </p>
              </div>

              {/* Audit Trail Log */}
              <div>
                <span className="text-slate-400 font-bold block mb-2">Immutable Audit Trail</span>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedTicketForDetails.auditTrail?.map((log, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span>{log.actor}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{log.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Citizen Follow-up Note Form */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="font-bold text-slate-700 block">Add Citizen Supplementary Note / Update</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAuditNote}
                    onChange={(e) => setNewAuditNote(e.target.value)}
                    placeholder="Type note or feedback to attach to ticket..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddAuditNote(selectedTicketForDetails.ticketId);
                    }}
                  />
                  <button
                    onClick={() => handleAddAuditNote(selectedTicketForDetails.ticketId)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shrink-0 cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleCopyTicketLink(selectedTicketForDetails.ticketId)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 flex items-center space-x-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Ticket</span>
              </button>

              <div className="flex items-center space-x-2">
                {selectedTicketForDetails.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      handleRequestCall(selectedTicketForDetails.assignedOfficer, selectedTicketForDetails.ticketId);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Officer</span>
                  </button>
                )}
                
                <button 
                  onClick={() => setSelectedTicketForDetails(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Close File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHEDULE MEETING MODAL */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Schedule Ward Officer Meeting</h3>
              </div>
              <button 
                onClick={() => setShowMeetingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!meetingConfirmed ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Officer / Division</label>
                  <select
                    value={meetingOfficer}
                    onChange={(e) => setMeetingOfficer(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option>JE Officer Dave (Civil Roads & Infrastructure)</option>
                    <option>JE R. Parmar (Torrent / Streetlight Division)</option>
                    <option>Sanitary Inspector H. Mehta (Solid Waste & Hygiene)</option>
                    <option>AE Suresh Prajapati (Water Supply & Drainage)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Date</label>
                  <input 
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                  <select 
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
                  >
                    <option>10:00 AM - 11:00 AM (Morning Session)</option>
                    <option>02:00 PM - 03:00 PM (Afternoon Session)</option>
                    <option>04:00 PM - 05:00 PM (Evening Public Grievance)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discussion Topic / Civic Concern</label>
                  <textarea 
                    value={meetingReason}
                    onChange={(e) => setMeetingReason(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  onClick={() => setMeetingConfirmed(true)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md cursor-pointer active:scale-98"
                >
                  Confirm Appointment Request
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">Appointment Registered!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Meeting booked for <strong>{meetingDate} at {meetingTime}</strong> with <strong>{meetingOfficer}</strong> at AMC Ward 14 West Zone Office. Confirmation SMS dispatched to your mobile.
                  </p>
                </div>
                <button 
                  onClick={() => setShowMeetingModal(false)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. DOWNLOAD HISTORY / PDF EXPORT MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Export Civic Reports History (PDF)
                </h3>
              </div>
              <button 
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>AHMEDABAD MUNICIPAL CORPORATION (AMC) CITIZEN DOSSIER</span>
              </div>
              <p className="text-slate-600 font-medium">
                Official civic log summary for citizen <strong>{currentUser.name}</strong> ({currentUser.ward || 'Ward 14 Navrangpura'}). Includes {userReports.length} logged tickets and municipal resolution audit trails.
              </p>
            </div>

            {/* Mini summary table preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Document Table Preview</span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                    <tr>
                      <th className="p-2">Ticket ID</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userReports.map(r => (
                      <tr key={r.id}>
                        <td className="p-2 font-bold text-slate-900">{r.ticketId}</td>
                        <td className="p-2 text-slate-600">{r.category}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {r.statusLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button 
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                  showToast('PDF Document Exported', 'Ward 14 Civic Report History PDF generated successfully.', 'check');
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESOLUTION CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left border-2 border-emerald-500/20 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">OFFICIAL CITIZEN CERTIFICATE</span>
                  <h3 className="text-base font-black text-slate-900">AMC Resolution Certificate</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowCertificateModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-xs space-y-3">
              <div className="text-center border-b border-emerald-200/60 pb-3">
                <span className="text-xs font-black text-emerald-900 tracking-wider uppercase block">
                  AHMEDABAD MUNICIPAL CORPORATION
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">West Zone Municipal Governance Desk • Ward 14</span>
              </div>

              <div className="space-y-1.5 text-slate-700 font-medium">
                <p>This certifies that Ticket <strong className="text-slate-900">{showCertificateModal.ticketId}</strong> for <strong className="text-slate-900">{showCertificateModal.title}</strong> has been successfully remediated and officially verified.</p>
                <div className="grid grid-cols-2 gap-2 bg-white/70 p-3 rounded-xl border border-emerald-100 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Sign-off Officer</span>
                    <span className="font-extrabold text-slate-900">{showCertificateModal.signedBy || showCertificateModal.assignedOfficer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Reporting Citizen</span>
                    <span className="font-extrabold text-slate-900">{currentUser.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-emerald-200/60">
                <span>Hash: #AMC-GJ01-{showCertificateModal.ticketId.replace('#', '')}-VRFD</span>
                <span className="font-bold text-emerald-700">✓ Digital Co-Signature Verified</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button 
                onClick={() => setShowCertificateModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  window.print();
                  setShowCertificateModal(null);
                  showToast('Certificate Printed', `Certificate for ${showCertificateModal.ticketId} printed successfully.`, 'check');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECURRING ISSUE / ESCALATION MODAL */}
      {showRecurringModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Report Recurring Issue</h3>
              </div>
              <button 
                onClick={() => setShowRecurringModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-600 font-medium">
                Re-opening Ticket <strong>{showRecurringModal.ticketId}</strong> at <strong>{showRecurringModal.location}</strong> for priority sanitary/civil supervisor intervention.
              </p>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Recurrence</label>
                <select
                  value={recurringReason}
                  onChange={(e) => setRecurringReason(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                >
                  <option>Issue has resurfaced / incomplete fix on site</option>
                  <option>Waste dumping restarted within 48 hours</option>
                  <option>Pothole asphalt caved again after rains</option>
                  <option>Streetlight fixture malfunctioning again</option>
                  <option>Water line leakage resumed under ground pressure</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Observations (Optional)</label>
                <textarea
                  value={recurringNotes}
                  onChange={(e) => setRecurringNotes(e.target.value)}
                  placeholder="Describe current on-site condition..."
                  rows={3}
                  className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-medium text-slate-800 resize-none"
                ></textarea>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex items-start space-x-2 text-[11px] text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Submitting this escalation will set ticket priority to <strong>Critical</strong> and alert the Ward 14 Executive Engineer directly.</span>
              </div>

              <button 
                onClick={handleConfirmRecurringEscalation}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-md cursor-pointer active:scale-98"
              >
                Escalate & Re-open Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyReportsPage;
