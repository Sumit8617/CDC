import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerItems = [
    { name: "About", url: "/about", category: "Company" },
    { name: "Contest", url: "/contests", category: "Product" },
    { name: "Dashboard", url: "/dashboard", category: "Product" },
    { name: "Leaderboard", url: "/leaderboard", category: "Product" },
    { name: "Blog", url: "/blog", category: "Company" },
    { name: "Carrers", url: "/carreres", category: "Company" },
    { name: "Privacy", url: "/privacy", category: "Legal" },
    { name: "Terms", url: "/terms", category: "Legal" },
    { name: "Contact", url: "/contact", category: "Legal" },
  ];

  // Group items by category
  const categories = footerItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  console.log("Footer is Rendering");

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.name}
                    className="hover:text-indigo-600 cursor-pointer"
                  >
                    <Link to={item.url}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

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
            <span className="font-semibold text-gray-900">CDC JGEC</span>
          </div>

          <p className="text-center md:text-right">
            © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All
            rights reserved.
            <br />
            Maintained and Developed by <strong>CDC WEB TEAM</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
