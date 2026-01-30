const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  companyName: String,
  email: String,
  phone: String,
  location: String,
  industry: String,
  website: String,
  about: String,

  status: {
    type: String,
    default: "Pending"   // Pending / Approved / Rejected
  }


}, { timestamps: true });

module.exports = mongoose.model("RecruiterProfile", recruiterProfileSchema);
