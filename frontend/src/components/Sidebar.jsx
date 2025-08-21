"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Sidebar() {
  const [user, setUser] = useState({})
  const items = [
    "JavaScript Developers",
    "React Developers",
    "Web Development",
    // Add more items as needed
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios
        .get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser({}))
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <div className="linkedin-card">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"></div>

          {/* Profile Section */}
          <div className="px-4 pb-4">
            <div className="flex flex-col items-center -mt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg border-4 border-white">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="text-center mt-2">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {user.name || "User"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {user.headline || "Professional at LinkedIn Mini"}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Profile viewers</span>
                <span className="text-blue-600 font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Post impressions</span>
                <span className="text-blue-600 font-semibold">1,234</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                My items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="linkedin-card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Recent</h3>
        <div className="space-y-2">
          <ul>
            {items.map((item) => (
              <li key={item}>
                <Link to="#" className="flex items-center text-sm text-gray-600 hover:text-gray-900 py-1">
                  <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
