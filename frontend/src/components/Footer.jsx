import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Footer Links */}

        {/* Logo and Language Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LinkedIn</span>
            </div>
            <span className="text-sm text-gray-600">© {currentYear}</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English (English)</option>
              <option>Español (Spanish)</option>
              <option>Français (French)</option>
              <option>Deutsch (German)</option>
              <option>中文 (Chinese)</option>
            </select>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">User Agreement</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Copyright Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Brand Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Guest Controls</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Community Guidelines</a>
        </div>
      </div>
    </footer>
  );
}