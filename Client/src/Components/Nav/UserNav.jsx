import React, { useState, useEffect } from "react";
import { Home, Trophy, History, Zap, User, LogOut } from "lucide-react";
import { Button, Card } from "../index";
import { useNavigate, useLocation } from "react-router-dom";
import useLogin from "../../Hooks/LoginHook";

const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { handleLogout } = useLogin();

  const menuItems = [
    { name: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    {
      name: "Contests",
      icon: <Trophy className="w-5 h-5" />,
      path: "/contests",
    },
    {
      name: "Contest History",
      icon: <History className="w-5 h-5" />,
      path: "/contest-history",
    },
    {
      name: "Leaderboard",
      icon: <Zap className="w-5 h-5" />,
      path: "/leaderboard",
    },
    { name: "Profile", icon: <User className="w-5 h-5" />, path: "/profile" },
  ];

  // Handel Logout
  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleMobileClick = (item) => {
    setActive(item.name);
    setPopup(item.name);
    navigate(item.path);
    setTimeout(() => setPopup(null), 1500);
  };

  useEffect(() => {
    const found = menuItems.find((item) => item.path === location.pathname);
    if (found) setActive(found.name);
  }, [location.pathname]);

  return (
    <>
      {/* Fixed Desktop Sidebar */}
      <Card
        variant="outlined"
        className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col justify-between bg-white p-4 shadow-sm z-40 border-r border-gray-200"
        round="none"
        height="screen"
      >
        {/* Top Section */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col mt-1 mb-10 border-b border-gray-200 pb-3">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {import.meta.env.VITE_APP_NAME || "AptiQuest"}
              </h1>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant={active === item.name ? "indigo" : "secondary"}
                size="md"
                round="md"
                className={`w-full justify-start gap-3 text-left transition-all duration-200 ${
                  active === item.name ? "ring-1 ring-indigo-200" : ""
                }`}
                onClick={() => {
                  setActive(item.name);
                  navigate(item.path);
                }}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            ))}
          </div>
          <hr className="mt-10" />
        </div>

        {/* Bottom Section (Logout Button) */}
        <div className="border-t border-gray-200 pt-4">
          <Button
            variant="danger"
            size="md"
            round="md"
            className="w-full justify-start gap-3"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </Card>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-sm">
        {menuItems.map((item) => (
          <div key={item.name} className="relative flex flex-col items-center">
            <button
              onClick={() => handleMobileClick(item)}
              className={`flex flex-col items-center justify-center text-gray-600 transition-colors duration-200 ${
                active === item.name ? "text-indigo-600" : ""
              }`}
            >
              {item.icon}
            </button>

            {/* Popup label */}
            {popup === item.name && (
              <span className="absolute -top-7 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-md animate-fadeIn">
                {item.name}
              </span>
            )}
          </div>
        ))}

        {/* Logout Icon */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleLogoutClick} // 🔥 updated
            className="flex flex-col items-center justify-center text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {popup === "Logout" && (
            <span className="absolute -top-7 bg-red-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-md animate-fadeIn">
              Logout
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
