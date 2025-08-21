const express = require("express")
const router = express.Router()
const Like = require("../models/Like")
const auth = require("../middleware/auth")

// Toggle like on a post
router.post("/:postId", auth, async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user.id

    // Check if user already liked this post
    const existingLike = await Like.findOne({ user: userId, post: postId })

    if (existingLike) {
      // Unlike the post
      await Like.findByIdAndDelete(existingLike._id)
      res.json({ liked: false, message: "Post unliked" })
    } else {
      // Like the post
      const newLike = new Like({ user: userId, post: postId })
      await newLike.save()
      res.json({ liked: true, message: "Post liked" })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    res.status(500).json({ error: "Failed to toggle like" })
  }
})

// Get like status for a post
router.get("/:postId/status", auth, async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user.id

    const like = await Like.findOne({ user: userId, post: postId })
    res.json({ liked: !!like })
  } catch (error) {
    console.error("Error getting like status:", error)
    res.status(500).json({ error: "Failed to get like status" })
  }
})

module.exports = router
