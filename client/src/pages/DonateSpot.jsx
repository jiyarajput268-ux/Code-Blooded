import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Car, Truck, Search, PlusCircle, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import { API_BASE } from '../config/api';

export default function DonateSpot({ onNavigate }) {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('self');
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpot, setNewSpot] = useState({ name: '', kind: 'community', capacity_total: 50 });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/spots`);
      const data = await res.json();
      setSpots(data);
      if (data.length > 0) setSelectedSpot(data[0]);
    } catch (err) {
      console.error("Error fetching spots:", err);
    }
  };

  // Initialize Real OpenStreetMap via Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || spots.length === 0) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([26.9000, 75.8000], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for Temples, Shelters, NGOs
    spots.forEach((spot) => {
      const isNGO = spot.kind === 'ngo';
      const pinColor = isNGO ? '#047857' : '#581C25';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${pinColor};
            color: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid white;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${isNGO ? '🏢 NGO' : '🛕 Temple/Shelter'}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <b style="color: #581C25; font-size: 13px;">${spot.name}</b><br/>
          <span style="font-size: 11px; color: #4B5563;">${spot.verified_level}</span><br/>
          <small style="color: #047857; font-weight: bold;">Accepting ${spot.capacity_total - spot.capacity_used} meals today</small>
        </div>
      `);

      marker.on('click', () => {
        setSelectedSpot(spot);
      });
    });

  }, [spots]);

  const handleConfirmDonation = () => {
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      onNavigate('runner');
    }, 2000);
  };

  const handleCreateCustomSpot = async (e) => {
    e.preventDefault();
    if (!newSpot.name.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSpot.name,
          kind: newSpot.kind,
          description: 'Community food pickup spot created by donor',
          lat: 26.9000 + (Math.random() - 0.5) * 0.04,
          lng: 75.8000 + (Math.random() - 0.5) * 0.04,
          capacity_total: 50
        })
      });

      if (res.ok) {
        const createdSpot = await res.json();
        setShowAddModal(false);
        setNewSpot({ name: '', kind: 'community', capacity_total: 50 });
        
        const freshRes = await fetch(`${API_BASE}/api/spots`);
        const freshData = await freshRes.json();
        setSpots(freshData);
        setSelectedSpot(createdSpot);
      }
    } catch (err) {
      console.error("Error creating spot:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
            GOOD FOOD REACHES FARTHER TOGETHER
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
            Donate to a Spot
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg">
            Choose a verified community spot or NGO near you and make a difference.
          </p>
        </div>

        {/* Impact stats badge */}
        <div className="flex items-center space-x-4 bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="text-center">
            <span className="font-serif text-lg font-bold text-[#581C25]">12,480+</span>
            <p className="text-[9px] text-gray-500 uppercase font-bold">Meals Donated</p>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-center">
            <span className="font-serif text-lg font-bold text-[#581C25]">28,736 kg</span>
            <p className="text-[9px] text-gray-500 uppercase font-bold">CO2e Saved</p>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Selected Spot Detail Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-[#581C25] shadow-lg space-y-5">
          {donationSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-[#581C25]">
                Donation Confirmed!
              </h3>
              <p className="text-xs text-gray-600">
                {deliveryOption === 'runner' 
                  ? 'Volunteer runner has been dispatched for pickup!' 
                  : 'Thank you! Please deliver to the spot address.'}
              </p>
            </div>
          ) : selectedSpot ? (
            <>
              {/* Spot Header Info */}
              <div className="space-y-2">
                <div className="h-40 rounded-xl overflow-hidden bg-gray-100 relative">
                  <img 
                    src={selectedSpot.image_url || "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80"}
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#581C25] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                    {selectedSpot.verified_level}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1F2937]">
                  {selectedSpot.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedSpot.description}
                </p>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 p-3 rounded-xl bg-[#FDFBF7] border border-gray-200">
                <div className="flex justify-between text-xs font-bold text-[#581C25]">
                  <span>Daily Capacity</span>
                  <span>Accepting {selectedSpot.capacity_total - selectedSpot.capacity_used} meals today</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#581C25] h-full rounded-full"
                    style={{ width: `${(selectedSpot.capacity_used / selectedSpot.capacity_total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 text-right">
                  {selectedSpot.capacity_used} / {selectedSpot.capacity_total} portions
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Preferences</span>
                  <strong className="text-[#581C25] text-xs font-bold">{selectedSpot.food_preferences}</strong>
                </div>

                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Distance</span>
                  <strong className="text-[#581C25] text-xs font-bold">📍 {selectedSpot.distance_km || 1.8} km away</strong>
                </div>
              </div>

              {/* Delivery Option Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1F2937]">Delivery Option</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('self')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryOption === 'self'
                        ? 'bg-[#581C25] text-white border-[#581C25]'
                        : 'bg-[#FDFBF7] border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4" />
                      <span className="font-bold text-xs">Self Deliver</span>
                    </div>
                    <span className="text-[9px] opacity-80 mt-1">I will drop the food myself</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('runner')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryOption === 'runner'
                        ? 'bg-[#581C25] text-white border-[#581C25]'
                        : 'bg-[#FDFBF7] border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-bold text-xs">Request Runner</span>
                    </div>
                    <span className="text-[9px] opacity-80 mt-1">Volunteer driver picks it up</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmDonation}
                className="w-full bg-[#581C25] hover:bg-[#7A2A38] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Confirm Donation to This Spot →
              </button>
            </>
          ) : null}
        </div>

        {/* Right Column: REAL OPENSTREETMAP LEAFLET CONTAINER */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-3.5 py-2 flex-1 text-xs shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search area or spot name..."
                className="w-full bg-transparent text-[#1F2937] placeholder-gray-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white border-2 border-[#581C25] text-[#581C25] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#581C25] hover:text-white transition-all flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Drop Custom Pin</span>
            </button>
          </div>

          {/* Interactive OpenStreetMap Container */}
          <div className="bg-white p-2 border border-gray-200 h-[480px] relative overflow-hidden rounded-2xl shadow-md">
            
            {/* Real Leaflet Map DOM Element */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-full rounded-xl overflow-hidden z-10"
            />

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-gray-300 text-[10px] space-y-1.5 z-20 shadow-md">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#581C25] border border-white" />
                <span className="text-[#1F2937] font-bold">Community Spot (Temple / Shelter)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-700 border border-white" />
                <span className="text-emerald-900 font-bold">Verified NGO Spot</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomSpot} className="bg-white max-w-md w-full p-6 rounded-2xl space-y-4 border-2 border-[#581C25] shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-[#581C25]">Drop Custom Spot Pin</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Spot Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Gurudwara Langar Hall"
                value={newSpot.name}
                onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#1F2937] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Kind *</label>
              <select
                value={newSpot.kind}
                onChange={(e) => setNewSpot({ ...newSpot, kind: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-3 py-2 text-xs text-[#1F2937]"
              >
                <option value="community">Community Spot (Temple, langar, shelter)</option>
                <option value="ngo">NGO Spot (Verified center)</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-[#581C25] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Save Spot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
