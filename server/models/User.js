const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['donor', 'buyer', 'recipient', 'runner', 'admin'] },
  phone: { type: String },
  trustScore: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
