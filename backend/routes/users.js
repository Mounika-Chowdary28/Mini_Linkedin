const express = require("express")
const User = require("../models/User")
const Post = require("../models/Post")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 })
    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put("/profile", auth, async (req, res) => {
  try {
    const { bio, experience, education, skills, location, headline } = req.body

    const updateData = {}
    if (bio !== undefined) updateData.bio = bio
    if (experience !== undefined) updateData.experience = experience
    if (education !== undefined) updateData.education = education
    if (skills !== undefined) updateData.skills = skills
    if (location !== undefined) updateData.location = location
    if (headline !== undefined) updateData.headline = headline

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) return res.status(404).json({ message: "User not found" })

    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/search", async (req, res) => {
  const q = req.query.q || ""
  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  }).select("-password")
  res.json({ users })
})

// Get user profile and their posts
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 })
    res.json({ user, posts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
