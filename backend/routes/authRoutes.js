const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

/* ===================== REGISTER ===================== */
router.post("/register", async (req, res) => {
  try {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check duplicate email
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "✅ Registered Successfully",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // password check
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    return res.json({
      message: "✅ Login success",
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
