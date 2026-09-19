import React from 'react';
import { ShieldAlert, ArrowLeft, Key, UserCheck, ShieldCheck, Building2 } from 'lucide-react';
import { UserRole } from '../types';
import { DEMO_USERS, DemoUser } from '../data/demoUsers';

interface RestrictedAccessViewProps {
  requiredRole: 'authority' | 'admin';
  currentRole: UserRole;
  portalName: string;
  onSwitchRole: (role: UserRole) => void;
  onBackToFeed: () => void;
}

export const RestrictedAccessView: React.FC<RestrictedAccessViewProps> = ({
  requiredRole,
  currentRole,
  portalName,
  onSwitchRole,
  onBackToFeed
}) => {
  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.citizen;
  const targetAuthorityUser = DEMO_USERS.authority;
  const targetAdminUser = DEMO_USERS.admin;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider mb-3">
        <span>Authority Credentials Required</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
        {portalName} is Restricted
      </h2>

      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        This portal is restricted to{' '}
        <strong className="text-slate-900">
          {requiredRole === 'admin' ? 'Admin & Higher Authority ID users only' : 'AMC Ward Officers & Admin ID users'}
        </strong>.
        You are currently viewing as{' '}
        <span className="font-bold text-blue-700">
          ID #{currentUser.roleNumber} ({currentUser.name} • {currentUser.roleTitle})
        </span>.
      </p>

      {/* Suggested Demo ID quick switch action */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left mb-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-black text-slate-800">
            Switch Demo ID to test this restricted portal immediately:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {requiredRole === 'authority' && (
            <button
              onClick={() => onSwitchRole('authority')}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-sm flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-200" />
                <div className="text-left">
                  <div className="leading-none">Switch to ID #2</div>
                  <div className="text-[10px] text-blue-200 font-semibold mt-0.5">AMC Ward Officer Desk</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-blue-500/80 px-2 py-0.5 rounded">Select</span>
            </button>
          )}

          <button
            onClick={() => onSwitchRole('admin')}
            className={`p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-sm flex items-center justify-between cursor-pointer group ${
              requiredRole === 'admin' ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-purple-200" />
              <div className="text-left">
                <div className="leading-none">Switch to ID #3</div>
                <div className="text-[10px] text-purple-200 font-semibold mt-0.5">Admin & Higher Authority (ALL ACCESS)</div>
              </div>
            </div>
            <span className="text-xs font-bold bg-purple-500/80 px-2 py-0.5 rounded">Select</span>
          </button>
        </div>
      </div>

      <button
        onClick={onBackToFeed}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Citizen Home Feed</span>
      </button>
    </div>
  );
};
