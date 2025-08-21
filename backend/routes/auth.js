const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, bio, headline, location } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: "Email already in use" })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashed,
      bio: bio || "",
      headline: headline || "",
      location: location || "",
      connections: 0,
      profileViews: 0,
    })

    res.status(201).json({
      message: "Account created successfully",
      user: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        headline: user.headline,
        location: user.location,
        _id: user._id,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid credentials" })
  if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid credentials" })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      headline: user.headline,
      location: user.location,
      connections: user.connections,
      profileViews: user.profileViews,
      _id: user._id,
    },
  })
})

module.exports = router
