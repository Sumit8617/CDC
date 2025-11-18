import React from "react";
import { useLocation } from "react-router-dom";
import { GeneralNav, Footer } from "../Components/index";

const Layout = ({ children }) => {
  const location = useLocation();

  // Dashboard pages
  const dashboardRoutes = [
    "*",
    "/contests",
    "/leaderboard",
    "/profile",
    "/contest-history",
  ];

  // Auth pages
  const authRoutes = [
    "*",
    "/login",
    "/signup",
    "/forgot-password",
    "/admin/login",
  ];

  const knownRoutes = [
    "/",
    "/admin/login",
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard",
    "/contests",
    "/contest-history",
    "/leaderboard",
    "/profile",
    "/contest-ended",
    "/admin/dashboard",
    "/admin/create-contest",
    "/admin/manage-contests",
    "/admin/manageusers",
    "/admin/analytics",
    "/admin/profile",
    "/admin/settings",
  ];

  const is404Page = !knownRoutes.includes(location.pathname);
  if (is404Page) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  const isDashboardPage = dashboardRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const isAuthPage = authRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-gray-50">{children}</main>;
  }

  // DashBoard with Nav bar
  if (isDashboardPage) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <GeneralNav />

        <main className="flex-1 overflow-auto flex justify-center">
          <div className="w-full p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    );
  }

  // Public Pages
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
