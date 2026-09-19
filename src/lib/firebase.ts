import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth Export
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firebase Firestore Export (respecting custom databaseId)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper User Profile Interface for Firestore
export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  wardNumber?: string;
  wardName?: string;
  city?: string;
  role?: 'citizen' | 'official' | 'admin';
  civicPoints?: number;
  ticketsReported?: number;
  eventsJoined?: number;
  bio?: string;
  preferredLanguage?: 'en' | 'hi' | 'gu';
  createdAt?: any;
  updatedAt?: any;
}

// User Profile Firestore Helpers
export async function createUserProfileDocument(user: User, additionalData: Partial<UserProfileData> = {}): Promise<UserProfileData> {
  if (!user) throw new Error('No user provided');
  
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const newProfile: UserProfileData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || 'Ahmedabad Citizen',
      photoURL: user.photoURL || '/src/assets/images/rahul_sharma_avatar_1789742493368.jpg',
      phone: additionalData.phone || '9876543210',
      wardNumber: additionalData.wardNumber || '14',
      wardName: additionalData.wardName || 'Navrangpura',
      city: additionalData.city || 'Ahmedabad',
      role: additionalData.role || 'citizen',
      civicPoints: 120,
      ticketsReported: 1,
      eventsJoined: 1,
      bio: additionalData.bio || 'Active citizen working together for a cleaner, smarter Ahmedabad.',
      preferredLanguage: additionalData.preferredLanguage || 'en',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(userRef, newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating user profile document:', error);
      throw error;
    }
  } else {
    return snapshot.data() as UserProfileData;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfileData>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// Standardized Firestore Error Handling per Firebase Integration Skill
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// Civic Events Firestore Data Layer
// -------------------------------------------------------------
export interface CivicEventFirestoreData {
  id: string;
  title: string;
  isMegaDrive?: boolean;
  directiveText?: string;
  organizer: string;
  dateTime: string;
  assemblyPoint: string;
  location?: string;
  ward: string;
  category: 'all' | 'cleanliness' | 'repair' | 'plantation' | 'townhall';
  categoryLabel: string;
  categoryTag2?: string;
  description: string;
  stretchOrLocationKey: string;
  stretchOrLocationVal: string;
  equipmentOrPartnerKey: string;
  equipmentOrPartnerVal: string;
  actionTasks?: string[];
  volunteersRegistered: number;
  volunteersCapacity?: number;
  joinedUserInitials: string[];
  joinedNote: string;
  isUserRSVPed?: boolean;
  coverImage?: string;
  authorUid?: string;
  authorName?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Save new civic event into the Firestore database
 */
export async function saveCivicEventToFirestore(
  eventData: Omit<CivicEventFirestoreData, 'id'> & { id?: string }
): Promise<CivicEventFirestoreData> {
  const eventId = eventData.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const eventRef = doc(db, 'events', eventId);
  const pathForWrite = `events/${eventId}`;

  const fullData: CivicEventFirestoreData = {
    ...eventData,
    id: eventId,
    location: eventData.location || eventData.assemblyPoint,
    authorUid: auth.currentUser?.uid || 'rahul-sharma-civic-uid',
    authorName: auth.currentUser?.displayName || 'Rahul Sharma (Citizen)',
    volunteersRegistered: eventData.volunteersRegistered ?? 1,
    joinedUserInitials: eventData.joinedUserInitials || ['RS'],
    joinedNote: eventData.joinedNote || '1 citizen registered',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(eventRef, fullData);
    return fullData;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, pathForWrite);
  }
}

/**
 * Real-time subscription to civic events in Firestore
 */
export function subscribeToCivicEvents(
  onUpdate: (events: CivicEventFirestoreData[]) => void
): () => void {
  const path = 'events';
  const eventsCollectionRef = collection(db, path);

  const unsubscribe = onSnapshot(
    eventsCollectionRef,
    (snapshot) => {
      const items: CivicEventFirestoreData[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data() as CivicEventFirestoreData;
        items.push({
          ...d,
          id: docSnap.id,
        });
      });
      // Sort with newest on top
      items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

/**
 * Persist an Officer's Resolution & Audit details for a ticket to Firestore
 */
export async function updateTicketResolutionInFirestore(
  ticketIdOrNum: string,
  resolutionData: {
    status: 'In-Progress' | 'Resolved';
    isResolved: boolean;
    resolvedByOfficer: string;
    officerDesignation?: string;
    officerSquad?: string;
    officerWard?: string;
    resolutionRemarks: string;
    resolutionProofUrl?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    resolutionTime?: string;
    resolvedTimestamp?: string;
  }
): Promise<void> {
  const cleanId = ticketIdOrNum.startsWith('fs-') 
    ? ticketIdOrNum.replace('fs-', '') 
    : ticketIdOrNum.replace('#', '');
  
  const docRef = doc(db, 'tickets', cleanId);
  const pathForWrite = `tickets/${cleanId}`;

  const payload: Partial<TicketFirestoreData> = {
    ...resolutionData,
    status: resolutionData.status,
    isResolved: resolutionData.isResolved,
    updatedAt: serverTimestamp(),
    resolvedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.warn('Error updating ticket resolution in Firestore:', error);
    handleFirestoreError(error, OperationType.UPDATE, pathForWrite);
  }
}


/**
 * Update RSVP count for an event in Firestore
 */
export async function updateCivicEventRsvpInFirestore(
  eventId: string,
  delta: number,
  isRSVPed: boolean
): Promise<void> {
  const path = `events/${eventId}`;
  const eventRef = doc(db, 'events', eventId);

  try {
    const snap = await getDoc(eventRef);
    if (snap.exists()) {
      await updateDoc(eventRef, {
        volunteersRegistered: increment(delta),
        isUserRSVPed: isRSVPed,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// Civic Tickets & Reports Firestore Data Layer
// -------------------------------------------------------------
export interface TicketFirestoreData {
  id: string;
  ticketNum: string;
  title: string;
  category: string;
  fieldCategory?: string;
  ward: string;
  location?: string;
  landmark?: string;
  description: string;
  priority: string;
  civicScore?: number;
  civicScoreEarned?: number;
  status: 'Reported' | 'In-Progress' | 'Resolved';
  upvotes: number;
  authorUid: string;
  authorName: string;
  reporterName?: string;
  authorPhone?: string;
  isAnonymous: boolean;
  imageUrl?: string;
  photoUrls?: string[];
  gpsCoords?: { lat: number; lng: number };
  gpsPrecision?: number | string;
  aiVisionMatch?: string;
  voiceTranscript?: string;
  
  // Officer Resolution Audit Fields
  isResolved?: boolean;
  resolvedByOfficer?: string;
  officerDesignation?: string;
  officerSquad?: string;
  officerWard?: string;
  resolutionRemarks?: string;
  resolutionProofUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  resolutionTime?: string;
  resolvedTimestamp?: string;
  resolvedAt?: any;

  createdAt?: any;
  updatedAt?: any;
}

/**
 * Save newly reported civic issue ticket to Firestore
 */
export async function saveTicketToFirestore(
  ticketData: Partial<TicketFirestoreData> & { ticketNum: string; category: string; ward: string }
): Promise<TicketFirestoreData> {
  const ticketId = ticketData.id || `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const ticketRef = doc(db, 'tickets', ticketId);
  const pathForWrite = `tickets/${ticketId}`;

  const fullData: TicketFirestoreData = {
    ...ticketData,
    id: ticketId,
    ticketNum: ticketData.ticketNum || `#NX-${Math.floor(10000 + Math.random() * 90000)}`,
    title: ticketData.title || `${ticketData.category} Issue in ${ticketData.ward}`,
    description: ticketData.description || 'Civic issue report',
    priority: ticketData.priority || 'Medium',
    status: ticketData.status || 'Reported',
    upvotes: ticketData.upvotes ?? 1,
    authorUid: auth.currentUser?.uid || ticketData.authorUid || 'rahul-sharma-civic-uid',
    authorName: ticketData.isAnonymous ? 'Anonymous Citizen' : (auth.currentUser?.displayName || ticketData.authorName || 'Rahul Sharma'),
    isAnonymous: !!ticketData.isAnonymous,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(ticketRef, fullData);
    return fullData;
  } catch (error) {
    console.warn('Firestore write warning:', error);
    handleFirestoreError(error, OperationType.CREATE, pathForWrite);
  }
}

/**
 * Subscribe to real-time tickets from Firestore
 */
export function subscribeToTickets(
  onUpdate: (tickets: TicketFirestoreData[]) => void
): () => void {
  const path = 'tickets';
  const ticketsCollectionRef = collection(db, path);

  const unsubscribe = onSnapshot(
    ticketsCollectionRef,
    (snapshot) => {
      const items: TicketFirestoreData[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data() as TicketFirestoreData;
        items.push({
          ...d,
          id: docSnap.id,
        });
      });
      // Sort with newest first
      items.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}


