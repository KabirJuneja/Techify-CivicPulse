import React, { useState } from 'react';
import { Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { Language, ModalType, UserProfile } from '../types';
import { translations } from '../translations';
import NagarXLogo from './NagarXLogo';

interface NavbarProps {
  language: Language;
  onOpenModal: (type: ModalType) => void;
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
  currentUser?: UserProfile;
}

export default function Navbar({ language, onOpenModal, isLoggedIn, onGoToDashboard, onLogout, currentUser }: NavbarProps) {
  const t = translations[language].navbar;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'RS';
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const navLinks = [
    { name: t.about, href: '#about' },
    { name: t.howItWorks, href: '#how-it-works' },
    { name: t.features, href: '#features' },
    { name: t.cityPulse, href: '#city-pulse' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 select-none text-left focus:outline-none cursor-pointer group"
          >
            <NagarXLogo size="md" showTagline={true} />
          </button>

          {/* Desktop Navigation Link Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {/* Logged in User Profile Info Badge */}
                <div 
                  onClick={onGoToDashboard}
                  className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl cursor-pointer transition-all group"
                  title="View Profile & Dashboard"
                >
                  <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform ${
                    currentUser?.role === 'admin' 
                      ? 'bg-purple-600' 
                      : currentUser?.role === 'authority' 
                      ? 'bg-blue-700' 
                      : 'bg-blue-600'
                  }`}>
                    {getInitials(currentUser?.name)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                      {currentUser?.name || 'Rahul Sharma'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                      {currentUser?.roleBadgeText || currentUser?.roleTitle || currentUser?.ward || 'Citizen'}
                    </span>
                  </div>
                </div>

                {/* Return to Dashboard Feed Button */}
                <button
                  onClick={onGoToDashboard}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {language === 'hi' ? 'माई फीड पर जाएं' : language === 'gu' ? 'મારા ફીડ પર જાઓ' : 'Go to Feed Dashboard'}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onOpenModal('join')}
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onOpenModal('report')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]"
                >
                  {t.join}
                </button>
                <button 
                  onClick={() => onOpenModal('join')}
                  className="flex items-center justify-center w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors shadow"
                  title="User Portal"
                >
                  <User className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isLoggedIn ? (
              <button 
                onClick={onGoToDashboard}
                className="w-9 h-9 bg-blue-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow"
              >
                RS
              </button>
            ) : (
              <button 
                onClick={() => onOpenModal('join')}
                className="flex items-center justify-center w-9 h-9 bg-slate-900 text-white rounded-full transition-colors"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-bold text-slate-700 hover:text-blue-600 transition-colors py-2 px-3 hover:bg-slate-50 rounded-lg"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2.5 px-3">
            {isLoggedIn ? (
              <>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center ${
                    currentUser?.role === 'admin' 
                      ? 'bg-purple-600' 
                      : currentUser?.role === 'authority' 
                      ? 'bg-blue-700' 
                      : 'bg-blue-600'
                  }`}>
                    {getInitials(currentUser?.name)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900">{currentUser?.name || 'Rahul Sharma'}</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {currentUser?.roleBadgeText || currentUser?.roleTitle || currentUser?.ward || 'Citizen'} • Logged In
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onGoToDashboard) onGoToDashboard();
                  }}
                  className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl text-center shadow flex items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {language === 'hi' ? 'माई फीड पर जाएं' : language === 'gu' ? 'મારા ફીડ પર જાઓ' : 'Go to Feed Dashboard'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full py-2.5 text-red-600 font-bold text-xs hover:bg-red-50 rounded-xl text-center border border-red-100"
                >
                  {language === 'hi' ? 'लॉग आउट' : language === 'gu' ? 'લોગ આઉટ' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenModal('join');
                  }}
                  className="text-center text-sm font-bold text-slate-600 py-2.5 hover:bg-slate-50 rounded-lg"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenModal('report');
                  }}
                  className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl text-center shadow"
                >
                  {t.join}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
