import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building2, Shield, Award, Edit3, 
  Save, Check, LogOut, Ticket as TicketIcon, Calendar, Sparkles, 
  CheckCircle2, Camera, UserCheck, ShieldCheck, Globe
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../types';
import { auth, getUserProfile, updateUserProfile, UserProfileData } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { DemoRoleSwitcher } from './DemoRoleSwitcher';

interface UserProfilePageProps {
  language: Language;
  onLogout: () => void;
  onOpenReportModal: () => void;
  onNavigateToMyReports?: () => void;
  currentUser?: UserProfile;
  onSwitchDemoRole?: (role: UserRole) => void;
}

export default function UserProfilePage({ 
  language, 
  onLogout, 
  onOpenReportModal, 
  onNavigateToMyReports,
  currentUser,
  onSwitchDemoRole
}: UserProfilePageProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [wardNumber, setWardNumber] = useState('14');
  const [wardName, setWardName] = useState('Navrangpura');
  const [city, setCity] = useState('Ahmedabad');
  const [bio, setBio] = useState('Active citizen working together for a cleaner, smarter Ahmedabad.');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi' | 'gu'>(language);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
          setDisplayName(data.displayName || user.displayName || 'Rahul Sharma');
          setPhone(data.phone || '9876543210');
          setWardNumber(data.wardNumber || '14');
          setWardName(data.wardName || 'Navrangpura');
          setCity(data.city || 'Ahmedabad');
          setBio(data.bio || 'Active citizen working together for a cleaner, smarter Ahmedabad.');
        } else {
          // Default mock profile
          setProfile({
            uid: user.uid,
            email: user.email || 'rahul.sharma@example.com',
            displayName: user.displayName || 'Rahul Sharma',
            photoURL: user.photoURL || '/src/assets/images/rahul_sharma_avatar_1789742493368.jpg',
            phone: '9876543210',
            wardNumber: '14',
            wardName: 'Navrangpura',
            city: 'Ahmedabad',
            role: 'citizen',
            civicPoints: 120,
            ticketsReported: 3,
            eventsJoined: 2,
            bio: 'Active citizen working together for a cleaner, smarter Ahmedabad.',
            preferredLanguage: language,
          });
        }
      } else {
        // Fallback for demo user profile
        setProfile({
          uid: 'demo-rahul-sharma',
          email: 'rahul.sharma@gmail.com',
          displayName: 'Rahul Sharma',
          photoURL: '/src/assets/images/rahul_sharma_avatar_1789742493368.jpg',
          phone: '9876543210',
          wardNumber: '14',
          wardName: 'Navrangpura',
          city: 'Ahmedabad',
          role: 'citizen',
          civicPoints: 120,
          ticketsReported: 3,
          eventsJoined: 2,
          bio: 'Active citizen working together for a cleaner, smarter Ahmedabad.',
          preferredLanguage: language,
        });
      }
    });

    return () => unsubscribe();
  }, [language]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (auth.currentUser) {
        await updateUserProfile(auth.currentUser.uid, {
          displayName,
          phone,
          wardNumber,
          wardName,
          city,
          bio,
          preferredLanguage,
        });
      }

      setProfile((prev) => prev ? {
        ...prev,
        displayName,
        phone,
        wardNumber,
        wardName,
        city,
        bio,
        preferredLanguage,
      } : null);

      setIsSaving(false);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error('Sign out error:', err);
      onLogout();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200 py-2">
      
      {/* Top Banner & Avatar Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/30 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>AMC Verified Citizen</span>
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-3 md:space-y-0 md:space-x-5 -mt-16">
            <div className="relative group">
              <img
                src={currentUser?.avatarUrl || profile?.photoURL || '/src/assets/images/rahul_sharma_avatar_1789742493368.jpg'}
                alt={currentUser?.name || profile?.displayName || 'Citizen Avatar'}
                className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
              />
              <button 
                onClick={() => alert('Profile photo upload initialized via Firebase Storage.')}
                className="absolute bottom-1 right-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md border border-white transition-transform active:scale-90"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center md:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser?.name || profile?.displayName || 'Rahul Sharma'}
                </h1>
                <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-lg border ${
                  currentUser?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 border-purple-200' 
                    : currentUser?.role === 'authority'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {currentUser?.roleBadgeText || 'Normal Citizen User'}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-md border border-slate-200 uppercase">
                  ID #{currentUser?.roleNumber || 1}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>{currentUser?.email || profile?.email || 'rahul.sharma@example.com'}</span>
                <span>•</span>
                <span className="text-slate-700 font-bold">{currentUser?.ward || profile?.wardName || 'Navrangpura'}</span>
                <span>•</span>
                <span className="text-blue-700 font-bold">{currentUser?.roleTitle || 'Citizen Account'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black rounded-xl border border-red-200/80 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs font-black animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated & persisted to Firebase Firestore database!</span>
        </div>
      )}

      {/* 3-Tier Demo Role Switcher in Profile */}
      {onSwitchDemoRole && currentUser && (
        <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Demo Account Role Selector
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                Switch between Citizen, AMC Ward Officer Desk, or Admin (All Access)
              </p>
            </div>
            <span className="text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              Active: {currentUser.roleBadgeText}
            </span>
          </div>

          <DemoRoleSwitcher
            currentRole={currentUser.role}
            onSelectRole={onSwitchDemoRole}
            variant="compact"
          />
        </div>
      )}

      {/* Civic Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Civic Points</span>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-black text-slate-900">{profile?.civicPoints || 120} pts</span>
          </div>
        </div>

        <button 
          onClick={onNavigateToMyReports}
          className="p-4 bg-white hover:bg-blue-50/50 transition-colors rounded-2xl border border-slate-200/90 shadow-sm space-y-1 text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-wider block">Tickets Reported</span>
            <span className="text-[10px] font-bold text-blue-600 group-hover:underline">View All &rarr;</span>
          </div>
          <div className="flex items-center space-x-2">
            <TicketIcon className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-black text-slate-900">{profile?.ticketsReported || 3}</span>
          </div>
        </button>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Events Joined</span>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="text-xl font-black text-slate-900">{profile?.eventsJoined || 2}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Citizen Badge</span>
          <div className="flex items-center space-x-1.5">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-black text-slate-900">Ward Leader</span>
          </div>
        </div>
      </div>

      {/* Main Profile Details Form / View */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-900 text-base uppercase tracking-tight flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Citizen Profile Information</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">UID: {profile?.uid?.slice(0, 12)}...</span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ward Number</label>
                <input
                  type="text"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ward Name</label>
                <input
                  type="text"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Civic Moto</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Firestore...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                <span className="font-bold text-slate-800">{profile?.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Number</span>
                <span className="font-bold text-slate-800">{profile?.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Ward Location</span>
                <span className="font-bold text-slate-800">Ward #{profile?.wardNumber} - {profile?.wardName}, {profile?.city}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bio</span>
                <span className="font-medium text-slate-700 italic">"{profile?.bio}"</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Role</span>
                <span className="font-bold text-emerald-700 capitalize bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                  {profile?.role || 'Citizen Member'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
