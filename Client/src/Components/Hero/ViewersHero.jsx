import React, { useEffect, useState } from "react";
import { ArrowRight, Zap, UserStar } from "lucide-react";
import axios from "axios";
import CountUp from "react-countup";
import { Button, ResponsiveUnderline } from "../index";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "../../Hooks/AdminStatsHook";

const HeroSection = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const { stats } = useAdminStats();
  console.log("Stats =>", stats[1].value);

  useEffect(() => {
    // Trigger underline animation once component mounts
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const [totalUser, setTotalUser] = useState(0);
  const [totalContest, setTotalContest] = useState(0);

  useEffect(() => {
    const fetchTotalUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/v1/viewer/get-total-user`
        );
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/v1/viewer/get-total-contest`
        );
        setTotalUser(res.data.data);
        setTotalContest(response.data.data);
      } catch (err) {
        console.error("Error fetching total users:", err);
      }
    };

    fetchTotalUser();
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] pt-16 pb-24 px-4 sm:px-8 bg-linear-to-b from-white to-gray-200 text-gray-900 overflow-hidden rounded-md shadow-md">
      {/* Subtle Radial Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-200 shadow-sm">
        <Zap className="h-4 w-4" />
        <span>Join {totalUser}+ students</span>
      </div>

      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight relative font-ubuntu">
        Sharpen Your Mind With{" "}
        <span className="relative inline-block text-indigo-600">
          <ResponsiveUnderline animate={animate} />
        </span>{" "}
        Challenges
      </h2>

      {/* Subtext */}
      <p className="text-gray-500 mt-6 max-w-2xl text-lg leading-relaxed">
        Master logical reasoning and problem-solving skills through engaging
        contests. Track your progress, climb the leaderboard, and compete with
        students worldwide.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button
          variant="primary"
          size="lg"
          round="lg"
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 text-white"
        >
          Get Started Free <ArrowRight size={18} />
        </Button>

        <Button
          variant="outline"
          size="lg"
          round="lg"
          onClick={() => navigate("/login")}
          className="border border-gray-300 text-white"
        >
          Sign In to Your Account
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-20 text-center w-full max-w-4xl">
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-600">
            <CountUp end={totalContest} duration={3} />+
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Contests</p>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-indigo-600">
            <CountUp end={totalUser} duration={3} separator="," />+
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Active Students</p>
        </div>

        <div>
          <h2 className="flex items-center justify-center text-4xl font-extrabold text-indigo-600">
            <CountUp end={4.9} decimals={1} duration={3} />
            <UserStar className="h-8 w-8 text-amber-400 ml-1" />
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Rated by Users</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
