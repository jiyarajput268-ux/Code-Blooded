const mongoose = require('mongoose');

async function connectMongoDB(uri) {
  const mongoURI = uri || process.env.MONGO_URI || 'mongodb+srv://sharuti463_db_user:f7o2DJWED8Kf3sfw@cluster0.pogsrsb.mongodb.net/platerelay?retryWrites=true&w=majority';
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB database at Atlas Cloud!");
    return true;
  } catch (err) {
    console.warn("MongoDB local server not running or connection failed:", err.message);
    console.warn("Continuing with SQLite database fallback for resilient operation.");
    return false;
  }
}

module.exports = connectMongoDB;
