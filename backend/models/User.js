// models/User.js — Mongoose User Schema
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ["farmer", "company"], required: true },
  location: { type: String, default: "" },

  // Shared
  points:   { type: Number, default: 0 },

  // Farmer-specific
  farmSize:   { type: Number, default: 0 },
  credits:    { type: Number, default: 0 },
  revenue:    { type: Number, default: 0 },
  totalSold:  { type: Number, default: 0 },

  // Company-specific
  totalPurchased: { type: Number, default: 0 },
  totalSpend:     { type: Number, default: 0 },

}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Public projection (strip password)
userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
