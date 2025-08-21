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
  const [menuOpen, setMenuOpen] = useState(false)
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
        `https://mini-linkedin-1-45fv.onrender.com/api/users/search?q=${encodeURIComponent(search.trim())}`
      )
      setResults(res.data.users || [])
      setShowResults(true)
    } catch {
      setResults([])
      setShowResults(true)
    }
  }

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

          {/* Hamburger for mobile */}
          <button
            className="sm:hidden ml-4 p-2 rounded focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen
                  ? "M6 18L18 6M6 6l12 12" // X Close
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger
                }
              />
            </svg>
          </button>

          {/* Right section - Navigation (Hidden on mobile, shown on sm+) */}
          <div className="hidden sm:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/"
                  className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {/* ... SVG ... */}
                  <span className="text-xs hidden sm:block">Home</span>
                </Link>
                <Link to={`/profile/${user._id}`}
                  className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {/* ... SVG ... */}
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
        {/* Mobile menu, shown when hamburger clicked */}
        {menuOpen && (
          <div className="sm:hidden mt-2 bg-white border-t border-gray-100 shadow p-4 rounded-lg absolute right-4 left-4 z-40">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link to="/" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to={`/profile/${user._id}`} className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                    Me
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="text-gray-700 font-medium text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="text-blue-700 border border-blue-600 rounded px-3 py-1" onClick={() => setMenuOpen(false)}>
                    Join now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
