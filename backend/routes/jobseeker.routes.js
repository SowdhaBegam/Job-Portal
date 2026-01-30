const express = require("express");
const router = express.Router();

const JobSeekerProfile = require("../models/jobseekerprofile");
const Application = require("../models/Application");
const Job = require("../models/job");
const RecruiterProfile = require("../models/RecruiterProfile");

const authMiddleware = require("../middleware/authMiddleware");

/* =====================================================
   JOBSEEKER PROFILE (CREATE / UPDATE)
   ===================================================== */
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { new: true, upsert: true }
    );

    res.json({
      message: "Jobseeker profile saved successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   GET LOGGED-IN JOBSEEKER PROFILE
   ===================================================== */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({
      userId: req.user.id,
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   APPLY FOR A JOB
   ===================================================== */
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker")
      return res.status(403).json({ message: "Access denied" });

    const { jobId } = req.body;

    const job = await Job.findById(jobId); // ❌ remove populate
if (!job) return res.status(404).json({ message: "Job not found" });

const already = await Application.findOne({
  jobId,
  jobseekerId: req.user.id,
});
if (already) return res.status(400).json({ message: "Already applied" });

const application = new Application({
  jobId,
  jobseekerId: req.user.id,
  recruiterId: job.recruiterId,   // ✅ DIRECT ID
});

await application.save();
res.json({ message: "Application submitted", application });
} catch (err) {
    res.status(500).json({ message: err.message });
  }
});


  

/* =====================================================
   VIEW APPLICATION STATUS (JOBSEEKER)
   ===================================================== */
router.get("/applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      jobseekerId: req.user.id,
    })
      .populate("jobId")
      .populate("recruiterId");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   GET JOBS FOR JOBSEEKER DASHBOARD
   ===================================================== */
router.get("/jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
