// src/sections/HowItWorks.jsx
import React from "react";
import { Card } from "../index";
import { BookOpen, Trophy, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <section
      className="py-24 bg-linear-to-b from-gray-100 to-gray-200 rounded-md"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="md:text-6xl sm:text-4xl font-extrabold text-gray-900 font-ubuntu">
          How It Works
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          Get started in three simple steps
        </p>

        {/* Cards */}
        <div
          className="
            mt-16 
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-8 
            place-items-center
          "
        >
          <Card
            className="px-2"
            height="16"
            width="20"
            icon={<BookOpen className="h-8 w-8" />}
            title="Sign Up"
            description="Create your account in seconds and join thousands of students."
            variant="default"
          />

          <Card
            height="16"
            width="20"
            className="px-2"
            icon={<Trophy className="h-8 w-8" />}
            title="Participate"
            description="Take part in engaging contests and test your aptitude skills."
            variant="default"
          />

          <Card
            height="16"
            width="20"
            className="px-2"
            icon={<TrendingUp className="h-8 w-8" />}
            title="Track Progress"
            description="View detailed analytics and climb the competitive leaderboard."
            variant="default"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
