import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../index";
const ViewersNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-800">
            {import.meta.env.VITE_APP_NAME || "CDC"}
          </h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-800 font-medium">
          <li className="cursor-pointer hover:text-indigo-600">How It Works</li>
          <li className="cursor-pointer hover:text-indigo-600">Contact Us</li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button variant="indigo" size="sm">
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <ul className="flex flex-col items-center space-y-4 py-4 text-gray-800 font-medium">
            <li className="hover:text-indigo-600 cursor-pointer">
              How It Works
            </li>
            <li className="hover:text-indigo-600 cursor-pointer">Contact Us</li>
          </ul>

          <div className="flex flex-col items-center space-y-3 pb-4">
            <Button variant="outline" size="md" className="w-3/4">
              Login
            </Button>
            <Button variant="indigo" size="md" className="w-3/4">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ViewersNav;
