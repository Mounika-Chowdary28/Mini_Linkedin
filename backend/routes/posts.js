const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const Like = require("../models/Like")
const Comment = require("../models/Comment")
const auth = require("../middleware/auth")

const router = express.Router()

// Create post
router.post("/", auth, async (req, res) => {
  const { content } = req.body
  const post = await Post.create({ content, author: req.user.id })
  res.status(201).json(post)
})

// Get all posts for feed
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name")

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({ post: post._id })
        const commentCount = await Comment.countDocuments({ post: post._id })

        return {
          ...post.toObject(),
          likeCount,
          commentCount,
        }
      }),
    )

    res.json(postsWithCounts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ error: "Failed to fetch posts" })
  }
})

module.exports = router
