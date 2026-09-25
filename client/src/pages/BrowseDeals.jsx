import React, { useState, useEffect } from 'react';
import { Search, Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function BrowseDeals({ onNavigate }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [searchQuery, activeFilter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/listings`;
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (activeFilter === 'stage1') params.append('stage', '1');
      if (activeFilter === 'stage2') params.append('stage', '2');
      if (activeFilter === 'veg') params.append('veg', '1');
      
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimListing = async (listing) => {
    try {
      const type = listing.computed_stage.stage === 1 ? 'reserve' : 'claim';
      const res = await fetch(`${API_BASE}/api/listings/${listing.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimed_by: 'Rahul Sharma', type })
      });
      if (res.ok) {
        setClaimSuccess(true);
        setTimeout(() => {
          setSelectedMeal(null);
          setClaimSuccess(false);
          fetchListings();
        }, 1800);
      }
    } catch (err) {
      console.error("Error claiming listing:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Page Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
          REAL FOOD • LESS WASTE • MORE IMPACT
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
          Browse Rescue Deals & Free Share Feed
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
          Great food, at great value. Save surplus meals from local businesses and give them a second chance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-3xl">
        <div className="flex items-center bg-white border border-gray-300 rounded-full p-1.5 shadow-sm focus-within:border-[#581C25] transition-all">
          <Search className="w-5 h-5 text-gray-400 ml-3.5" />
          <input 
            type="text"
            placeholder="Search by food, restaurant or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none"
          />
          <button 
            onClick={fetchListings}
            className="bg-[#581C25] hover:bg-[#7A2A38] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
          >
            <span>Search</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeFilter === 'all'
              ? 'bg-[#581C25] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#581C25]'
          }`}
        >
          All Deals
        </button>

        <button
          onClick={() => setActiveFilter('stage1')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeFilter === 'stage1'
              ? 'bg-[#581C25] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#581C25]'
          }`}
        >
          🏷️ Stage 1: 50-70% Off
        </button>

        <button
          onClick={() => setActiveFilter('stage2')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeFilter === 'stage2'
              ? 'bg-[#581C25] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#581C25]'
          }`}
        >
          🌱 Stage 2: Free Share
        </button>

        <button
          onClick={() => setActiveFilter('veg')}
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
            activeFilter === 'veg'
              ? 'bg-[#581C25] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#581C25]'
          }`}
        >
          🍃 Veg Only
        </button>
      </div>

      {/* 3x3 Card Grid */}
      {loading ? (
        <div className="py-16 text-center text-gray-500 text-sm">
          Loading surplus food deals...
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 space-y-2">
          <p className="font-serif text-lg font-bold text-[#581C25]">No food listings found</p>
          <p className="text-xs text-gray-500">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((meal) => {
            const isStage1 = meal.computed_stage?.stage === 1;

            return (
              <div 
                key={meal.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md flex flex-col group hover:border-[#581C25] transition-all"
              >
                {/* Image + Top Badges Overlay */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={meal.photo_url || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"}
                    alt={meal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Stage Discount Badge */}
                  <div className="absolute top-3 left-3 bg-[#581C25] text-white px-3 py-1 rounded-md text-xs font-bold shadow-md">
                    {meal.computed_stage?.badge || (isStage1 ? 'STAGE 1: 50% OFF' : 'STAGE 2: FREE SHARE')}
                  </div>

                  {/* Safe-For Ring Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#581C25] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-md border border-gray-200">
                    <Clock className="w-3 h-3 text-[#581C25]" />
                    <span>Safe for {meal.safe_for_text || '2h 45m'}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="font-bold text-[#581C25]">{meal.donor_name}</span>
                      {meal.is_veg === 1 && (
                        <span className="text-[10px] text-emerald-700 font-bold border border-emerald-600 px-1.5 py-0.5 rounded">
                          🍃 Veg
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1F2937] group-hover:text-[#581C25] transition-colors">
                      {meal.title}
                    </h3>
                  </div>

                  {/* Portion & Distance Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <span>👥 {meal.portions} portions left</span>
                    <span className="flex items-center space-x-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#581C25]" />
                      <span>{meal.pickup_address ? meal.pickup_address.split(',')[0] : '1.2 km away'}</span>
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedMeal(meal)}
                    disabled={meal.status === 'RESERVED' || meal.status === 'MATCHED'}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      meal.status === 'RESERVED' || meal.status === 'MATCHED'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#581C25] hover:bg-[#7A2A38] text-white shadow-md'
                    }`}
                  >
                    {meal.status === 'RESERVED' 
                      ? 'RESERVED' 
                      : isStage1 
                      ? 'RESERVE DEAL →' 
                      : 'CLAIM NOW →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reservation Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl border-2 border-[#581C25] shadow-2xl space-y-4">
            {claimSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-[#581C25]">
                  {selectedMeal.computed_stage?.stage === 1 ? 'Deal Reserved Successfully!' : 'Meal Claimed!'}
                </h3>
                <p className="text-xs text-gray-600">
                  Pickup Code: <strong className="text-[#581C25] font-mono text-base">#PR-{selectedMeal.id + 4000}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#581C25]">
                      {selectedMeal.computed_stage?.badge}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1F2937]">
                      {selectedMeal.title}
                    </h3>
                    <p className="text-xs text-[#581C25] font-bold">{selectedMeal.donor_name}</p>
                  </div>

                  <button 
                    onClick={() => setSelectedMeal(null)}
                    className="text-gray-400 hover:text-black font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-gray-200 text-xs space-y-1.5 text-gray-700">
                  <p>📍 <strong>Pickup Address:</strong> {selectedMeal.pickup_address}</p>
                  <p>⏳ <strong>Safe Cutoff:</strong> {new Date(selectedMeal.safe_until).toLocaleTimeString()}</p>
                  <p>👥 <strong>Portions:</strong> {selectedMeal.portions} portions</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleClaimListing(selectedMeal)}
                    className="flex-1 bg-[#581C25] hover:bg-[#7A2A38] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Confirm {selectedMeal.computed_stage?.stage === 1 ? 'Reservation' : 'Claim'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
