require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const postRoutes = require("./routes/posts")
const commentRoutes = require("./routes/comments")
const likeRoutes = require("./routes/likes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log("Server started on port " + PORT)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1) // Optional: stop the app if DB connection fails
  })
