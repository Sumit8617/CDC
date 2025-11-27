import React, { useEffect, useState } from "react";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4"></div>
        <p className="text-gray-700 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export const PageLoaderWrapper = ({ loading }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout;
    if (loading) {
      // Show loader immediately
      setShowLoader(true);
    } else {
      // Ensure loader stays for at least 1 second
      timeout = setTimeout(() => setShowLoader(false), 1000);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  if (!showLoader) return null;

  return <PageLoader />;
};