const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      required: true,
    },

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // ✅ extra fields (optional - based on role)
    phone: String,
    location: String,
    skills: String,
    experience: String,

    companyName: String,
    companyWebsite: String,

    adminKey: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
