import React from "react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="text-6xl mb-6 animate-bounce">🚧</div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          We’ll be back soon!
        </h1>

        {/* Description */}
        <p className="text-gray-300 mb-6 text-lg">
          Sorry for the inconvenience. Our website is currently undergoing
          scheduled maintenance. We should be back shortly.
        </p>

        {/* Optional Button */}
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Refresh Page
        </button>

        {/* Footer note */}
        <p className="text-gray-500 mt-6 text-sm">
          Thank you for your patience 🙏
        </p>
      </div>
    </div>
  );
}
