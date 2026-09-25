import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, CheckCircle2, Navigation, ShieldCheck, Truck, Check } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function RunnerTask({ onNavigate }) {
  const [task, setTask] = useState(null);
  const [pickupOtp, setPickupOtp] = useState(['4', '8', '2', '1']);
  const [deliveryOtp, setDeliveryOtp] = useState(['9', '3', '7', '4']);
  const [verifiedStatus, setVerifiedStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTask();
  }, []);

  const fetchActiveTask = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/runner/task`);
      const data = await res.json();
      setTask(data);
      if (data.status === 'DELIVERED') setVerifiedStatus('DELIVERED');
      else if (data.status === 'PICKED_UP') setVerifiedStatus('PICKED_UP');
    } catch (err) {
      console.error("Error fetching runner task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const pOtp = pickupOtp.join('');
    const dOtp = deliveryOtp.join('');

    try {
      const res = await fetch(`${API_BASE}/api/runner/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup_otp: pOtp, delivery_otp: dOtp })
      });
      const data = await res.json();
      if (data.success) {
        setVerifiedStatus(data.new_status);
        if (data.new_status === 'DELIVERED') {
          setTimeout(() => {
            onNavigate('dashboard');
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-gray-500">Loading active task...</div>;
  }

  const isPickedUp = verifiedStatus === 'PICKED_UP' || verifiedStatus === 'DELIVERED';
  const isDelivered = verifiedStatus === 'DELIVERED';

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8 pb-16 pt-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#581C25]">
          VOLUNTEER RUNNER DISPATCH
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#581C25]">
          Active Task
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          You're making a real difference. Rescue food. Nourish people. Stronger communities.
        </p>
      </div>

      {/* Main Task Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#581C25] shadow-xl space-y-8 relative">
        
        {/* Card Header & Status Pill */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-mono text-[#581C25] font-bold tracking-wider uppercase">
              {task?.task_id || 'TASK #PR-4821'}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1F2937] mt-0.5">
              Meal Rescue & Delivery
            </h2>
            <p className="text-xs text-gray-500">
              Collect surplus food from the donor and deliver to the community partner.
            </p>
          </div>

          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
            isDelivered 
              ? 'bg-emerald-700 border-emerald-800 text-white' 
              : 'bg-[#581C25] border-[#3D1219] text-white'
          }`}>
            <span>{isDelivered ? 'Completed' : 'In Progress'}</span>
          </span>
        </div>

        {/* Status Timeline Progress Bar */}
        <div className="grid grid-cols-3 text-center relative max-w-2xl mx-auto">
          <div className="absolute top-4 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-0" />

          {/* Step 1 */}
          <div className="space-y-1 relative z-10">
            <div className="w-9 h-9 rounded-full bg-[#581C25] text-white mx-auto flex items-center justify-center font-bold shadow-md">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#581C25]">Matched</p>
            <p className="text-[10px] text-gray-400">You're assigned! 2:14 PM</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-1 relative z-10">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold shadow-md transition-all ${
              isPickedUp 
                ? 'bg-[#581C25] text-white' 
                : 'bg-white border-2 border-gray-300 text-gray-400'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <p className={`text-xs font-bold ${isPickedUp ? 'text-[#581C25]' : 'text-gray-400'}`}>Picked Up</p>
            <p className="text-[10px] text-gray-400">{isPickedUp ? 'Verified by donor' : 'Awaiting pickup'}</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-1 relative z-10">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold shadow-md transition-all ${
              isDelivered 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white border-2 border-gray-300 text-gray-400'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className={`text-xs font-bold ${isDelivered ? 'text-emerald-700' : 'text-gray-400'}`}>Delivered</p>
            <p className="text-[10px] text-gray-400">{isDelivered ? 'Verified by recipient' : 'Complete with OTP'}</p>
          </div>
        </div>

        {/* Pickup & Dropoff Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-xl bg-[#FDFBF7] border border-gray-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#581C25] flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Pick Up From</span>
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1F2937]">
              {task?.pickup?.name || 'Biryani House, Sector 18'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {task?.pickup?.address || 'Shop No. 12, Sector 18, Noida, UP 201301'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FDFBF7] border border-gray-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Drop Off To</span>
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1F2937]">
              {task?.dropoff?.name || 'Shri Ram Community Shelter'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {task?.dropoff?.address || '12, Seva Marg, Sector 22, Noida, UP 201301'}
            </p>
          </div>
        </div>

        {/* DUAL 4-DIGIT OTP INPUT HANDSHAKE BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          
          {/* Pickup OTP */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#581C25] block text-center uppercase tracking-wider">
              Enter Pickup OTP (from Donor)
            </label>
            <p className="text-[10px] text-gray-500 text-center">Ask the donor for the 4-digit code</p>
            
            <div className="flex justify-center space-x-2 pt-1">
              {pickupOtp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...pickupOtp];
                    newOtp[idx] = e.target.value;
                    setPickupOtp(newOtp);
                  }}
                  className="w-12 h-12 text-center font-serif text-xl font-bold bg-[#FDFBF7] border-2 border-[#581C25] rounded-xl text-[#581C25] focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                />
              ))}
            </div>
          </div>

          {/* Delivery OTP */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#581C25] block text-center uppercase tracking-wider">
              Enter Delivery OTP (from Recipient)
            </label>
            <p className="text-[10px] text-gray-500 text-center">Ask the recipient for the 4-digit code</p>

            <div className="flex justify-center space-x-2 pt-1">
              {deliveryOtp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...deliveryOtp];
                    newOtp[idx] = e.target.value;
                    setDeliveryOtp(newOtp);
                  }}
                  className="w-12 h-12 text-center font-serif text-xl font-bold bg-[#FDFBF7] border-2 border-[#581C25] rounded-xl text-[#581C25] focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button & Navigation Link */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-[#581C25] hover:bg-[#7A2A38] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
          >
            <span>Verify OTP & Complete Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#581C25] hover:underline inline-flex items-center space-x-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Launch Navigation →</span>
            </a>
          </div>

          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center space-x-1 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>For everyone's safety, please complete both OTPs at the time of handover.</span>
          </p>
        </div>

      </div>
    </div>
  );
}
