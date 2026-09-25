import React, { useState, useEffect } from 'react';
import { Clock, Play, RotateCcw, Share2, Download, QrCode } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function Dashboard({ clockState, refreshClock }) {
  const [stats, setStats] = useState(null);
  const [selectedJump, setSelectedJump] = useState(60);
  const [applyingTime, setApplyingTime] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [clockState]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const handleApplyTimeJump = async (minutes) => {
    setApplyingTime(true);
    try {
      await fetch(`${API_BASE}/api/clock/offset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes: minutes || selectedJump })
      });
      refreshClock();
    } catch (err) {
      console.error("Error updating simulated time:", err);
    } finally {
      setApplyingTime(false);
    }
  };

  const handleResetClock = async () => {
    try {
      await fetch(`${API_BASE}/api/clock/offset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      });
      refreshClock();
    } catch (err) {
      console.error("Error resetting clock:", err);
    }
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const simDateFormatted = new Date(clockState?.simulated_time || Date.now()).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
            REAL FOOD • REAL IMPACT • A BRIGHTER TOMORROW
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
            Impact Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg">
            Live insights into meals rescued, resources saved, and stronger communities — powered by simulation.
          </p>
        </div>

        <blockquote className="font-serif italic text-xs text-[#581C25] text-right border-l-2 border-[#581C25] pl-3 hidden md:block">
          "A kinder food system is a brighter future."<br />
          <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-gray-400">— PLATERELAY</span>
        </blockquote>
      </div>

      {/* ADMIN DEMO CLOCK CONTROLLER PANEL */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#581C25] shadow-lg space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#581C25] text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#581C25]">
                Admin Demo Clock Controller
              </h2>
              <p className="text-xs text-gray-500">
                Fast-forward simulated time to see real-time impact changes across the dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A059] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>SIMULATED TIME ACTIVE</span>
            </span>

            <div className="text-right text-xs">
              <span className="text-[10px] text-gray-400 block font-bold uppercase">Simulated Date & Time</span>
              <strong className="text-[#581C25] font-mono font-bold">{simDateFormatted}</strong>
            </div>
          </div>
        </div>

        {/* Jump Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 w-full md:w-auto">
            <label className="text-xs font-bold text-gray-700 block">Jump Forward By:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleApplyTimeJump(15)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  selectedJump === 15 
                    ? 'bg-[#581C25] text-white border-[#581C25]' 
                    : 'bg-[#FDFBF7] border-gray-300 text-gray-700 hover:border-[#581C25]'
                }`}
              >
                +15m
              </button>

              <button
                onClick={() => handleApplyTimeJump(60)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  selectedJump === 60 
                    ? 'bg-[#581C25] text-white border-[#581C25]' 
                    : 'bg-[#FDFBF7] border-gray-300 text-gray-700 hover:border-[#581C25]'
                }`}
              >
                +1h
              </button>

              <button
                onClick={() => handleApplyTimeJump(240)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  selectedJump === 240 
                    ? 'bg-[#581C25] text-white border-[#581C25]' 
                    : 'bg-[#FDFBF7] border-gray-300 text-gray-700 hover:border-[#581C25]'
                }`}
              >
                +4h
              </button>

              <button
                onClick={handleResetClock}
                className="px-3.5 py-2 rounded-xl border border-red-300 text-red-700 text-xs font-bold hover:bg-red-50 flex items-center space-x-1 ml-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => handleApplyTimeJump(60)}
            disabled={applyingTime}
            className="w-full md:w-auto bg-[#581C25] hover:bg-[#7A2A38] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{applyingTime ? 'Updating...' : '▶▶ Apply Time Jump'}</span>
          </button>
        </div>
      </div>

      {/* 4 LARGE IMPACT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl text-center space-y-2 border border-gray-200 shadow-md">
          <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#581C25] block">
            {stats?.meals_rescued ? stats.meals_rescued.toLocaleString() : '1,250'}+
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Meals Rescued</p>
          <p className="text-[10px] text-gray-500">Nutritious food redirected from waste to people.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl text-center space-y-2 border border-gray-200 shadow-md">
          <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#581C25] block">
            {stats?.food_saved_kg ? stats.food_saved_kg.toLocaleString() : '850'} kg
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Food Saved</p>
          <p className="text-[10px] text-gray-500">High-quality food kept in the community.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl text-center space-y-2 border border-gray-200 shadow-md">
          <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#581C25] block">
            {stats?.co2e_saved_kg ? stats.co2e_saved_kg.toLocaleString() : '2,125'} kg
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">CO2e Offset</p>
          <p className="text-[10px] text-gray-500">Equivalent to removing ~1 car from the road for a month.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl text-center space-y-2 border border-gray-200 shadow-md">
          <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#581C25] block">
            {stats?.active_donors || '120'}
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Active Donors</p>
          <p className="text-[10px] text-gray-500">Local businesses making a difference.</p>
        </div>
      </div>

      {/* PRINTABLE IMPACT RECEIPT CARD */}
      <div className="bg-white p-8 rounded-2xl space-y-6 border-2 border-[#581C25] shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#581C25] text-white flex items-center justify-center font-bold text-xl shadow-md">
              🍃
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wide text-[#581C25]">
                PlateRelay
              </span>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Good Food Greater Tomorrow</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-[#581C25] uppercase font-bold block">
              ID {stats?.receipt?.id || '#PR-2025-0422-007'}
            </span>
            <p className="text-xs text-gray-500">
              {stats?.receipt?.date_range || 'Apr 8, 2025 - Apr 22, 2025'}
            </p>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-serif text-3xl font-bold text-[#581C25]">
            Impact Receipt
          </h3>
          <p className="text-xs text-gray-600">
            A record of real change. Powered by people like you.
          </p>
        </div>

        {/* Receipt Table */}
        <div className="bg-[#FDFBF7] rounded-xl p-6 border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-serif text-2xl font-bold text-[#581C25]">
              {stats?.meals_rescued ? stats.meals_rescued.toLocaleString() : '1,250'}+
            </span>
            <p className="text-[10px] uppercase text-gray-500 mt-1 font-bold">Meals Rescued</p>
          </div>

          <div>
            <span className="font-serif text-2xl font-bold text-[#581C25]">
              {stats?.food_saved_kg ? stats.food_saved_kg.toLocaleString() : '850'} kg
            </span>
            <p className="text-[10px] uppercase text-gray-500 mt-1 font-bold">Food Saved</p>
          </div>

          <div>
            <span className="font-serif text-2xl font-bold text-[#581C25]">
              {stats?.co2e_saved_kg ? stats.co2e_saved_kg.toLocaleString() : '2,125'} kg
            </span>
            <p className="text-[10px] uppercase text-gray-500 mt-1 font-bold">CO2e Offset</p>
          </div>

          <div>
            <span className="font-serif text-2xl font-bold text-[#581C25]">
              {stats?.active_donors || '120'}
            </span>
            <p className="text-[10px] uppercase text-gray-500 mt-1 font-bold">Active Donors</p>
          </div>
        </div>

        {/* Bottom Actions & QR Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <div className="flex items-center space-x-3 text-xs text-gray-700">
            <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-gray-200 text-center">
              <QrCode className="w-8 h-8 text-[#581C25] mx-auto" />
            </div>
            <div>
              <p className="font-bold text-[#1F2937]">Scan to view this impact online.</p>
              <p className="text-[10px] text-gray-400 font-mono">platerelay.org/impact/PR-2025-0422-007</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadReceipt}
              className="flex-1 sm:flex-initial border-2 border-[#581C25] text-[#581C25] hover:bg-[#581C25] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button 
              onClick={handleDownloadReceipt}
              className="flex-1 sm:flex-initial bg-[#581C25] hover:bg-[#7A2A38] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
