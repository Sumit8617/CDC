import React from "react";
import { useLocation } from "react-router-dom";
import { GeneralNav, Footer } from "../Components/index";

const Layout = ({ children }) => {
  const location = useLocation();

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

  if (isDashboardPage) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <GeneralNav />
        {/* Page Content */}
        <main className="flex-1 overflow-auto flex justify-center">
          <div className="w-full p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    );
  }

  // --- General Public Layout ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white">
        <GeneralNav />
      </header>

      <main className="grow pt-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-8xl mx-auto">{children}</div>
      </main>

      <footer className="mt-auto bg-white border-t border-gray-200 shadow-inner">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
