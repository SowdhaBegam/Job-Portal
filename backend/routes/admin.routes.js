const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Job = require("../models/job");
const AdminReport = require("../models/AdminReport");
const RecruiterProfile = require("../models/RecruiterProfile");


/* ================= USERS ================= */
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.patch("/user/:id/toggle", async (req, res) => {
  const user = await User.findById(req.params.id);
  user.status = user.status === "Active" ? "Blocked" : "Active";
  await user.save();
  res.json({ message: "User status updated" });
});

/* ================= JOBS ================= */
router.get("/jobs", async (req, res) => {
  const jobs = await Job.find({ status: "Active" });
  res.json(jobs);
});

router.delete("/job/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});

/* ================= REPORTS ================= */
router.get("/reports", async (req, res) => {
  const reports = await AdminReport.find();
  res.json(reports);
});

router.patch("/report/:id/solve", async (req, res) => {
  await AdminReport.findByIdAndUpdate(req.params.id, { status: "Solved" });
  res.json({ message: "Report solved" });
});

/* ================= PENDING RECRUITERS ================= */
router.get("/pending-recruiters", async (req, res) => {
  const recruiters = await RecruiterProfile.find({ status: "Pending" });
  res.json(recruiters);
});

/* ================= APPROVE RECRUITER ================= */
router.post("/recruiter/:id/approve", async (req, res) => {
  const rec = await RecruiterProfile.findById(req.params.id);

  // Add to users collection
  const newUser = new User({
    name: rec.name,
    email: rec.email,
    role: "recruiter",
    status: "Active"
  });

  await newUser.save();

  // Update recruiter status
  rec.status = "Approved";
  await rec.save();

  res.json({ message: "Recruiter approved" });
});

/* ================= REJECT ================= */
router.delete("/recruiter/:id/reject", async (req, res) => {
  await RecruiterProfile.findByIdAndDelete(req.params.id);
  res.json({ message: "Recruiter rejected" });
});
/* ================= PENDING JOBS ================= */
router.get("/pending-jobs", async (req, res) => {
  const jobs = await Job.find({ status: "Pending" });
  res.json(jobs);
});

/* ================= APPROVE JOB ================= */
router.patch("/job/:id/approve", async (req, res) => {
  await Job.findByIdAndUpdate(req.params.id, { status: "Active" });
  res.json({ message: "Job approved" });
});

/* ================= REJECT JOB ================= */
router.delete("/job/:id/reject", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job rejected" });
});



module.exports = router;
