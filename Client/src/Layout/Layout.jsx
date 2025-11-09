import React from "react";
import { GeneralNav, Footer } from "../Components/index";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white">
        <GeneralNav />
      </header>

      {/* Page Content */}
      <main className="grow pt-20 px-4 sm:px-6 lg:px-8 flex justify-center">
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
