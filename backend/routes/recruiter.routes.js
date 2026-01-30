const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const JobSeekerProfile = require("../models/jobseekerprofile");
const RecruiterProfile = require("../models/RecruiterProfile");
const Job = require("../models/job");
const Application = require("../models/Application");

/* =========================================================
   RECRUITER PROFILE
   ========================================================= */

/* CREATE / UPDATE COMPANY PROFILE */
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const profile = await RecruiterProfile.findOneAndUpdate(
  { userId: req.user.id },
  { 
    ...req.body,
    userId: req.user.id,
    status: "Pending"   // 👈 ADD THIS LINE
  },
  { new: true, upsert: true }
);


    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET COMPANY PROFILE */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({
      userId: req.user.id,
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   JOB POSTING
   ========================================================= */

/* POST A JOB */
router.post("/job", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.create({
  ...req.body,
  recruiterId: req.user.id,
  status: "Pending"   // 🔥 VERY IMPORTANT FOR ADMIN APPROVAL
});


    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL JOBS POSTED BY RECRUITER */
router.get("/jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   APPLICATION PIPELINE (PIPELINE BOARD)
   ========================================================= */

/* GET ALL APPLICATIONS FOR RECRUITER (WITH PROFILE DATA) */
router.get("/applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const apps = await Application.find({ recruiterId: req.user.id })
      .populate("jobId")
      .populate("jobseekerId", "_id email")
      .sort({ createdAt: -1 });

    // 🔥 attach jobseeker profile
    const final = await Promise.all(
      apps.map(async (app) => {
        const profile = await JobSeekerProfile.findOne({
          userId: app.jobseekerId._id,
        });

        return {
          ...app._doc,
          profile,
        };
      })
    );

    res.json(final);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =====================================================
   UPDATE APPLICATION STATUS (PIPELINE ACTION)
   ===================================================== */
router.patch("/application/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body; 
    // status = Applied | Shortlisted | Interview | Selected | Rejected

    const application = await Application.findOne({
      _id: req.params.id,
      recruiterId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔍 GET ALL JOBSEEKER PROFILES (for recruiter search)
router.get("/candidates", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied" });
    }

    const candidates = await JobSeekerProfile.find()
  .populate("userId", "name email")
  .sort({ createdAt: -1 });

    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
