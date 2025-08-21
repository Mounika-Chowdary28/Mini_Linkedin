import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Feed from "./components/Feed"
import Profile from "./components/Profile"
import Login from "./components/Login"
import Register from "./components/Register"
import SearchResults from "./components/SearchResults"

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: "var(--linkedin-gray-100)" }}>
        <Navbar />

        {/* Main content area with LinkedIn-style max width and centering */}
        <main className="pt-14">
          {" "}
          {/* Account for fixed navbar height */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
