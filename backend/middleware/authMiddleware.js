const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
