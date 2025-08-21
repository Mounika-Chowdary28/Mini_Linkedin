"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Footer from "./Footer" // Import the Footer component

export default function Profile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [editingSection, setEditingSection] = useState(null)

  // Profile data state
  const [profileData, setProfileData] = useState({
    bio: "",
    experience: [],
    education: [],
    skills: [],
    location: "",
    headline: "",
  })

  useEffect(() => {
    setLoading(true)
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    const isOwn = currentUser && token && !userId
    setIsOwnProfile(isOwn)

    const apiUrl =
      !userId && currentUser && token
        ? `http://localhost:5000/api/users/profile`
        : `http://localhost:5000/api/users/${userId || (currentUser ? currentUser.id : "")}`

    axios
      .get(
        apiUrl,
        token
          ? {
              headers: { Authorization: `Bearer ${token}` },
            }
          : {},
      )
      .then((res) => {
        setProfile(res.data.user || res.data)
        setPosts(res.data.posts || [])
        const userData = res.data.user || res.data
        setProfileData({
          bio: userData.bio || "",
          experience: userData.experience || [],
          education: userData.education || [],
          skills: userData.skills || [],
          location: userData.location || "",
          headline: userData.headline || "Professional at LinkedIn Mini",
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching profile:", error)
        setLoading(false)
      })
  }, [userId])

  const handleSaveSection = async (section, data) => {
    try {
      const token = localStorage.getItem("token")
      const currentUser = JSON.parse(localStorage.getItem("user"))

      if (!token || !currentUser) {
        alert("Please log in to edit your profile")
        return
      }

      const updateData = { [section]: data }

      const response = await axios.put(`http://localhost:5000/api/users/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success || response.data.user) {
        setProfileData((prev) => ({ ...prev, [section]: data }))
        setEditingSection(null)
        setProfile((prev) => ({ ...prev, [section]: data }))
        alert(`${section} updated successfully!`)
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      alert(`Failed to save ${section}. Please try again.`)
    }
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setProfileData((prev) => ({ ...prev, experience: [...prev.experience, newExp] }))
    setEditingSection(`experience-${newExp.id}`)
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setProfileData((prev) => ({ ...prev, education: [...prev.education, newEdu] }))
    setEditingSection(`education-${newEdu.id}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="linkedin-card animate-pulse">
          <div className="h-32 bg-gray-300 rounded-t-lg"></div>
          <div className="p-6">
            <div className="flex items-start space-x-6 -mt-16">
              <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white"></div>
              <div className="flex-1 mt-16 space-y-3">
                <div className="h-8 bg-gray-300 rounded w-64"></div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="linkedin-card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h2>
          <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {/* Profile Header */}
        <div className="linkedin-card">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"></div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-start space-x-6 -mt-16">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg border-4 border-white">
                {profile.name[0].toUpperCase()}
              </div>
              <div className="flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    {/* Headline */}
                    <div className="flex items-center">
                      {editingSection === "headline" ? (
                        <>
                          <input
                            className="text-xl text-gray-600 mt-1 border rounded px-2 py-1"
                            value={profileData.headline}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, headline: e.target.value }))}
                          />
                          <button
                            onClick={() => handleSaveSection("headline", profileData.headline)}
                            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="ml-1 px-2 py-1 border rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-xl text-gray-600 mt-1">{profileData.headline}</p>
                          {isOwnProfile && (
                            <button
                              onClick={() => setEditingSection("headline")}
                              className="ml-2 text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {/* Location */}
                    <div className="flex items-center">
                      {editingSection === "location" ? (
                        <>
                          <input
                            className="text-gray-500 mt-2 border rounded px-2 py-1"
                            value={profileData.location}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                          />
                          <button
                            onClick={() => handleSaveSection("location", profileData.location)}
                            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="ml-1 px-2 py-1 border rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-500 mt-2">{profileData.location || profile.email}</p>
                          {isOwnProfile && (
                            <button
                              onClick={() => setEditingSection("location")}
                              className="ml-2 text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {profileData.bio && <p className="text-gray-700 mt-3 max-w-2xl leading-relaxed">{profileData.bio}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                  <span>500+ connections</span>
                  <span>•</span>
                  <span>Contact info</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="linkedin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">About</h2>
            {isOwnProfile && (
              <button
                onClick={() => setEditingSection("about")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
          </div>

          {editingSection === "about" ? (
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write about yourself..."
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSaveSection("bio", profileData.bio)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {profileData.bio || "Add a summary to highlight your personality or work experience"}
            </p>
          )}
        </div>

        {/* Experience Section */}
        <div className="linkedin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
            {isOwnProfile && (
              <button onClick={addExperience} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {profileData.experience.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No experience added yet</p>
            ) : (
              profileData.experience.map((exp) => (
                <div key={exp.id} className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    {editingSection === `experience-${exp.id}` ? (
                      <ExperienceForm
                        experience={exp}
                        onSave={(data) => {
                          const updated = profileData.experience.map((e) => (e.id === exp.id ? data : e))
                          handleSaveSection("experience", updated)
                        }}
                        onCancel={() => setEditingSection(null)}
                      />
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.title || "Job Title"}</h3>
                        <p className="text-gray-600">{exp.company || "Company Name"}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {exp.startDate || "Start Date"} - {exp.current ? "Present" : exp.endDate || "End Date"}
                        </p>
                        {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                        {isOwnProfile && (
                          <button
                            onClick={() => setEditingSection(`experience-${exp.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="linkedin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            {isOwnProfile && (
              <button onClick={addEducation} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {profileData.education.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No education added yet</p>
            ) : (
              profileData.education.map((edu) => (
                <div key={edu.id} className="flex space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    {editingSection === `education-${edu.id}` ? (
                      <EducationForm
                        education={edu}
                        onSave={(data) => {
                          const updated = profileData.education.map((e) => (e.id === edu.id ? data : e))
                          handleSaveSection("education", updated)
                        }}
                        onCancel={() => setEditingSection(null)}
                      />
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.school || "School Name"}</h3>
                        <p className="text-gray-600">
                          {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {edu.startDate || "Start Year"} - {edu.endDate || "End Year"}
                        </p>
                        {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
                        {isOwnProfile && (
                          <button
                            onClick={() => setEditingSection(`education-${edu.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="linkedin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            {isOwnProfile && (
              <button
                onClick={() => setEditingSection("skills")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>

          {editingSection === "skills" ? (
            <SkillsForm
              skills={profileData.skills}
              onSave={(skills) => handleSaveSection("skills", skills)}
              onCancel={() => setEditingSection(null)}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profileData.skills.length === 0 ? (
                <p className="text-gray-500 text-center py-8 w-full">No skills added yet</p>
              ) : (
                profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveSection(
                          "skills",
                          profileData.skills.filter((s) => s !== skill),
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          )}
        </div>

        {/* Activity Section */}
        <div className="linkedin-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
            <span className="text-sm text-blue-600 font-medium">{posts.length} posts</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {profile.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{profile.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{post.content}</p>
                </div>
              ))}
              {posts.length > 3 && (
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Show all activity →</button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}

// Experience Form Component
function ExperienceForm({ experience, onSave, onCancel }) {
  const [formData, setFormData] = useState(experience)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Job Title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Start Date (e.g., Jan 2020)"
          value={formData.startDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="End Date (e.g., Dec 2022)"
          value={formData.endDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
          disabled={formData.current}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.current}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              current: e.target.checked,
              endDate: e.target.checked ? "" : prev.endDate,
            }))
          }
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">I currently work here</span>
      </label>
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// Education Form Component
function EducationForm({ education, onSave, onCancel }) {
  const [formData, setFormData] = useState(education)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="School"
        value={formData.school}
        onChange={(e) => setFormData((prev) => ({ ...prev, school: e.target.value }))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Degree"
          value={formData.degree}
          onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Field of Study"
          value={formData.field}
          onChange={(e) => setFormData((prev) => ({ ...prev, field: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Start Year (e.g., 2018)"
          value={formData.startDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="End Year (e.g., 2022)"
          value={formData.endDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// Skills Form Component
function SkillsForm({ skills, onSave, onCancel }) {
  const [skillInput, setSkillInput] = useState("")
  const [skillsList, setSkillsList] = useState(skills)

  const addSkill = () => {
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(skillsList)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Add a skill"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
          >
            <span>{skill}</span>
            <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}