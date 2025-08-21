"use client"

import { useState } from "react"
import axios from "axios"

export default function CreatePost({ onPost }) {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const user = JSON.parse(localStorage.getItem("user")) || {}

  async function handleSubmit(e) {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!content.trim()) return

    setIsPosting(true)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setContent("")
      setIsExpanded(false)
      onPost(res.data)
    } catch (err) {
      alert("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  function handleTextareaClick() {
    setIsExpanded(true)
  }

  function handleCancel() {
    setContent("")
    setIsExpanded(false)
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header with user avatar */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <textarea
              className={`w-full border-0 resize-none focus:outline-none placeholder-gray-500 text-gray-900 ${
                isExpanded ? "min-h-[120px]" : "h-12"
              } transition-all duration-200`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={handleTextareaClick}
              placeholder="Start a post..."
              style={{ fontSize: "16px", lineHeight: "1.5" }}
              required
            />
          </div>
        </div>

        {/* Expanded content area */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Media options */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Photo</span>
                </button>

                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Video</span>
                </button>

                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Document</span>
                </button>
              </div>

              {/* Character count */}
              <div className="text-sm text-gray-500">
                {content.length > 0 && (
                  <span className={content.length > 3000 ? "text-red-500" : ""}>{content.length}/3000</span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Anyone</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isPosting || content.length > 3000}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isPosting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
