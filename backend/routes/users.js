// routes/users.js — User profile management
const router = require("express").Router();
const User   = require("../models/User");
const auth   = require("../middleware/auth");

// GET /api/users/leaderboard — top users by points
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name role points totalSold totalPurchased")
      .sort("-points")
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id — public profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/me — update own profile
router.patch("/me", auth, async (req, res) => {
  try {
    const allowed = ["name", "location", "farmSize"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
