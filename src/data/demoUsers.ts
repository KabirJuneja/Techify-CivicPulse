import { UserProfile, UserRole } from '../types';

export interface DemoUser extends UserProfile {
  id: string;
  pin: string;
  roleNumber: 1 | 2 | 3;
  roleTitle: string;
  roleBadgeText: string;
  badgeColor: string;
  accessSummary: string;
  description: string;
  allowedPortals: string[];
}

export const DEMO_USERS: Record<UserRole, DemoUser> = {
  // 1. Normal Citizen User
  citizen: {
    id: 'CITIZEN-001',
    name: 'Rahul Sharma',
    handle: 'rahul_citizen',
    phone: '9876543210',
    pin: '1234',
    ward: 'Ward 14 • Navrangpura',
    role: 'citizen',
    roleNumber: 1,
    roleTitle: 'Normal Citizen User',
    roleBadgeText: 'Normal Citizen',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accessSummary: 'Standard Citizen Access • Feed, Complaints, Map & Events',
    description: 'Can post civic reports, RSVP drives, join local community groups, and track personal complaints. Authority Desk & Commissioner Portal are restricted.',
    allowedPortals: ['home', 'explore', 'nearby', 'city_hub', 'city_map', 'my_reports', 'communities', 'events', 'profile'],
    civicScore: 480,
    level: 'Level 3 City Guardian',
    ptsToNextLevel: 20,
    reportedCount: 18,
    resolvedCount: 15,
    upvotesReceived: 142,
    avatarUrl: '/src/assets/images/rahul_sharma_avatar_1789742493368.jpg'
  },

  // 2. Only Authority User (AMC Ward Officer Desk)
  authority: {
    id: 'AUTH-WARD-014',
    name: 'Er. Vikram Solanki',
    handle: 'amc_ward14_desk',
    phone: '9876543211',
    pin: '2222',
    ward: 'Navrangpura Ward #14 Sub-Zonal Desk',
    role: 'authority',
    roleNumber: 2,
    roleTitle: 'AMC Ward Officer Desk',
    roleBadgeText: 'AMC Ward Officer Desk',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accessSummary: 'Citizen Access + AMC Ward Officer Desk Unlocked',
    description: 'Ward Authority ID: Can inspect complaints, dispatch municipal repair trucks, assign field squads, and resolve citizen tickets. Commissioner Audit Portal is restricted.',
    allowedPortals: ['home', 'explore', 'nearby', 'city_hub', 'city_map', 'my_reports', 'communities', 'events', 'authority_portal', 'profile'],
    civicScore: 920,
    level: 'AMC Ward 14 Executive Desk',
    ptsToNextLevel: 80,
    reportedCount: 42,
    resolvedCount: 118,
    upvotesReceived: 620,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },

  // 3. Admin & Higher Authority User (ALL ACCESS)
  admin: {
    id: 'ADMIN-EXEC-001',
    name: 'Dr. M. Thennarasan, IAS',
    handle: 'commissioner_amc',
    phone: '9876543212',
    pin: '9999',
    ward: 'AMC Central Headquarters (All 48 Wards)',
    role: 'admin',
    roleNumber: 3,
    roleTitle: 'Admin & Higher Authority (ALL ACCESS)',
    roleBadgeText: 'Municipal Admin • ALL ACCESS',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    accessSummary: 'Full Website ALL ACCESS • Ward Desk & Commissioner Portal',
    description: 'Higher Municipal Authority & Super Admin: Complete website ALL ACCESS including Commissioner Audit Portal, AMC Ward Officer Desk, city-wide SLA audits, and administrative overrides.',
    allowedPortals: ['home', 'explore', 'nearby', 'city_hub', 'city_map', 'my_reports', 'communities', 'events', 'authority_portal', 'high_authority', 'profile'],
    civicScore: 2450,
    level: 'Municipal Commissioner & Super Admin',
    ptsToNextLevel: 0,
    reportedCount: 120,
    resolvedCount: 840,
    upvotesReceived: 3120,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
};

export const DEMO_USER_LIST: DemoUser[] = [
  DEMO_USERS.citizen,
  DEMO_USERS.authority,
  DEMO_USERS.admin
];

export const canAccessWardDesk = (role?: UserRole): boolean => {
  return role === 'authority' || role === 'admin';
};

export const canAccessCommissionerPortal = (role?: UserRole): boolean => {
  return role === 'admin';
};
