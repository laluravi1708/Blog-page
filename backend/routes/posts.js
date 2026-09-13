const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content are required" });
  const post = await Post.create({ title, content, author: req.user.id });
  res.status(201).json(post);
});

router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  post.title = req.body.title ?? post.title;
  post.content = req.body.content ?? post.content;
  await post.save();
  res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not allowed" });

  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

module.exports = router;
