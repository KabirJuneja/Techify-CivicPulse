import React, { useState } from 'react';
import { X, Check, Lock, ArrowRight, ShieldCheck, UserCheck, Key, Sparkles, Mail, Globe, Building2 } from 'lucide-react';
import { Language, UserRole } from '../types';
import { auth, googleProvider, createUserProfileDocument } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { DEMO_USERS } from '../data/demoUsers';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess?: (role?: UserRole) => void;
}

export default function JoinModal({ isOpen, onClose, language, onLoginSuccess }: JoinModalProps) {
  const [authMode, setAuthMode] = useState<'demo' | 'email' | 'signup'>('demo');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfileDocument(result.user, {
        displayName: result.user.displayName || 'Ahmedabad Citizen',
        email: result.user.email || '',
      });
      setIsSubmitting(false);
      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Google Authentication failed.');
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (authMode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfileDocument(result.user, {
          displayName: displayName || 'Ahmedabad Citizen',
          email,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setIsSubmitting(false);
      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Authentication failed. Check credentials.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(role);
          onClose();
        }, 600);
      }
    }, 400);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phone)) {
      alert(language === 'en' ? 'Please enter a valid 10-digit Indian phone number' : 'કૃપા કરીને સાચો ૧૦ આંકડાનો ફોન નંબર લખો');
      return;
    }
    if (phone === '9876543211') {
      setSelectedRole('authority');
      setOtp('2222');
    } else if (phone === '9876543212') {
      setSelectedRole('admin');
      setOtp('9999');
    } else {
      setSelectedRole('citizen');
      setOtp('1234');
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert(language === 'en' ? 'OTP must be 4 digits (use 1234 for Citizen, 2222 for Officer, 9999 for Admin)' : 'OTP ૪ આંકડાનો હોવો જોઈએ');
      return;
    }
    let detectedRole: UserRole = selectedRole;
    if (phone === '9876543211' || otp === '2222') {
      detectedRole = 'authority';
    } else if (phone === '9876543212' || otp === '9999') {
      detectedRole = 'admin';
    }
    setSelectedRole(detectedRole);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(detectedRole);
          onClose();
        }, 600);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-800 text-lg">
              {language === 'en' ? 'Citizen Secure Portal' : 'નાગરિક સુરક્ષિત પોર્ટલ'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">

          {/* Authentication Provider Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-black">
            <button
              type="button"
              onClick={() => setAuthMode('demo')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'demo' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Demo PIN
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'email' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Firebase Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Continue with Google Account</span>
          </button>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Email / Signup Form */}
          {authMode === 'email' || authMode === 'signup' ? (
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3 pt-1">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@ahmedabad.gov.in"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>{authMode === 'signup' ? 'Create Citizen Account' : 'Sign In with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* 3 Demo IDs Callout */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Choose Demo ID (3 Roles Configured)</span>
                </span>
                <span className="text-[9px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Instant Test
                </span>
              </div>

              {/* ID 1: Citizen */}
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        Rahul Sharma
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        Normal Citizen User • Ward 14
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500">
                    Ph: 9876543210 <br /> PIN: 1234
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('citizen')}
                  className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>One-Click Login as Citizen</span>
                </button>
              </div>

              {/* ID 2: Authority User (AMC Ward Officer Desk) */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-xl hover:border-blue-400 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <div className="text-xs font-black text-blue-950 leading-tight">
                        Er. Vikram Solanki
                      </div>
                      <div className="text-[10px] font-bold text-blue-700">
                        AMC Ward Officer Desk (Authority Access)
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono text-blue-700">
                    Ph: 9876543211 <br /> PIN: 2222
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('authority')}
                  className="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>One-Click Login as Ward Officer Desk</span>
                </button>
              </div>

              {/* ID 3: Admin & Higher Authority (ALL ACCESS) */}
              <div className="p-3 bg-purple-50/80 border border-purple-200/90 rounded-xl hover:border-purple-400 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-purple-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <div className="text-xs font-black text-purple-950 leading-tight">
                        Dr. M. Thennarasan, IAS
                      </div>
                      <div className="text-[10px] font-bold text-purple-700">
                        Admin & Higher Authority (ALL ACCESS)
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-mono text-purple-700">
                    Ph: 9876543212 <br /> PIN: 9999
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="w-full mt-2 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-[11px] rounded-lg transition-all shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>One-Click Login as Admin (ALL ACCESS)</span>
                </button>
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                selectedRole === 'admin' ? 'bg-purple-100 text-purple-600' : selectedRole === 'authority' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-lg">
                  Welcome, {DEMO_USERS[selectedRole].name}!
                </h4>
                <p className="text-xs text-slate-500 font-semibold">
                  Logged in as <strong className="text-slate-800">{DEMO_USERS[selectedRole].roleBadgeText}</strong> ({DEMO_USERS[selectedRole].roleTitle}). Launching dashboard...
                </p>
              </div>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {language === 'en' 
                    ? 'Access verified civic tools, neighborhood boards, and follow-up on your AMC complaint progress instantly using phone login.' 
                    : 'ફોન લોગિન દ્વારા ચકાસાયેલ નાગરિક સાધનો, સોસાયટી બોર્ડ અને તમારા AMC પ્રશ્નોના નિવારણ જુઓ.'}
                </p>
              </div>

              {/* Input phone */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  {language === 'en' ? 'Enter 10-Digit Phone Number' : 'મોબાઈલ નંબર દાખલ કરો'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-extrabold text-slate-400">+91</span>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-sm font-black tracking-wide"
                  />
                </div>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{language === 'en' ? 'Generating OTP...' : 'ઓટીપી જનરેટ થઈ રહ્યો છે...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'en' ? 'Get Secure Verification PIN' : 'વેરિફિકેશન પીન મેળવો'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2 justify-center text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted OTP. Secured by National Informatics Infrastructure.</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verify OTP</span>
                <p className="text-xs font-semibold text-slate-500">
                  Sent a 4-digit verification code to +91 {phone.substring(0, 5)} {phone.substring(5)}.
                  <button type="button" onClick={() => setStep(1)} className="text-blue-500 hover:underline ml-1">Edit</button>
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">
                  Enter 4-Digit OTP (Use 1234)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-center text-lg font-black tracking-[1em]"
                />
              </div>

              {/* Verification Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{language === 'en' ? 'Verifying PIN...' : 'ચકાસણી ચાલુ છે...'}</span>
                  </>
                ) : (
                  <span>{language === 'en' ? 'Verify PIN & Enter' : 'પીન ચકાસો અને પ્રવેશ કરો'}</span>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

