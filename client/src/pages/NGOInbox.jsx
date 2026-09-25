import React, { useState, useEffect } from 'react';
import { Clock, Check, Sparkles, Sliders } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function NGOInbox({ onNavigate }) {
  const [offers, setOffers] = useState([]);
  const [capacity, setCapacity] = useState(50);
  const [selectedExplainer, setSelectedExplainer] = useState(null);
  const [acceptedMatches, setAcceptedMatches] = useState({});

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ngo/offers`);
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error("Error fetching NGO offers:", err);
    }
  };

  const handleAccept = (offerId) => {
    setAcceptedMatches({ ...acceptedMatches, [offerId]: true });
    setTimeout(() => {
      onNavigate('runner');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Header & Capacity Settings Panel */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
            NGO PARTNER DASHBOARD
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
            NGO Inbox
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg">
            Matched surplus food from businesses and communities, ready for your people.
          </p>
        </div>

        {/* Capacity Settings Panel */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#581C25] shadow-md w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="space-y-1 min-w-[200px]">
            <div className="flex justify-between text-xs font-bold text-[#581C25]">
              <span className="flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Daily Limit</span>
              </span>
              <span>{capacity} meals/day</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
              className="w-full accent-[#581C25] cursor-pointer"
            />
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block" />

          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase block font-bold">Preferences</span>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                🍃 Veg Only
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#581C25]/10 text-[#581C25] text-[10px] font-bold border border-[#581C25]/30">
                🍲 Cooked Meals
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Matched Food Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-xl font-bold text-[#581C25]">Incoming Matched Food</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#581C25] text-white text-xs font-bold shadow-sm">
              {offers.length} New Matches
            </span>
          </div>

          <span className="text-xs text-gray-500">Sorted by: Best Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, idx) => {
            const { listing, match_score } = offer;
            const isAccepted = acceptedMatches[listing.id];

            return (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4 relative overflow-hidden group hover:border-[#581C25] transition-all"
              >
                <div className="flex gap-4">
                  {/* Photo */}
                  <img 
                    src={listing.photo_url || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"}
                    alt={listing.title}
                    className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                  />

                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#581C25]">
                      {listing.computed_stage?.badge || 'STAGE 3: NGO BULK RESCUE'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1F2937]">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-[#581C25] font-bold">{listing.donor_name}</p>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-600 pt-1">
                      <span>👥 {listing.portions} portions</span>
                      <span>📍 {listing.pickup_address ? listing.pickup_address.split(',')[0] : '1.2 km away'}</span>
                    </div>
                  </div>
                </div>

                {/* Acceptance Timer & Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1.5 text-xs text-[#581C25] font-bold">
                    <Clock className="w-4 h-4 text-[#581C25]" />
                    <span>Accept within <strong>10:00 mins</strong></span>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    {isAccepted ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 shadow-sm">
                        <Check className="w-4 h-4" />
                        <span>Accepted! Runner Dispatched</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAccept(listing.id)}
                          className="flex-1 sm:flex-initial bg-[#581C25] hover:bg-[#7A2A38] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
                        >
                          Accept
                        </button>
                        <button className="px-3 py-2 rounded-xl border border-red-300 text-red-700 text-xs font-bold hover:bg-red-50">
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* View Match Explainer Score Button */}
                <button
                  onClick={() => setSelectedExplainer(offer)}
                  className="w-full py-2.5 rounded-xl border border-[#581C25] bg-[#FDFBF7] text-xs font-bold text-[#581C25] hover:bg-[#581C25] hover:text-white flex items-center justify-center space-x-1 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Match Explainer Score ({match_score}/100)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MATCH EXPLAINER MODAL OVERLAY */}
      {selectedExplainer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl space-y-5 relative border-2 border-[#581C25] shadow-2xl">
            <button 
              onClick={() => setSelectedExplainer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-1 text-[#581C25]">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-serif text-xl font-bold">Match Explainer Breakdown</h3>
              </div>
              <p className="text-[11px] text-gray-500">
                This score shows why this match was suggested to you. Higher score = better match for your NGO.
              </p>
            </div>

            {/* Score Ring Gauge */}
            <div className="flex items-center justify-center my-4">
              <div className="w-28 h-28 rounded-full border-4 border-[#581C25] bg-[#FDFBF7] flex flex-col items-center justify-center shadow-md">
                <span className="font-serif text-3xl font-extrabold text-[#581C25]">
                  {selectedExplainer.match_score}
                </span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">/ 100 Score</span>
              </div>
            </div>

            {/* Breakdown meters */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-700 font-semibold">
                <span>Distance (Weight 0.40)</span>
                <span className="font-bold text-[#581C25]">{selectedExplainer.breakdown?.distanceScore || 32} / 40</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#581C25] h-full" style={{ width: `${((selectedExplainer.breakdown?.distanceScore || 32)/40)*100}%` }} />
              </div>

              <div className="flex justify-between items-center text-gray-700 font-semibold pt-1">
                <span>Capacity Fit (Weight 0.25)</span>
                <span className="font-bold text-[#581C25]">{selectedExplainer.breakdown?.capacityScore || 18} / 25</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full" style={{ width: `${((selectedExplainer.breakdown?.capacityScore || 18)/25)*100}%` }} />
              </div>

              <div className="flex justify-between items-center text-gray-700 font-semibold pt-1">
                <span>Urgency Need (Weight 0.20)</span>
                <span className="font-bold text-[#581C25]">{selectedExplainer.breakdown?.needScore || 14} / 20</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: `${((selectedExplainer.breakdown?.needScore || 14)/20)*100}%` }} />
              </div>
            </div>

            <button
              onClick={() => setSelectedExplainer(null)}
              className="w-full bg-[#581C25] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
