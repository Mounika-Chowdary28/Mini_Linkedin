"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import CreatePost from "./CreatePost"
import Sidebar from "./Sidebar"
import RightSidebar from "./RightSidebar"
import Footer from "./Footer"

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showComments, setShowComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [comments, setComments] = useState({})
  const [loadingComments, setLoadingComments] = useState({})
  const [likedPosts, setLikedPosts] = useState({})
  const token = localStorage.getItem("token")

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:5000/api/posts")
      .then((res) => {
        setPosts(res.data)
        setLoading(false)
        if (token) {
          fetchLikeStatuses(res.data)
        }
      })
      .catch(() => {
        setPosts([])
        setLoading(false)
      })
  }, [token])

  const fetchLikeStatuses = async (posts) => {
    try {
      const likeStatuses = {}
      await Promise.all(
        posts.map(async (post) => {
          try {
            const response = await axios.get(`http://localhost:5000/api/likes/${post._id}/status`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            likeStatuses[post._id] = response.data.liked
          } catch (error) {
            likeStatuses[post._id] = false
          }
        }),
      )
      setLikedPosts(likeStatuses)
    } catch (error) {
      console.error("Error fetching like statuses:", error)
    }
  }

  const handleLike = async (postId) => {
    if (!token) {
      alert("Please login to like posts")
      return
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/likes/${postId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Update like status
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: response.data.liked,
      }))

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likeCount: response.data.liked ? (post.likeCount || 0) + 1 : Math.max((post.likeCount || 0) - 1, 0),
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Error liking post:", error)
      if (error.response?.status === 401) {
        alert("Please login again")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.reload()
      } else {
        alert("Failed to like post")
      }
    }
  }

  const handleComment = async (postId) => {
    const isExpanding = !showComments[postId]

    setShowComments((prev) => ({
      ...prev,
      [postId]: isExpanding,
    }))

    if (isExpanding && !comments[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }))
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/post/${postId}`)
        setComments((prev) => ({ ...prev, [postId]: response.data }))
      } catch (error) {
        console.error("Error fetching comments:", error)
        setComments((prev) => ({ ...prev, [postId]: [] }))
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }))
      }
    }
  }

  const handleCommentSubmit = async (postId) => {
    const commentText = commentInputs[postId]
    if (!commentText?.trim()) {
      alert("Please enter a comment")
      return
    }

    if (!token) {
      alert("Please login to comment")
      return
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/comments",
        {
          content: commentText.trim(),
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      setComments((prev) => ({
        ...prev,
        [postId]: [response.data, ...(prev[postId] || [])],
      }))

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post)),
      )

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }))
    } catch (error) {
      console.error("Error posting comment:", error)
      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.reload()
      } else if (error.response?.status === 400) {
        alert(`Invalid request: ${error.response.data.message || "Please check your input"}`)
      } else {
        alert(`Failed to post comment: ${error.response?.data?.message || error.message}`)
      }
    }
  }

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="linkedin-card p-6 animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Create Post Section */}
              {token && (
                <div className="linkedin-card">
                  <CreatePost onPost={(post) => setPosts([{ ...post, likeCount: 0, commentCount: 0 }, ...posts])} />
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="linkedin-card p-8 text-center">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">Be the first to share something with your network!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post._id} className="linkedin-card">
                      {/* Post Header */}
                      <div className="p-4 pb-0">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {post.author.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                                {post.author.name}
                              </h3>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-500">1st</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 py-3">
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      </div>

                      {(post.likeCount > 0 || post.commentCount > 0) && (
                        <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            {post.likeCount > 0 && (
                              <span className="flex items-center space-x-1">
                                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                </div>
                                <span>
                                  {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
                                </span>
                              </span>
                            )}
                            {post.commentCount > 0 && (
                              <span>
                                {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="px-4 py-2 border-t border-gray-200">
                        <div className="flex items-center justify-start space-x-4">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group ${
                              likedPosts[post._id] ? "text-blue-600" : ""
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 transition-colors ${
                                likedPosts[post._id]
                                  ? "text-blue-600 fill-current"
                                  : "text-gray-600 group-hover:text-blue-600"
                              }`}
                              fill={likedPosts[post._id] ? "currentColor" : "none"}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            <span
                              className={`text-sm font-medium transition-colors ${
                                likedPosts[post._id] ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
                              }`}
                            >
                              {likedPosts[post._id] ? "Liked" : "Like"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleComment(post._id)}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                              Comment
                            </span>
                          </button>
                        </div>
                      </div>

                      {showComments[post._id] && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          {/* Comment Input */}
                          {token && (
                            <div className="flex items-start space-x-3 mt-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {JSON.parse(localStorage.getItem("user"))?.name?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-end space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentInputs[post._id] || ""}
                                    onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post._id)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <button
                                    onClick={() => handleCommentSubmit(post._id)}
                                    disabled={!commentInputs[post._id]?.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Comments List */}
                          {loadingComments[post._id] ? (
                            <div className="mt-4 text-center">
                              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          ) : comments[post._id] && comments[post._id].length > 0 ? (
                            <div className="mt-4 space-y-3">
                              {comments[post._id].map((comment) => (
                                <div key={comment._id} className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {comment.author.name[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                                      <p className="font-semibold text-sm text-gray-900">{comment.author.name}</p>
                                      <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 ml-3">
                                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            showComments[post._id] && (
                              <div className="mt-4 text-center text-gray-500 text-sm">
                                No comments yet. Be the first to comment!
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
