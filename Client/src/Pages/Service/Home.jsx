/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { HeroSection, HowItWorks, Testimonials } from "../../Components/index";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role || "public";

  // Redirect Handeler
  useEffect(() => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "user") {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  // --- ADMIN ---
  if (userRole === "admin") {
    return (
      <div className="flex items-center justify-center min-height-screen">
        <p className="text-lg font-medium">Redirecting to admin dashboard...</p>
      </div>
    );
  }

  // --- USER ---
  if (userRole === "user") {
    return (
      <div className="flex items-center justify-center min-height-screen">
        <p className="text-lg font-medium">Redirecting to your dashboard...</p>
      </div>
    );
  }

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
