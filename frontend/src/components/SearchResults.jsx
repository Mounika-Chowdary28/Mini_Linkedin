import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

export default function SearchResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const query = new URLSearchParams(useLocation().search).get("q")

  useEffect(() => {
    setLoading(true)
    axios.get(`https://mini-linkedin-1-45fv.onrender.com/api/users/search?q=${encodeURIComponent(query)}`)
      .then(res => {
        setResults(res.data.users || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [query])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {results.map(user => (
            <li key={user._id} className="mb-4 border-b pb-2">
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-600">{user.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}