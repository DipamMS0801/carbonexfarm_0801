// routes/listings.js — CRUD for carbon credit listings
const router  = require("express").Router();
const Listing = require("../models/Listing");
const auth    = require("../middleware/auth");

// GET /api/listings — public, all active listings
router.get("/", async (req, res) => {
  try {
    const { crop, verified, sort } = req.query;
    const filter = { status: "active" };
    if (crop)     filter.cropType = crop;
    if (verified) filter.verified = verified === "true";
    const sortMap = { price_asc:"pricePerCredit", price_desc:"-pricePerCredit", credits:"-credits" };
    const listings = await Listing.find(filter).sort(sortMap[sort] || "-createdAt");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/listings/mine — farmer's own listings
router.get("/mine", auth, async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user.id }).sort("-createdAt");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/listings — create new listing (farmer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "farmer")
      return res.status(403).json({ error: "Only farmers can create listings" });
    const { cropType, practices, credits, pricePerCredit, co2Offset, confidence, location } = req.body;
    const listing = await new Listing({
      farmer: req.user.id, farmerName: req.user.name,
      cropType, practices, credits, pricePerCredit, co2Offset, confidence, location,
    }).save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/listings/:id — cancel listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.farmer.toString() !== req.user.id)
      return res.status(403).json({ error: "Not your listing" });
    listing.status = "cancelled";
    await listing.save();
    res.json({ message: "Listing cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
