const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,
  location: String,
  experience: String,
  salary: String,
  skills: [String],
  description: String,

  status: {
  type: String,
  default: "Pending"   // Pending / Active / Rejected
}


}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
