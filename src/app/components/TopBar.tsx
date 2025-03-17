'use client';

export default function TopBar() {
  return (
    <nav className="bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Home</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Add navigation items here later if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
} 