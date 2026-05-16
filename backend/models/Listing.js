// models/Listing.js — Carbon Credit Listing Schema
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  farmer:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farmerName:     { type: String, required: true },
  location:       { type: String, required: true },
  cropType:       { type: String, required: true },
  practices:      [{ type: String }],
  credits:        { type: Number, required: true, min: 1 },
  pricePerCredit: { type: Number, required: true, min: 0 },
  co2Offset:      { type: Number, required: true },
  confidence:     { type: Number, required: true, min: 0, max: 100 },
  verified:       { type: Boolean, default: false },
  status:         { type: String, enum: ["active", "sold", "cancelled"], default: "active" },
}, { timestamps: true });

listingSchema.virtual("totalValue").get(function () {
  return +(this.credits * this.pricePerCredit).toFixed(2);
});

listingSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Listing", listingSchema);
