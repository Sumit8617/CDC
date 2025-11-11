/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  HeroSection,
  HowItWorks,
  Testimonials,
  UserDashboard,
  Sidebar,
} from "../../Components/index";

const Home = () => {
  const [userRole, setUserRole] = useState("user");

  // Simulate fetching user role from localStorage (or auth context)
  useEffect(() => {
    const role = "user";
    setUserRole(role);
  }, []);

  if (!userRole) return null;

  // --- ADMIN ---
  if (userRole === "admin") {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, Admin! Manage contests, users, and settings here.
          </p>
        </div>
      </div>
    );
  }

  // --- USER ---
  if (userRole === "user") {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900">
        <main className="flex-1 overflow-y-auto w-full">
          <UserDashboard />
        </main>
      </div>
    );
  }

  // --- PUBLIC (Viewer / Not Logged In) ---
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <HeroSection />
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="mt-16 sm:mt-24"
      >
        <HowItWorks />
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="mt-16 sm:mt-24"
      >
        <Testimonials />
      </motion.div>
    </div>
  );
};

export default Home;
