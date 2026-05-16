// models/Transaction.js — Blockchain Transaction Schema
const mongoose = require("mongoose");

const txSchema = new mongoose.Schema({
  buyer:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listing:        { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  buyerName:      { type: String },
  sellerName:     { type: String },

  credits:        { type: Number, required: true },
  pricePerCredit: { type: Number, required: true },
  total:          { type: Number, required: true },

  // Blockchain data
  txHash:       { type: String, required: true, unique: true },
  blockNumber:  { type: Number },
  gasUsed:      { type: Number, default: 21000 },
  network:      { type: String, default: "carbonex-mainnet-1" },
  status:       { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },

}, { timestamps: true });

module.exports = mongoose.model("Transaction", txSchema);
