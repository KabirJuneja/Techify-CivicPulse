export type Language = 'en' | 'gu' | 'hi';

export interface Ticket {
  id: string;
  category: string;
  fieldCategory?: string;
  ward: string;
  description: string;
  photoUrl?: string;
  photoUrls?: string[];
  reportedAt: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  reporterName: string;
  isAnonymous: boolean;
  gpsLocation?: { lat: number; lng: number };
  gpsPrecision?: number;
  landmark?: string;
  priority?: string;
  civicScoreEarned?: number;
  aiVisionAnalysis?: string;
  voiceTranscript?: string;
}

export type ModalType = 'none' | 'report' | 'map' | 'join' | 'rsvp' | 'share' | 'login_help';

export type UserRole = 'citizen' | 'authority' | 'admin';

export interface WardStats {
  name: string;
  resolved: number;
  active: number;
  potholesRepairedToday: number;
}

export interface UserProfile {
  id?: string;
  name: string;
  handle: string;
  phone: string;
  email?: string;
  ward: string;
  role: UserRole;
  roleNumber?: number;
  roleTitle?: string;
  roleBadgeText?: string;
  badgeColor?: string;
  civicScore: number;
  level: string;
  ptsToNextLevel: number;
  reportedCount: number;
  resolvedCount: number;
  upvotesReceived: number;
  avatarUrl: string;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorHandle?: string;
  authorWard: string;
  authorBadge?: string;
  avatarUrl: string;
  timeAgo: string;
  privacy: string;
  content: string;
  mediaType?: 'image' | 'comparison' | 'traffic_alert';
  imageUrl?: string;
  imageTag?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  isResolved?: boolean;
  resolutionTime?: string;
  ticketId?: string;
  isOfficial?: boolean;
  priority?: string;
  upvotes: number;
  commentsCount: number;
  comments?: FeedComment[];
  isUpvoted?: boolean;
  isSaved?: boolean;
  citizenVerifications?: number;
  verifiedBy?: string;
  resolvedByOfficer?: string;
  officerDesignation?: string;
  officerSquad?: string;
  officerWard?: string;
  assignedCrew?: string;
  resolutionRemarks?: string;
  resolutionProofUrl?: string;
  resolvedTimestamp?: string;
  fieldCategory?: string;
  civicScoreEarned?: number;
  gpsCoords?: { lat: number; lng: number };
  gpsPrecision?: string | number;
  landmark?: string;
  voiceTranscript?: string;
  voiceAudioUrl?: string;
  aiVisionAnalysis?: string;
  photoUrls?: string[];
}

