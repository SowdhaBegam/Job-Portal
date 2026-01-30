const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
const jobSeekerRoutes = require("./routes/jobseeker.routes"); // 🔥 EXACT NAME
const recruiterRoutes = require("./routes/recruiter.routes");
const postRoutes = require("./routes/post.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("✅ GradsUp Backend Running...");
});

// routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/jobseeker", jobSeekerRoutes); // 🔥 THIS LINE
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
