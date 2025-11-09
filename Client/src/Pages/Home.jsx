/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { HeroSection, HowItWorks, Testimonials } from "../Components/index";

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Smooth Page Entry Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1], // smooth bezier ease
        }}
      >
        <HeroSection />
      </motion.div>

      {/* Add top margin to create space between sections */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="mt-16 sm:mt-24"
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="mt-16 sm:mt-24"
      >
        <Testimonials />
      </motion.div>
    </div>
  );
};

export default Home;
