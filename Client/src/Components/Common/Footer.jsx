import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">Contests</li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Dashboard
              </li>
              <li className="hover:text-indigo-600 cursor-pointer">
                Leaderboard
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">About</li>
              <li className="hover:text-indigo-600 cursor-pointer">Blog</li>
              <li className="hover:text-indigo-600 cursor-pointer">Careers</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li className="hover:text-indigo-600 cursor-pointer">Privacy</li>
              <li className="hover:text-indigo-600 cursor-pointer">Terms</li>
              <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Follow</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-600">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-indigo-600">
                <Github size={18} />
              </a>
              <a href="#" className="hover:text-indigo-600">
                <Linkedin size={18} />
              </a>
              <a href="#" className="hover:text-indigo-600">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900">{import.meta.env.VITE_APP_NAME}</span>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-right">
            © {new Date().getFullYear()} AptiQuest. All rights reserved.
            <br />
            Maintained and Developed by <strong>CDC WEB TEAM</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
