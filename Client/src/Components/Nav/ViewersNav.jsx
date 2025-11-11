import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../index";
import { useNavigate } from "react-router-dom";
const ViewersNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 z-50 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-800">
            {import.meta.env.VITE_APP_NAME || "CDC"}
          </h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 text-gray-800 font-medium">
          <li
            className="cursor-pointer hover:text-indigo-600"
            onClick={() => {
              const element = document.getElementById("how-it-works");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            How It Works
          </li>
          <li
            className="cursor-pointer hover:text-indigo-600"
            onClick={() => {
              const element = document.getElementById("review");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Students Review
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="indigo"
            size="sm"
            onClick={() => navigate("/signup")}
          >
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
            <li
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => {
                const element = document.getElementById("how-it-works");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }
              }}
            >
              How It Works
            </li>
            <li
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => {
                const element = document.getElementById("review");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }
              }}
            >
              Students Review
            </li>
          </ul>

          <div className="flex flex-col items-center space-y-3 pb-4">
            <Button
              variant="outline"
              size="md"
              className="w-3/4"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="indigo"
              size="md"
              className="w-3/4"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ViewersNav;
