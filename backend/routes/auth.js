var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require("../models/User");
var auth = require("../middleware/auth");

router.post("/register", async function(req, res) {
  try {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
      return res.status(400).json({ error: "All fields required" });
    }
    var exists = await User.findOne({ email: req.body.email });
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });
    await user.save();
    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "carbonexfarm_secret_2026", { expiresIn: "7d" });
    return res.status(201).json({ token: token, user: user.toPublic() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async function(req, res) {
  try {
    var user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    var match = await user.comparePassword(req.body.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "carbonexfarm_secret_2026", { expiresIn: "7d" });
    return res.json({ token: token, user: user.toPublic() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async function(req, res) {
  try {
    var user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;