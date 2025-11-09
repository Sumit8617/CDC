import React from "react";
import { ArrowRight, Zap, UserStar } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "../../index";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] pt-24 pb-24 px-2 sm:px-8 bg-black text-white overflow-hidden">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 -z-10">
        {/* subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 opacity-95"></div>

        {/* horizontal and vertical grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm border border-indigo-400/20">
        <Zap className="h-4 w-4" />
        <span>Join 10,000+ students</span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-3xl leading-tight tracking-tight">
        The <span className="text-indigo-400">React Framework</span> for{" "}
        <span className="relative inline-block">
          the Web
          <span className="absolute left-0 bottom-0 w-full h-[3px] bg-indigo-500 rounded-full"></span>
        </span>
      </h1>

      {/* Subtext */}
      <p className="text-gray-400 mt-6 max-w-2xl text-lg leading-relaxed">
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
          className="flex items-center gap-2 bg-white text-black hover:bg-gray-200"
        >
          Get Started Free <ArrowRight size={18} />
        </Button>

        <Button
          variant="outline"
          size="lg"
          round="lg"
          className="border border-gray-700 hover:bg-gray-800"
        >
          Sign In to Your Account
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-20 text-center w-full max-w-4xl">
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-400">
            <CountUp end={500} duration={3} />+
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Contests</p>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-indigo-400">
            <CountUp end={10000} duration={3} separator="," />+
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Active Students</p>
        </div>

        <div>
          <h2 className="flex items-center justify-center text-4xl font-extrabold text-indigo-400">
            <CountUp end={4.9} decimals={1} duration={3} />
            <UserStar className="h-8 w-8 text-amber-400 ml-1" />
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Rated by Users</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
