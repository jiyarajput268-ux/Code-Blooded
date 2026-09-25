import React, { useState } from 'react';
import { Utensils, Clock, User } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, clockState, refreshClock }) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentRole, setCurrentRole] = useState('donor');

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'deals', label: 'BROWSE DEALS' },
    { id: 'post', label: 'POST SURPLUS' },
    { id: 'donate-spot', label: 'DONATE TO A SPOT' },
    { id: 'ngo', label: 'NGO INBOX' },
    { id: 'runner', label: 'VOLUNTEER' },
    { id: 'dashboard', label: 'IMPACT DASHBOARD' },
  ];

  const roles = [
    { id: 'donor', label: 'Donor (Restaurant/Caterer)', badge: 'Posting Surplus' },
    { id: 'buyer', label: 'Buyer / Public Claimer', badge: 'Browsing Deals' },
    { id: 'recipient', label: 'NGO / Recipient', badge: 'Receiving Food' },
    { id: 'runner', label: 'Volunteer Runner', badge: 'Delivering Food' },
    { id: 'admin', label: 'Admin / Judge', badge: 'Demo Clock Control' },
  ];

  return (
    <>
      {/* Top Navbar Header matching Ella's Table Burgundy Bar */}
      <header className="sticky top-0 z-40 bg-[#581C25] text-white shadow-md border-b border-[#3D1219] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#581C25] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-[#581C25]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white block leading-tight">
                PlateRelay
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#F4E8C1] block">SURPLUS TO SHELTER</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold tracking-widest transition-all ${
                    isActive
                      ? 'bg-white text-[#581C25] shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Clock Badge & Role Selector */}
          <div className="flex items-center space-x-3">
            {clockState?.is_simulated && (
              <div 
                onClick={() => setActivePage('dashboard')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C5A059] text-white text-xs font-bold animate-pulse cursor-pointer shadow-sm"
              >
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>Simulated (+{clockState.simulated_offset_minutes}m)</span>
              </div>
            )}

            <button
              onClick={() => setShowRoleModal(!showRoleModal)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white text-[#581C25] hover:bg-[#FDFBF7] transition-all text-xs font-bold shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#581C25]" />
              <span className="capitalize">{currentRole} Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Role Selector Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full rounded-2xl border-2 border-[#581C25] shadow-2xl relative">
            <h3 className="font-serif text-2xl font-bold text-[#581C25] mb-1">Switch Demo Role</h3>
            <p className="text-xs text-[#4B5563] mb-4">Select a persona to test role-specific features:</p>
            
            <div className="space-y-2 mb-5">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setShowRoleModal(false);
                    if (r.id === 'donor') setActivePage('post');
                    if (r.id === 'buyer') setActivePage('deals');
                    if (r.id === 'recipient') setActivePage('ngo');
                    if (r.id === 'runner') setActivePage('runner');
                    if (r.id === 'admin') setActivePage('dashboard');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                    currentRole === r.id
                      ? 'bg-[#581C25] text-white border-[#581C25]'
                      : 'bg-[#FDFBF7] border-gray-200 text-[#1F2937] hover:border-[#581C25]'
                  }`}
                >
                  <span className="text-sm font-bold">{r.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#581C25] font-semibold">
                    {r.badge}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
