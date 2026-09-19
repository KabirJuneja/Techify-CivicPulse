import React, { useState } from 'react';
import { ShieldCheck, Building2, User, Check, ChevronDown, Sparkles, Key, AlertCircle, Info } from 'lucide-react';
import { UserRole } from '../types';
import { DEMO_USERS, DEMO_USER_LIST, DemoUser, canAccessWardDesk, canAccessCommissionerPortal } from '../data/demoUsers';

interface DemoRoleSwitcherProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  variant?: 'compact' | 'sidebar' | 'banner' | 'modal';
  className?: string;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({
  currentRole,
  onSelectRole,
  variant = 'compact',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeUser = DEMO_USERS[currentRole] || DEMO_USERS.citizen;

  // Banner variant - clean top notification bar
  if (variant === 'banner') {
    return (
      <div className={`bg-slate-900 text-white py-1.5 px-3 sm:px-4 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Demo Access Level:
          </span>
          <span className="font-extrabold text-white flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 text-[11px]">
            {currentRole === 'citizen' && <User className="w-3 h-3 text-blue-400" />}
            {currentRole === 'authority' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
            {currentRole === 'admin' && <Building2 className="w-3 h-3 text-amber-400" />}
            <span>ID #{activeUser.roleNumber}: {activeUser.roleTitle}</span>
          </span>
        </div>

        <div className="flex items-center space-x-1.5 ml-auto">
          <span className="text-[10px] text-slate-400 font-bold hidden md:inline">Switch Demo ID:</span>
          {DEMO_USER_LIST.map((u) => {
            const isSelected = u.role === currentRole;
            return (
              <button
                key={u.role}
                onClick={() => onSelectRole(u.role)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black transition-all flex items-center space-x-1 cursor-pointer ${
                  isSelected
                    ? u.role === 'admin'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-300'
                      : u.role === 'authority'
                      ? 'bg-blue-600 text-white font-black shadow-sm ring-1 ring-blue-400'
                      : 'bg-slate-700 text-white font-black shadow-sm ring-1 ring-slate-500'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ID #${u.roleNumber}: ${u.name} (${u.roleTitle})`}
              >
                <span>{u.roleNumber}. {u.role === 'citizen' ? 'Citizen' : u.role === 'authority' ? 'Ward Officer' : 'Admin (All Access)'}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar variant - displayed inside FeedDashboard navigation
  if (variant === 'sidebar') {
    return (
      <div className={`p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Demo Access ID
            </span>
          </div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${activeUser.badgeColor}`}>
            ID #{activeUser.roleNumber}
          </span>
        </div>

        <div className="p-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
              currentRole === 'admin'
                ? 'bg-purple-600 text-white'
                : currentRole === 'authority'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white'
            }`}>
              {activeUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-black text-slate-900 truncate leading-none">
                {activeUser.name}
              </p>
              <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                {activeUser.roleTitle}
              </p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600 leading-tight space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">AMC Ward Desk:</span>
              <span className={`font-black ${canAccessWardDesk(currentRole) ? 'text-emerald-600' : 'text-slate-400'}`}>
                {canAccessWardDesk(currentRole) ? '✓ Unlocked' : '✕ Restricted'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">Commissioner Portal:</span>
              <span className={`font-black ${canAccessCommissionerPortal(currentRole) ? 'text-purple-600' : 'text-slate-400'}`}>
                {canAccessCommissionerPortal(currentRole) ? '✓ ALL ACCESS' : '✕ Restricted'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Quick Role Switch Buttons */}
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">
            Switch Demo Role
          </span>
          <div className="grid grid-cols-3 gap-1">
            {DEMO_USER_LIST.map((u) => {
              const active = u.role === currentRole;
              return (
                <button
                  key={u.role}
                  onClick={() => onSelectRole(u.role)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black transition-all text-center cursor-pointer border ${
                    active
                      ? u.role === 'admin'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                        : u.role === 'authority'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                        : 'bg-slate-800 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={u.roleTitle}
                >
                  <span className="block leading-none">{u.roleNumber}. {u.role === 'citizen' ? 'Citizen' : u.role === 'authority' ? 'Authority' : 'Admin'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Modal variant - for Join/Login modal
  if (variant === 'modal') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Select 1 of 3 Demo IDs to Log In</span>
          </span>
          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Pre-configured
          </span>
        </div>

        <div className="space-y-2">
          {DEMO_USER_LIST.map((u) => {
            const isSelected = u.role === currentRole;
            return (
              <div
                key={u.role}
                onClick={() => onSelectRole(u.role)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 ${
                      u.role === 'admin'
                        ? 'bg-purple-600'
                        : u.role === 'authority'
                        ? 'bg-blue-600'
                        : 'bg-slate-700'
                    }`}>
                      {u.roleNumber}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-black text-slate-900">{u.name}</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${u.badgeColor}`}>
                          {u.roleBadgeText}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                        Mobile: <span className="font-mono text-slate-700 font-extrabold">{u.phone}</span> • PIN: <span className="font-mono text-slate-700 font-extrabold">{u.pin}</span>
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-2xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 font-medium mt-2 pl-10.5">
                  {u.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact dropdown variant
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>ID #{activeUser.roleNumber}: {activeUser.roleTitle}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Switch Demo Identity
          </div>
          <div className="space-y-1 mt-1">
            {DEMO_USER_LIST.map((u) => (
              <button
                key={u.role}
                onClick={() => {
                  onSelectRole(u.role);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2 rounded-xl transition-all flex items-start space-x-2.5 ${
                  u.role === currentRole ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black text-white shrink-0 mt-0.5 ${
                  u.role === 'admin' ? 'bg-purple-600' : u.role === 'authority' ? 'bg-blue-600' : 'bg-slate-700'
                }`}>
                  {u.roleNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{u.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">PIN: {u.pin}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 block">
                    {u.roleTitle}
                  </span>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {u.accessSummary}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
