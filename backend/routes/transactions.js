// routes/transactions.js — Buy credits + blockchain verification
const router      = require("express").Router();
const Transaction = require("../models/Transaction");
const Listing     = require("../models/Listing");
const User        = require("../models/User");
const auth        = require("../middleware/auth");
const { broadcastTransaction, verifyTransaction } = require("../blockchain/verifier");

// POST /api/transactions/buy — company purchases a listing
router.post("/buy", auth, async (req, res) => {
  try {
    if (req.user.role !== "company")
      return res.status(403).json({ error: "Only companies can purchase credits" });

    const { listingId } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== "active")
      return res.status(404).json({ error: "Listing not found or already sold" });

    const buyer  = await User.findById(req.user.id);
    const seller = await User.findById(listing.farmer);
    if (!buyer || !seller) return res.status(404).json({ error: "User not found" });

    // Broadcast to blockchain
    const receipt = await broadcastTransaction({
      from:    buyer.name,
      to:      seller.name,
      credits: listing.credits,
      value:   listing.credits * listing.pricePerCredit,
    });

    // Create transaction record
    const tx = await new Transaction({
      buyer:          buyer._id, seller: seller._id,
      listing:        listing._id,
      buyerName:      buyer.name, sellerName: seller.name,
      credits:        listing.credits,
      pricePerCredit: listing.pricePerCredit,
      total:          listing.credits * listing.pricePerCredit,
      ...receipt,
    }).save();

    // Mark listing sold
    listing.status = "sold";
    await listing.save();

    // Update points — buyer +50, seller +100
    buyer.points          += 50;
    buyer.totalPurchased  += listing.credits;
    buyer.totalSpend      += tx.total;
    await buyer.save();

    seller.points   += 100;
    seller.revenue  += tx.total;
    seller.totalSold += listing.credits;
    await seller.save();

    res.status(201).json({ transaction: tx, receipt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions — all transactions (paginated)
router.get("/", auth, async (req, res) => {
  try {
    const page  = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const txs = await Transaction.find()
      .sort("-createdAt")
      .skip((page-1)*limit)
      .limit(limit);
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/mine — current user's transactions
router.get("/mine", auth, async (req, res) => {
  try {
    const field = req.user.role === "company" ? "buyer" : "seller";
    const txs   = await Transaction.find({ [field]: req.user.id }).sort("-createdAt");
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/verify/:hash
router.get("/verify/:hash", async (req, res) => {
  try {
    const result = await verifyTransaction(req.params.hash);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
