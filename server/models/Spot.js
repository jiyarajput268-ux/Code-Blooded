const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kind: { type: String, required: true, enum: ['ngo', 'community'] },
  description: { type: String },
  imageUrl: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  capacityTotal: { type: Number, default: 80 },
  capacityUsed: { type: Number, default: 40 },
  foodPreferences: { type: String, default: 'Veg Only, Cooked Meals' },
  verifiedLevel: { type: String, default: 'Community Vouched (5 Vouches)' },
  distanceKm: { type: Number, default: 1.8 }
}, { timestamps: true });

module.exports = mongoose.model('Spot', SpotSchema);
