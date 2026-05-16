// routes/ml.js — ML credit generation endpoint
const router = require("express").Router();
const auth   = require("../middleware/auth");
const { generateCarbonCredits } = require("../ml/creditModel");

// POST /api/ml/generate
router.post("/generate", auth, async (req, res) => {
  try {
    if (req.user.role !== "farmer")
      return res.status(403).json({ error: "Only farmers can generate credits" });
    const { farmSize, cropType, practices, location } = req.body;
    if (!farmSize || !cropType || !location)
      return res.status(400).json({ error: "farmSize, cropType, location required" });
    const result = await generateCarbonCredits({ farmSize: +farmSize, cropType, practices: practices || [], location });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
