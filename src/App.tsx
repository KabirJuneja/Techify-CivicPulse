import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import PublicPulse from './components/PublicPulse';
import GrassrootsSpotlight from './components/GrassrootsSpotlight';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import FeedDashboard from './components/FeedDashboard';
import ReportModal from './components/ReportModal';
import MapModal from './components/MapModal';
import JoinModal from './components/JoinModal';
import RsvpModal from './components/RsvpModal';
import ShareModal from './components/ShareModal';
import { Ticket, Language, ModalType, UserRole } from './types';
import { UserCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { DEMO_USERS } from './data/demoUsers';
import { DemoRoleSwitcher } from './components/DemoRoleSwitcher';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(350);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  
  // 3-Tier Demo Role State: 'citizen' | 'authority' | 'admin'
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('nagarx_user_role') as UserRole;
    return saved && DEMO_USERS[saved] ? saved : 'citizen';
  });

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.citizen;

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem('nagarx_user_role', role);
  };

  // Login state: default to logged-in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Active View when logged in: 'dashboard' (Feed) or 'landing' (Main Public Home Page)
  const [currentView, setCurrentView] = useState<'dashboard' | 'landing'>('dashboard');

  // Sync index.html attributes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleOpenModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal('none');
  };

  const handleAddTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleConfirmRSVP = () => {
    setVolunteerCount((prev) => prev + 1);
    setHasRSVPed(true);
  };

  const handleLoginSuccess = (role?: UserRole) => {
    if (role && DEMO_USERS[role]) {
      handleSwitchRole(role);
    }
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  // Render Logged-In Feed Dashboard view
  if (isLoggedIn && currentView === 'dashboard') {
    return (
      <div id="app-root" className="min-h-screen bg-slate-100/80 text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        
        {/* Top 3-Tier Demo Role Switcher Bar */}
        <div className="bg-slate-950 border-b border-slate-800 text-white">
          <div className="max-w-[1500px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 py-1.5">
            <div className="flex-1 w-full sm:w-auto">
              <DemoRoleSwitcher
                currentRole={currentRole}
                onSelectRole={handleSwitchRole}
                variant="banner"
              />
            </div>
            <button 
              onClick={() => setCurrentView('landing')}
              className="text-blue-300 hover:text-white underline text-[11px] font-bold shrink-0 cursor-pointer ml-auto"
            >
              Switch to Public Landing Page
            </button>
          </div>
        </div>

        {/* Main Feed Dashboard Component */}
        <FeedDashboard
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
          onBackToHome={() => setCurrentView('landing')}
          onOpenModal={handleOpenModal}
          userTickets={tickets}
          currentUser={currentUser}
          onUpdateCurrentUser={(u) => handleSwitchRole(u.role)}
        />

        {/* =========================================
            INTERACTIVE SIMULATION MODALS
            ========================================= */}
        
        {/* A. Report Issue Modal */}
        <ReportModal
          isOpen={activeModal === 'report'}
          onClose={handleCloseModal}
          language={language}
          onAddTicket={handleAddTicket}
        />

        {/* B. Ahmedabad Wards Live Map Dashboard */}
        <MapModal
          isOpen={activeModal === 'map'}
          onClose={handleCloseModal}
          language={language}
          tickets={tickets}
        />

        {/* C. Citizen Portal Secure Login Modal */}
        <JoinModal
          isOpen={activeModal === 'join'}
          onClose={handleCloseModal}
          language={language}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* D. Sabarmati Drive RSVP Pass Generator Modal */}
        <RsvpModal
          isOpen={activeModal === 'rsvp'}
          onClose={handleCloseModal}
          language={language}
          onConfirmRSVP={handleConfirmRSVP}
        />

        {/* E. Grassroots Social Share Link Modal */}
        <ShareModal
          isOpen={activeModal === 'share'}
          onClose={handleCloseModal}
          language={language}
        />

      </div>
    );
  }

  // Render Main Home Landing Page (for both Visitor & Logged-In Users visiting Home)
  return (
    <div id="app-root" className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-blue-600 selection:text-white relative">
      
      {/* Top Banner with 3 Demo IDs Switcher */}
      {isLoggedIn ? (
        /* Logged-In User Banner on Main Landing Page */
        <div className="bg-slate-950 border-b border-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 py-1.5">
            <div className="flex-1 w-full sm:w-auto">
              <DemoRoleSwitcher
                currentRole={currentRole}
                onSelectRole={handleSwitchRole}
                variant="banner"
              />
            </div>
            <div className="flex items-center space-x-3 shrink-0 ml-auto">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {language === 'hi' ? 'माई फीड डैशबोर्ड पर जाएं' : language === 'gu' ? 'મારા ફીડ ડેશબોર્ડ પર જાઓ' : 'Open Feed Dashboard'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white text-xs font-semibold underline transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'लॉग आउट' : language === 'gu' ? 'લોગ આઉટ' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Visitor Demo Banner with 3 Demo Roles Selector */
        <div className="bg-slate-950 border-b border-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 py-1.5">
            <div className="flex-1 w-full sm:w-auto">
              <DemoRoleSwitcher
                currentRole={currentRole}
                onSelectRole={(r) => {
                  handleSwitchRole(r);
                  setIsLoggedIn(true);
                  setCurrentView('dashboard');
                }}
                variant="banner"
              />
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(true);
                setCurrentView('dashboard');
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all flex items-center space-x-1 cursor-pointer shrink-0 ml-auto"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Enter Feed Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <Navbar 
        language={language} 
        onOpenModal={handleOpenModal} 
        isLoggedIn={isLoggedIn}
        onGoToDashboard={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Main Home Sections */}
      <main className="flex-grow">
        {/* 2. Hero Section */}
        <Hero 
          language={language} 
          onOpenModal={handleOpenModal} 
        />

        {/* 3. Simple Tools Features Section */}
        <Features 
          language={language} 
          onOpenModal={handleOpenModal} 
        />

        {/* 4. How It Works Section */}
        <HowItWorks 
          language={language} 
        />

        {/* 5. Public Pulse Statistics Banner */}
        <PublicPulse 
          language={language} 
        />

        {/* 6. Grassroots Spotlight Initiative */}
        <GrassrootsSpotlight 
          language={language} 
          onOpenModal={handleOpenModal}
          volunteerCount={volunteerCount}
          hasRSVPed={hasRSVPed}
        />

        {/* 7. Testimonials Voices of Ahmedabad */}
        <Testimonials 
          language={language} 
        />

        {/* 8. Call to Action Banner */}
        <CallToAction 
          language={language} 
          onOpenModal={handleOpenModal} 
        />
      </main>

      {/* 9. Language Bar & Footer info */}
      <Footer 
        language={language} 
        onLanguageChange={setLanguage} 
        onOpenModal={handleOpenModal} 
      />

      {/* =========================================
          INTERACTIVE SIMULATION MODALS
          ========================================= */}
      
      {/* A. Report Issue Modal */}
      <ReportModal
        isOpen={activeModal === 'report'}
        onClose={handleCloseModal}
        language={language}
        onAddTicket={handleAddTicket}
      />

      {/* B. Ahmedabad Wards Live Map Dashboard */}
      <MapModal
        isOpen={activeModal === 'map'}
        onClose={handleCloseModal}
        language={language}
        tickets={tickets}
      />

      {/* C. Citizen Portal Secure Login Modal */}
      <JoinModal
        isOpen={activeModal === 'join'}
        onClose={handleCloseModal}
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* D. Sabarmati Drive RSVP Pass Generator Modal */}
      <RsvpModal
        isOpen={activeModal === 'rsvp'}
        onClose={handleCloseModal}
        language={language}
        onConfirmRSVP={handleConfirmRSVP}
      />

      {/* E. Grassroots Social Share Link Modal */}
      <ShareModal
        isOpen={activeModal === 'share'}
        onClose={handleCloseModal}
        language={language}
      />

    </div>
  );
}

