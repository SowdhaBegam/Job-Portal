const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // 🔥 LINK TO LOGGED-IN USER (NOT PROFILE)
    jobseekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
