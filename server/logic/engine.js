// Core Engine Logic for PlateRelay Cascade & Matching

const SAFETY_HOURS_MAP = {
  'Cooked Meals': 4,
  'Cooked Rice': 4,
  'Curry': 4,
  'Bakery': 24,
  'Bread': 24,
  'Snacks': 6,
  'Fried Snacks': 6,
  'Dairy': 2,
  'Cut Fruit': 2
};

function calcSafeUntil(foodType, readyAtIso) {
  const readyTime = new Date(readyAtIso).getTime();
  const safeHours = SAFETY_HOURS_MAP[foodType] || 4; // default 4 hours
  const safeUntilMs = readyTime + (safeHours * 60 * 60 * 1000);
  return new Date(safeUntilMs).toISOString();
}

function currentStage(listing, currentTimeMs = Date.now()) {
  const postedAtMs = new Date(listing.posted_at).getTime();
  const safeUntilMs = new Date(listing.safe_until).getTime();

  if (currentTimeMs >= safeUntilMs) {
    return { stage: 4, name: 'Expired', badge: 'EXPIRED', color: 'red' };
  }

  // Bulk listings (15+ portions) or explicit donate_only skip Stage 1 & 2 -> Stage 3 NGO Rescue Run
  if (listing.portions >= 15 || listing.donate_only === 1 || listing.start_stage === 3) {
    return { stage: 3, name: 'Stage 3: NGO Rescue Run', badge: 'STAGE 3: NGO BULK RESCUE', color: 'amber' };
  }

  const windowMs = safeUntilMs - postedAtMs;
  if (windowMs <= 0) return { stage: 4, name: 'Expired', badge: 'EXPIRED', color: 'red' };

  const elapsedRatio = (currentTimeMs - postedAtMs) / windowMs;

  if (elapsedRatio < 0.40) {
    const discount = listing.deal_price && listing.original_price 
      ? Math.round((1 - listing.deal_price / listing.original_price) * 100) 
      : 50;
    return { 
      stage: 1, 
      name: 'Stage 1: Rescue Deal', 
      badge: `STAGE 1: ${discount}% OFF`, 
      color: 'gold',
      elapsedRatio 
    };
  } else if (elapsedRatio < 0.70) {
    return { 
      stage: 2, 
      name: 'Stage 2: Direct Share', 
      badge: 'STAGE 2: FREE SHARE', 
      color: 'emerald',
      elapsedRatio 
    };
  } else {
    return { 
      stage: 3, 
      name: 'Stage 3: NGO Rescue Run', 
      badge: 'STAGE 3: NGO RESCUE RUN', 
      color: 'amber',
      elapsedRatio 
    };
  }
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

function scoreRecipient(listing, spot, currentTimeMs = Date.now()) {
  const distKm = haversineKm(listing.pickup_lat, listing.pickup_lng, spot.lat, spot.lng);
  
  // Hard filters check
  const etaMinutes = Math.round((distKm / 25) * 60); // 25 km/h avg speed
  const safeUntilMs = new Date(listing.safe_until).getTime();
  const bufferTimeMs = 20 * 60 * 1000; // 20 min safety buffer
  
  const isWithinRadius = distKm <= 8.0;
  const isBeforeExpiry = (currentTimeMs + (etaMinutes * 60 * 1000)) <= (safeUntilMs - bufferTimeMs);
  const hasCapacity = (spot.capacity_total - spot.capacity_used) >= listing.portions;
  const isVegMatch = listing.is_veg === 1 ? spot.food_preferences.includes('Veg') : true;

  if (!isWithinRadius || !isBeforeExpiry || !hasCapacity || !isVegMatch) {
    return {
      eligible: false,
      score: 0,
      breakdown: { distanceScore: 0, capacityScore: 0, needScore: 0, prefScore: 0 },
      reasons: []
    };
  }

  // Weighted scoring (Max 100)
  // Distance (0.40): max 40 points (8km = 0, 0km = 40)
  const distanceScore = Math.max(0, Math.round((1 - distKm / 8.0) * 40));

  // Capacity fit (0.25): max 25 points
  const freeCap = spot.capacity_total - spot.capacity_used;
  const capacityRatio = Math.min(1, listing.portions / Math.max(1, freeCap));
  const capacityScore = Math.round(capacityRatio * 25);

  // Urgency Need (0.20): max 20 points
  const safeWindowTotal = safeUntilMs - new Date(listing.posted_at).getTime();
  const timeRemaining = Math.max(0, safeUntilMs - currentTimeMs);
  const urgencyRatio = 1 - (timeRemaining / Math.max(1, safeWindowTotal));
  const needScore = Math.round(urgencyRatio * 20);

  // Preference (0.15): max 15 points
  const prefScore = isVegMatch ? 15 : 5;

  const totalScore = distanceScore + capacityScore + needScore + prefScore;

  return {
    eligible: true,
    score: totalScore,
    breakdown: {
      distanceScore,
      capacityScore,
      needScore,
      prefScore
    },
    details: {
      distanceKm: distKm,
      etaMinutes,
      remainingCapacity: freeCap,
      vegMatched: isVegMatch
    }
  };
}

module.exports = {
  SAFETY_HOURS_MAP,
  calcSafeUntil,
  currentStage,
  haversineKm,
  scoreRecipient
};
