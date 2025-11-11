import React from "react";
import { useLocation } from "react-router-dom";
import { GeneralNav, Footer } from "../Components/index";

const Layout = ({ children }) => {
  const location = useLocation();

  // Define routes that should use Sidebar layout instead of General layout
  const dashboardRoutes = [
    "/",
    "/contests",
    "/leaderboard",
    "/profile",
    "/contest-history",
  ];

  const isDashboardPage = dashboardRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // --- Dashboard Layout (Sidebar already handles spacing) ---
  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
        {children}
      </div>
    );
  }

  // --- General Public Layout (Navbar + Footer) ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white">
        <GeneralNav />
      </header>

      {/* Page Content */}
      <main className="grow pt-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-8xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200 shadow-inner">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
