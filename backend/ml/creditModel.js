// ml/creditModel.js — Carbon Credit ML Simulation Model
// Production: replace with a trained scikit-learn / TensorFlow model
// served via a Flask microservice or ONNX runtime.

const CROP_MULTIPLIERS = {
  Rice:      1.20,  // High water retention, strong sequestration
  Wheat:     0.80,
  Corn:      0.90,
  Soybean:   1.10,  // Nitrogen fixation bonus
  Cotton:    0.85,
  Sugarcane: 1.05,
  Other:     1.00,
};

const PRACTICE_BONUSES = {
  "Organic Farming":  0.30,
  "No-Till Farming":  0.20,
  "Cover Crops":      0.15,
  "Drip Irrigation":  0.10,
  "Agroforestry":     0.25,
};

// Approximate Indian agro-climate zone multipliers
const REGION_MULTIPLIERS = {
  "Punjab":           1.05,
  "Haryana":          1.02,
  "Maharashtra":      1.08,
  "Tamil Nadu":       1.10,
  "Uttar Pradesh":    0.98,
  "default":          1.00,
};

/**
 * ML pipeline:
 * 1. Feature extraction
 * 2. Base sequestration rate  (1.8 tCO2/ha/year → 1 credit per tCO2)
 * 3. Crop-type adjustment
 * 4. Sustainable practice multiplier
 * 5. Regional climate correction
 * 6. Confidence scoring
 *
 * @param {{ farmSize:number, cropType:string, practices:string[], location:string }} input
 * @returns {Promise<Object>}
 */
async function generateCarbonCredits({ farmSize, cropType, practices, location }) {
  // Simulate async model inference
  await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

  const cropMult     = CROP_MULTIPLIERS[cropType] || 1.0;
  const practiceMult = 1 + practices.reduce((sum, p) => sum + (PRACTICE_BONUSES[p] || 0), 0);
  const regionKey    = Object.keys(REGION_MULTIPLIERS).find(r => (location || "").includes(r)) || "default";
  const regionMult   = REGION_MULTIPLIERS[regionKey];

  const baseCredits       = farmSize * 1.8;
  const cropAdjustment    = baseCredits * (cropMult - 1);
  const practiceAdjust    = baseCredits * cropMult * (practiceMult - 1);
  const regionAdjustment  = baseCredits * cropMult * practiceMult * (regionMult - 1);
  const totalCredits      = Math.round(baseCredits * cropMult * practiceMult * regionMult);
  const co2Offset         = +(totalCredits * 0.95).toFixed(2);  // 5% verification buffer

  const confidence = Math.min(97,
    68 +
    Math.min(10, farmSize / 20) +     // up to +10 for large farms
    practices.length * 4 +             // +4 per practice
    (regionKey !== "default" ? 5 : 0)  // +5 for known region
  );

  return {
    credits:    totalCredits,
    co2Offset,
    confidence: Math.round(confidence),
    breakdown: {
      baseCredits:        Math.round(baseCredits),
      cropBonus:          Math.round(cropAdjustment),
      practiceBonus:      Math.round(practiceAdjust),
      regionalCorrection: Math.round(regionAdjustment),
    },
    metadata: {
      modelVersion:           "CNF-ML-v2.4.1",
      verificationStandards:  ["Verra VCS", "Gold Standard"],
      sequestrationRate:      +(farmSize * 1.8 * cropMult).toFixed(2),
      practicesApplied:       practices,
      estimatedMonthlyCredit: Math.round(totalCredits / 12),
      marketValueEstimate: {
        min: +(totalCredits * 9.5).toFixed(2),
        avg: +(totalCredits * 12.5).toFixed(2),
        max: +(totalCredits * 16.0).toFixed(2),
      },
    },
  };
}

module.exports = { generateCarbonCredits };
