import React from 'react';
import { ArrowRight, Store, Users, Truck, MapPin } from 'lucide-react';

export default function Home({ onNavigate, stats }) {
  return (
    <div className="space-y-16 pb-16 bg-[#FDFBF7]">
      {/* 1. HERO SECTION - Exact original layout with Burgundy & Off-White palette */}
      <section className="relative pt-8 pb-12 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
              SURPLUS TO SHELTER • REAL-TIME FOOD ROUTING
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#581C25]">
              PlateRelay:<br />
              <span className="text-[#C5A059]">Every Meal Gets Three Chances</span>
            </h1>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-xl">
              Good food shouldn't go to waste. PlateRelay rescues surplus food from businesses and delivers it to people and communities in need — in <strong className="text-[#581C25]">3 simple stages</strong>.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => onNavigate('deals')}
                className="bg-[#581C25] hover:bg-[#7A2A38] text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md transition-all"
              >
                <span>Rescue Food Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => onNavigate('post')}
                className="bg-white border-2 border-[#581C25] text-[#581C25] hover:bg-[#581C25] hover:text-white font-bold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Hero Right Image with Floating Handwritten Callout */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative z-10 max-w-md lg:max-w-lg w-full">
              <img 
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80" 
                alt="Gourmet Biryani Bowl"
                className="w-full h-80 sm:h-96 object-cover rounded-3xl border-2 border-[#581C25] shadow-2xl"
              />
              
              {/* Floating Callout Card */}
              <div className="absolute -top-4 -right-4 bg-[#581C25] text-white p-4 rounded-2xl shadow-xl hidden sm:block rotate-3 border border-[#C5A059]">
                <p className="font-serif italic text-[#F4E8C1] text-sm font-bold leading-tight">
                  Good Food<br />
                  Deserves a<br />
                  Second Chance ♡
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3-STAGE CASCADE SECTION */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">THE 3-STAGE CASCADE</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#581C25]">From Surplus to Smiles</h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Our 3-stage model ensures good food reaches the right people — quickly, safely and sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md relative overflow-hidden group hover:border-[#581C25] transition-all">
            <span className="absolute top-4 right-4 text-4xl font-serif font-extrabold text-[#581C25]/10">01</span>
            <div className="w-12 h-12 rounded-xl bg-[#581C25] text-white flex items-center justify-center font-bold mb-4 shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#581C25]">STAGE 1</span>
            <h3 className="font-serif text-xl font-bold text-[#581C25] mt-1 mb-2">Rescue Deals</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Restaurants, hotels, cafes and food businesses list surplus food at discounted prices instead of throwing it away.
            </p>
            <button 
              onClick={() => onNavigate('deals')}
              className="text-xs font-bold text-[#581C25] hover:underline flex items-center space-x-1"
            >
              <span>Good food, less waste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stage 2 Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md relative overflow-hidden group hover:border-[#581C25] transition-all">
            <span className="absolute top-4 right-4 text-4xl font-serif font-extrabold text-[#581C25]/10">02</span>
            <div className="w-12 h-12 rounded-xl bg-[#581C25] text-white flex items-center justify-center font-bold mb-4 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#581C25]">STAGE 2</span>
            <h3 className="font-serif text-xl font-bold text-[#581C25] mt-1 mb-2">Direct Community Share</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Local individuals, students and families in need can claim food nearby — directly from this platform with zero fees.
            </p>
            <button 
              onClick={() => onNavigate('deals')}
              className="text-xs font-bold text-[#581C25] hover:underline flex items-center space-x-1"
            >
              <span>Real people, real meals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stage 3 Card */}
          <div className="bg-[#581C25] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:bg-[#4A1521] transition-all border border-[#581C25]">
            <span className="absolute top-4 right-4 text-4xl font-serif font-extrabold text-white/10">03</span>
            <div className="w-12 h-12 rounded-xl bg-white text-[#581C25] flex items-center justify-center font-bold mb-4 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F4E8C1]">STAGE 3</span>
            <h3 className="font-serif text-xl font-bold text-white mt-1 mb-2">NGO Rescue Run</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Remaining surplus is collected by verified NGOs and distributed to shelters, old age homes and community kitchens.
            </p>
            <button 
              onClick={() => onNavigate('ngo')}
              className="text-xs font-bold text-[#F4E8C1] hover:underline flex items-center space-x-1"
            >
              <span>No food goes to waste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. LIVE IMPACT MAP BANNER */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border-2 border-[#581C25] shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">LIVE IMPACT MAP</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">Food Finds Its People</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Discover nearby rescue deals, community pickups and NGO distribution points — all on one map.
              </p>
              <button 
                onClick={() => onNavigate('donate-spot')}
                className="bg-[#581C25] hover:bg-[#7A2A38] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-md"
              >
                <span>Explore Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-4 pt-2 text-xs text-gray-700">
                <span className="flex items-center space-x-1.5 font-bold">
                  <span className="w-3 h-3 rounded-full bg-[#581C25]" />
                  <span>Rescue Deal</span>
                </span>
                <span className="flex items-center space-x-1.5 font-bold">
                  <span className="w-3 h-3 rounded-full bg-emerald-700" />
                  <span>Community Share</span>
                </span>
                <span className="flex items-center space-x-1.5 font-bold">
                  <span className="w-3 h-3 rounded-full bg-amber-700" />
                  <span>NGO Run</span>
                </span>
              </div>
            </div>

            {/* Simulated Vector Map Graphic */}
            <div className="lg:col-span-7 bg-[#FDFBF7] rounded-xl p-4 border border-gray-300 relative h-64 flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute top-1/4 left-1/3 flex items-center space-x-2 bg-[#581C25] text-white border border-[#C5A059] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce">
                <MapPin className="w-4 h-4 text-[#F4E8C1]" />
                <span>Surplus Food @ 40% Off</span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex items-center space-x-2 bg-emerald-800 text-white border border-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Community Pickup (1.2 km)</span>
              </div>

              <div className="absolute bottom-1/4 left-1/4 flex items-center space-x-2 bg-amber-800 text-white border border-amber-400 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Truck className="w-4 h-4 text-amber-300" />
                <span>NGO Distribution (2.4 km)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR IMPACT NUMBERS */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">OUR IMPACT</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#581C25]">
              {stats?.meals_rescued ? stats.meals_rescued.toLocaleString() : '12,480'}+
            </span>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-2">Meals Rescued</p>
            <p className="text-xs text-gray-500 mt-1">Real food. Real people. Real change.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
            <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#581C25]">
              {stats?.co2e_saved_kg ? stats.co2e_saved_kg.toLocaleString() : '28,736'} kg
            </span>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-2">CO2e Saved</p>
            <p className="text-xs text-gray-500 mt-1">Less waste. A greener tomorrow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
