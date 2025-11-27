import React, { lazy, useEffect, useState } from "react";
import { Card, Button } from "../../Components/index";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useContestDetails } from "../../Hooks/TestDetailsHook";

// Lazy Loading
const UserProfileCard = lazy(
  () => import("../../Components/Profile/UserProfileCard")
);
const ChangePassword = lazy(
  () => import("../../Components/Password/UserPasswordChange")
);
const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Test Details Hook
  const { contests = [], getContests } = useContestDetails();

  // Dummy placeholders until UserProfileCard loads user
  const emptyStats = {
    totalContests: contests.length,
    yourApperance: "20%",
    // averageScore: "0%",
    bestRank: "#09",
  };

  useEffect(() => {
    getContests()
  },[]);

  const emptyPerformance = [
    { category: "Reasoning", score: 0 },
    { category: "Quant", score: 0 },
    { category: "Verbal", score: 0 },
    { category: "Logic", score: 0 },
    { category: "Data", score: 0 },
  ];

  const emptyAchievements = [
    {
      title: "Top Performer",
      description: "Ranked in top 100 globally",
      color: "bg-yellow-100",
      icon: null,
      earned: true,
    },
    {
      title: "Consistency Master",
      description: "Participated in 30 consecutive contests",
      color: "bg-blue-100",
      icon: null,
      earned: true,
    },
  ];

  // These will be passed from UserProfileCard later using context/redux
  const stats = emptyStats;
  const performance = emptyPerformance;
  const achievements = emptyAchievements;

  const activeIndex = 1;

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      {/* Header */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </div>

      {/* Main Section */}
      <div className="pt-24 px-4 sm:px-6 md:px-8 space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "overview" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>

          <Button
            variant={activeTab === "achievements" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </Button>

          <Button
            variant={activeTab === "security" ? "primary" : "outline"}
            size="sm"
            round="full"
            onClick={() => setActiveTab("security")}
          >
            Security
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <Card className="">
              <UserProfileCard />
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats).map(([key, value], i) => (
                <Card
                  key={i}
                  className="p-5 rounded-2xl text-center border border-gray-100 bg-white shadow-sm"
                >
                  <div className="text-3xl font-extrabold text-indigo-700">
                    {value}
                  </div>
                  <div className="text-gray-600 mt-1 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                </Card>
              ))}
            </div>

            {/* Chart */}
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Performance by Category
              </h2>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: "#555", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#555", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={50}>
                      {performance.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={index === activeIndex ? "#4F46E5" : "#6366F1"}
                          opacity={index === activeIndex ? 1 : 0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Achievements & Badges
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all ${
                    item.earned
                      ? "bg-white hover:shadow-md border-gray-100"
                      : "bg-gray-50 border-gray-200 opacity-70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}
                  >
                    {item.icon}
                  </div>

                  <h3
                    className={`text-base font-semibold ${
                      item.earned ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-sm mt-1 ${
                      item.earned ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <Card>
            <ChangePassword />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
