/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";

import {
  HeroSection,
  HowItWorks,
  Testimonials,
  UserDashboard,
  Sidebar,
  Footer,
} from "../../Components/index";
import { AdminDashboard } from "../index";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role || "public";

  // --- ADMIN ---
  if (userRole === "admin") {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 md:pl-64">
        <main className="flex-1 overflow-y-auto w-full">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  // --- USER ---
  if (userRole === "user") {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 md:pl-64">
        <main className="flex-1 overflow-y-auto w-full">
          <UserDashboard />
        </main>
      </div>
    );
  }

  // --- PUBLIC (not logged in) ---
  // --- PUBLIC (not logged in) ---
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
