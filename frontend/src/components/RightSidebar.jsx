"use client"
import axios from "axios"

export default function RightSidebar() {
  const newsItems = [
    { title: "Tech industry sees growth", readers: "1,234 readers" },
    { title: "Remote work trends continue", readers: "2,456 readers" },
    { title: "AI adoption in business", readers: "3,789 readers" },
    { title: "Startup funding increases", readers: "1,567 readers" },
    { title: "New programming languages", readers: "2,890 readers" },
  ]

  const suggestedConnections = [
    { name: "Sarah Johnson", title: "Software Engineer at Google", mutual: "5 mutual connections" },
    { name: "Mike Chen", title: "Product Manager at Microsoft", mutual: "3 mutual connections" },
    { name: "Emily Davis", title: "UX Designer at Apple", mutual: "7 mutual connections" },
  ]

  return (
    <div className="space-y-4">
      {/* LinkedIn News */}
      <div className="linkedin-card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">LinkedIn News</h3>
        <div className="space-y-3">
          {newsItems.map((item, index) => (
            <div key={index} className="cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-600">{item.readers}</p>
            </div>
          ))}
        </div>
        {/* Removed Show more button */}
      </div>

      {/* People you may know */}
      <div className="linkedin-card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">People you may know</h3>
        <div className="space-y-4">
          {suggestedConnections.map((person, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                {person.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{person.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{person.title}</p>
                <p className="text-xs text-gray-500 mt-1">{person.mutual}</p>
                {/* Removed Connect button */}
              </div>
            </div>
          ))}
        </div>
        {/* Removed Show more button */}
      </div>

    </div>
  )
}
