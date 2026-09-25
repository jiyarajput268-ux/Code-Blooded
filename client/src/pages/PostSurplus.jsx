import React, { useState } from 'react';
import { Clock, ShieldCheck, Heart, Leaf, Globe, CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { API_BASE } from '../config/api';

const DISH_PRESETS = [
  { name: 'Dal Makhani', emoji: '🍲', photo: '/dal_makhani.png', cat: 'Cooked Meals' },
  { name: 'Gulab Jamun', emoji: '🍮', photo: '/gulab_jamun.png', cat: 'Dairy' },
  { name: 'Steamed Momos', emoji: '🥟', photo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', cat: 'Snacks' },
  { name: 'Shahi Paneer', emoji: '🥘', photo: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', cat: 'Cooked Meals' },
  { name: 'Veg Biryani', emoji: '🍚', photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', cat: 'Cooked Meals' },
  { name: 'Chole Bhature', emoji: '🫓', photo: '/chole_bhature.png', cat: 'Cooked Meals' },
  { name: 'Crispy Samosa', emoji: '🥟', photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', cat: 'Snacks' },
  { name: 'Chocolate Cake', emoji: '🍰', photo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', cat: 'Bakery' }
];

export default function PostSurplus({ onNavigate }) {
  const [formData, setFormData] = useState({
    title: 'Surplus Dal Makhani',
    donorName: 'Urban Tadka',
    category: 'Cooked Meals',
    isVeg: true,
    portions: 15,
    pickupAddress: 'MI Road, Pink City, Jaipur',
    phone: '+91 98765 43210',
    photoUrl: '',
    donateOnly: false,
    confirmedSafety: true
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const safeHours = formData.category === 'Bakery' ? 24 : formData.category === 'Dairy' ? 2 : 4;
  const isBulk = formData.portions >= 15 || formData.donateOnly;

  const getPreviewPhoto = () => {
    if (formData.photoUrl && formData.photoUrl.startsWith('http')) return formData.photoUrl;
    const t = formData.title.toLowerCase();
    const c = formData.category.toLowerCase();
    if (t.includes('dal') || t.includes('makhani')) {
      return '/dal_makhani.png';
    }
    if (t.includes('gulab jamun') || t.includes('jamun') || t.includes('rasgulla') || t.includes('sweets') || t.includes('mithai') || t.includes('halwa')) {
      return '/gulab_jamun.png';
    }
    if (t.includes('cake') || t.includes('pastry')) {
      return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('momo') || t.includes('dimsum')) {
      return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('chowmein') || t.includes('noodle') || t.includes('chinese')) {
      return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('paneer') || t.includes('shahi')) {
      return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('biryani') || t.includes('pulao') || t.includes('rice')) {
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('chole') || t.includes('bhature') || t.includes('bhatura')) {
      return '/chole_bhature.png';
    }
    if (t.includes('samosa') || t.includes('kachori') || t.includes('snack')) {
      return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('dosa') || t.includes('idli')) {
      return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80';
    }
    if (c.includes('dairy') || c.includes('sweet') || c.includes('dessert')) {
      return 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.confirmedSafety) {
      alert("Please confirm the food safety declaration.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          donor_name: formData.donorName || 'Local Food Outlet',
          donor_phone: formData.phone,
          food_type: formData.category,
          is_veg: formData.isVeg ? 1 : 0,
          portions: Number(formData.portions),
          weight_kg: Number(formData.portions) * 0.4,
          deal_price: formData.donateOnly ? 0 : 120,
          original_price: 300,
          photo_url: formData.photoUrl || getPreviewPhoto(),
          pickup_address: formData.pickupAddress,
          donate_only: formData.donateOnly ? 1 : 0
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onNavigate('deals');
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating surplus listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
          GOOD FOOD DESERVES A SECOND CHANCE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
          Fast Post Surplus
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
          Turn extra food into impact. Post your surplus in minutes and help it reach people, communities and NGOs — before it goes to waste.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white p-12 text-center max-w-xl mx-auto rounded-2xl border-2 border-[#581C25] space-y-4 shadow-xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="font-serif text-2xl font-bold text-[#581C25]">
            Surplus Listing Published!
          </h2>
          <p className="text-xs text-gray-600">
            Your listing is now live on the PlateRelay platform and visible to nearby claimers and NGOs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md space-y-6">
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-full bg-[#581C25] text-white flex items-center justify-center font-bold text-sm">
                🍲
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#581C25]">Food Details</h3>
                <p className="text-xs text-gray-500">Tell us about your surplus food</p>
              </div>
            </div>

            {/* Quick Dish Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#581C25] flex items-center justify-between">
                <span>✨ Quick Select Popular Dishes:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DISH_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      title: p.name,
                      category: p.cat,
                      photoUrl: p.photo
                    })}
                    className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-[#581C25] hover:text-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-all shadow-sm"
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor / Outlet Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937]">
                Donor / Outlet Name *
              </label>
              <input
                type="text"
                required
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                placeholder="e.g. Biryani House, Kota Sweets, China Town Momos"
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
              />
            </div>

            {/* Food Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937] flex justify-between">
                <span>Food Title *</span>
                <span className="text-gray-400 font-normal">{formData.title.length}/100</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Gulab Jamun, Steamed Momos, Shahi Paneer"
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
              />
            </div>

            {/* Dish Photo Live Preview & Direct File Upload */}
            <div className="p-4 bg-[#FDFBF7] border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#581C25]">📷 Food Dish Photo:</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Upload photo or auto-matched</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative group">
                  <img 
                    src={getPreviewPhoto()} 
                    alt="Dish Preview"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-[#581C25] shadow-md flex-shrink-0 bg-gray-100"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold pointer-events-none">
                    Preview
                  </div>
                </div>

                <div className="flex-1 space-y-2.5 w-full">
                  {/* File Upload Button */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1F2937] flex items-center space-x-1 mb-1">
                      <span>📁 Upload Custom Photo from Device:</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, photoUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#581C25] file:text-white hover:file:bg-[#7A2A38] cursor-pointer"
                    />
                  </div>

                  {/* Or Custom URL Input */}
                  <div>
                    <label className="text-[10px] text-gray-500 font-semibold">Or enter Photo URL:</label>
                    <input
                      type="url"
                      value={formData.photoUrl.startsWith('data:') ? '[Uploaded File Selected]' : formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937]">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
              >
                <option value="Cooked Meals">Cooked Meals (4 Hours Safe Window)</option>
                <option value="Bakery">Bakery & Bread (24 Hours Safe Window)</option>
                <option value="Dairy">Dairy & Desserts (2 Hours Safe Window)</option>
                <option value="Snacks">Snacks & Fried Food (6 Hours Safe Window)</option>
              </select>
            </div>

            {/* Veg / Non-Veg */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937]">Veg / Non-Veg *</label>
              <div className="flex items-center space-x-3 bg-[#FDFBF7] p-2 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVeg: true })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.isVeg ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  🍃 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVeg: false })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    !formData.isVeg ? 'bg-red-700 text-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  🍗 Non-Veg
                </button>
              </div>
            </div>

            {/* Portions Available */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#1F2937]">
                <span>Portions Available *</span>
                <span className="text-[#581C25] font-extrabold text-sm">{formData.portions} portions</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={formData.portions}
                onChange={(e) => setFormData({ ...formData, portions: parseInt(e.target.value, 10) })}
                className="w-full accent-[#581C25] cursor-pointer"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937]">Pickup Address *</label>
              <input
                type="text"
                required
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1F2937]">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FDFBF7] border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-[#1F2937] focus:border-[#581C25] focus:outline-none"
              />
            </div>

            {/* Donate Only Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF7] border border-gray-200">
              <div>
                <p className="text-xs font-bold text-[#581C25]">Donate Only</p>
                <p className="text-[10px] text-gray-500">No payment, just direct help to community/NGO</p>
              </div>
              <input
                type="checkbox"
                checked={formData.donateOnly}
                onChange={(e) => setFormData({ ...formData, donateOnly: e.target.checked })}
                className="w-5 h-5 accent-[#581C25] cursor-pointer"
              />
            </div>

            {/* Safety Confirmation */}
            <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-emerald-600/30 flex items-start space-x-3">
              <input
                type="checkbox"
                required
                checked={formData.confirmedSafety}
                onChange={(e) => setFormData({ ...formData, confirmedSafety: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-[#581C25] cursor-pointer"
              />
              <label className="text-[11px] text-gray-700 leading-tight font-medium">
                I confirm that the food is safe for consumption and is not expired or spoiled. By posting, you agree to our community guidelines and food safety policy.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#581C25] hover:bg-[#7A2A38] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{loading ? 'Publishing...' : 'Publish Surplus Listing'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Right Column: Safety Clock Preview */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#581C25] text-white p-6 rounded-2xl shadow-xl text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-[#F4E8C1]">
                <Clock className="w-5 h-5" />
                <h3 className="font-serif text-xl font-bold">Safety Clock Preview</h3>
              </div>
              <p className="text-[11px] text-white/80">This is how your listing will appear to rescuers</p>

              {/* Glowing Circular Ring */}
              <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#F4E8C1] bg-[#4A1521] flex flex-col items-center justify-center p-4 relative shadow-lg">
                <span className="text-[10px] uppercase text-white/70 font-semibold">Safe for</span>
                <span className="font-serif text-2xl font-bold text-[#F4E8C1]">
                  {safeHours}h 00m
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
              </div>

              {/* Dynamic Starting Stage Badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-white text-[#581C25] text-xs font-extrabold shadow-sm">
                {isBulk ? 'STAGE 3: NGO BULK RESCUE' : 'STAGE 1: RESCUE DEAL'}
              </div>

              <p className="text-[11px] text-white/80 italic leading-relaxed">
                {isBulk 
                  ? 'Bulk portions (15+) bypass Stage 1 and go directly to verified NGOs for bulk distribution.'
                  : 'After Stage 1 (Deal) & Stage 2 (Share), uncollected food is automatically offered to NGOs.'}
              </p>
            </div>

            {/* Why Post Surplus */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#581C25]">Why Post Surplus?</h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200 space-y-1">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <p className="font-bold text-[#1F2937]">Reduces food waste</p>
                  <p className="text-[10px] text-gray-500">Keeps good food out of landfills.</p>
                </div>

                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200 space-y-1">
                  <Users className="w-4 h-4 text-[#581C25]" />
                  <p className="font-bold text-[#1F2937]">Supports communities</p>
                  <p className="text-[10px] text-gray-500">Feeds people in need & local groups.</p>
                </div>

                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200 space-y-1">
                  <Globe className="w-4 h-4 text-amber-700" />
                  <p className="font-bold text-[#1F2937]">Cuts carbon footprint</p>
                  <p className="text-[10px] text-gray-500">Less waste = lower emissions.</p>
                </div>

                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-gray-200 space-y-1">
                  <Heart className="w-4 h-4 text-rose-700" />
                  <p className="font-bold text-[#1F2937]">Builds a kinder world</p>
                  <p className="text-[10px] text-gray-500">Small actions create big impact.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
