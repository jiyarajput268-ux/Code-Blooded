const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  donorName: { type: String, required: true },
  donorPhone: { type: String },
  foodType: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  portions: { type: Number, required: true },
  weightKg: { type: Number, required: true },
  dealPrice: { type: Number, default: 0 },
  originalPrice: { type: Number, default: 0 },
  photoUrl: { type: String },
  pickupAddress: { type: String, required: true },
  pickupLat: { type: Number, default: 26.8530 },
  pickupLng: { type: Number, default: 75.8047 },
  postedAt: { type: Date, default: Date.now },
  readyAt: { type: Date, default: Date.now },
  safeUntil: { type: Date, required: true },
  donateOnly: { type: Boolean, default: false },
  startStage: { type: Number, default: 1 },
  status: { type: String, default: 'AVAILABLE' },
  claimedBy: { type: String },
  pickupOtp: { type: String, default: '4821' },
  deliveryOtp: { type: String, default: '9374' }
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);
