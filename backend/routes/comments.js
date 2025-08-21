const express = require("express")
const Comment = require("../models/Comment")
const auth = require("../middleware/auth")
const router = express.Router()

// Get comments for a specific post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate("author", "name").sort({ createdAt: -1 })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a new comment
router.post("/", auth, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      author: req.user.id,
      post: req.body.postId,
    })

    await comment.save()
    await comment.populate("author", "name")

    res.status(201).json(comment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router
