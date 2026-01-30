const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* CREATE POST */
router.post("/", auth, upload.single("image"), async (req, res) => {
  const post = await Post.create({
    userId: req.user.id,
    text: req.body.text,
    image: req.file ? req.file.filename : null,
  });
  res.json(post);
});

/* GET ALL POSTS */
router.get("/", auth, async (req, res) => {
  const posts = await Post.find()
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  res.json(posts);
});

/* LIKE POST */
router.put("/like/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user.id))
    post.likes.push(req.user.id);
  else
    post.likes = post.likes.filter(id => id != req.user.id);

  await post.save();
  res.json(post);
});

/* COMMENT */
router.post("/comment/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ userId: req.user.id, text: req.body.text });
  await post.save();
  res.json(post);
});

module.exports = router;
