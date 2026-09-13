const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/post/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json(comments);
});

router.post("/post/:postId", auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!req.body.content?.trim()) return res.status(400).json({ message: "Comment cannot be empty" });

  const comment = await Comment.create({
    content: req.body.content.trim(),
    post: req.params.postId,
    author: req.user.id
  });
  await comment.populate("author", "name");
  res.status(201).json(comment);
});

router.delete("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
});

module.exports = router;
