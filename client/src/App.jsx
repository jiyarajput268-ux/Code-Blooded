import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SimulatedTimeBanner from './components/SimulatedTimeBanner';
import { API_BASE } from './config/api';

import Home from './pages/Home';
import BrowseDeals from './pages/BrowseDeals';
import PostSurplus from './pages/PostSurplus';
import DonateSpot from './pages/DonateSpot';
import NGOInbox from './pages/NGOInbox';
import RunnerTask from './pages/RunnerTask';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [clockState, setClockState] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchClock();
    fetchStats();
  }, []);

  const fetchClock = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/clock`);
      const data = await res.json();
      setClockState(data);
    } catch (err) {
      console.error("Error fetching clock:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleResetClock = async () => {
    try {
      await fetch(`${API_BASE}/api/clock/offset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      });
      fetchClock();
    } catch (err) {
      console.error("Error resetting clock:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F2937] flex flex-col font-sans">
      
      {/* Top Simulated Time Banner */}
      <SimulatedTimeBanner 
        clockState={clockState}
        onReset={handleResetClock}
        onOpenDashboard={() => setActivePage('dashboard')}
      />

      {/* Main Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        clockState={clockState}
        refreshClock={fetchClock}
      />

      {/* Main Active Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <Home onNavigate={setActivePage} stats={stats} />
        )}
        {activePage === 'deals' && (
          <BrowseDeals onNavigate={setActivePage} />
        )}
        {activePage === 'post' && (
          <PostSurplus onNavigate={setActivePage} />
        )}
        {activePage === 'donate-spot' && (
          <DonateSpot onNavigate={setActivePage} />
        )}
        {activePage === 'ngo' && (
          <NGOInbox onNavigate={setActivePage} />
        )}
        {activePage === 'runner' && (
          <RunnerTask onNavigate={setActivePage} />
        )}
        {activePage === 'dashboard' && (
          <Dashboard clockState={clockState} refreshClock={fetchClock} />
        )}
      </main>

      {/* Global Footer matching reference photo Burgundy Bar */}
      <footer className="bg-[#3D1219] text-white py-10 px-4 lg:px-8 text-xs border-t border-[#4A1521]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-[#F4E8C1] block">
              PlateRelay
            </span>
            <p className="text-[11px] text-white/70">
              Surplus to Shelter Food Rescue Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-bold tracking-wider uppercase">
            <button onClick={() => setActivePage('home')} className="hover:text-[#F4E8C1]">Home</button>
            <button onClick={() => setActivePage('deals')} className="hover:text-[#F4E8C1]">Browse Deals</button>
            <button onClick={() => setActivePage('post')} className="hover:text-[#F4E8C1]">Post Surplus</button>
            <button onClick={() => setActivePage('donate-spot')} className="hover:text-[#F4E8C1]">Donate to Spot</button>
            <button onClick={() => setActivePage('dashboard')} className="hover:text-[#F4E8C1]">Impact</button>
          </div>

          <div className="text-[10px] text-white/50">
            © 2026 PlateRelay. Every meal gets three chances.
          </div>
        </div>
      </footer>
    </div>
  );
}
