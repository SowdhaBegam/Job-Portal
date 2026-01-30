const mongoose = require("mongoose");

const adminReportSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },        // Job Post / User
    reportedItem: { type: String, required: true },// Name of job or user
    reason: { type: String, required: true },
    status: { type: String, default: "Pending" },  // Pending / Solved
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminReport", adminReportSchema, "admin_reports");
