"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import axios from "axios"

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const resultsRef = useRef(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) {
      setResults([])
      setShowResults(false)
      return
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/search?q=${encodeURIComponent(search.trim())}`
      )
      setResults(res.data.users || [])
      setShowResults(true)
    } catch {
      setResults([])
      setShowResults(true)
    }
  }

  // Hide results when clicking outside
  function handleBlur(e) {
    setTimeout(() => setShowResults(false), 100)
  }

  function handleLogout() {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left section - Logo and Search */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
            </Link>

            {user && (
              <form onSubmit={handleSearch} className="flex items-center ml-4 relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  onBlur={handleBlur}
                  className="border rounded px-2 py-1"
                  autoComplete="off"
                />
                <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
                  Search
                </button>
                {showResults && search && (
                  <div
                    ref={resultsRef}
                    className="absolute top-10 left-0 bg-white border rounded shadow w-64 z-10"
                  >
                    {results.length > 0 && (
                      <ul>
                        {results.map(u => (
                          <li key={u._id} className="p-2 border-b last:border-b-0 hover:bg-gray-100">
                            <Link
                              to={`/profile/${u._id}`}
                              className="block"
                              onClick={() => setShowResults(false)}
                            >
                              <div className="font-semibold">{u.name}</div>
                              <div className="text-gray-600 text-sm">{u.email}</div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Right section - Navigation */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-xs hidden sm:block">Home</span>
                </Link>

                <Link
                  to={`/profile/${user._id}`}
                  className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-xs hidden sm:block">Me</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <span className="text-xs hidden sm:block">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium text-sm transition-colors"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
