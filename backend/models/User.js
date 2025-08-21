const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    password: { type: String, required: true },
    headline: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    experience: [
      {
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        duration: { type: String, default: "" },
        location: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        duration: { type: String, default: "" },
      },
    ],
    skills: [{ type: String }],
    languages: [{ type: String }],
  },
  { timestamps: true },
)

module.exports = mongoose.model("User", userSchema)
