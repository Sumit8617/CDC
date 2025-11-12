import React, { useState } from "react";
import { Card, Button } from "../../Components/index";
import {
  User,
  Edit2,
  Trophy,
  Star,
  Flame,
  Zap,
  Target,
  Award,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const user = {
    name: "Priya Singh",
    email: "priya.singh@example.com",
    college: "IIT Delhi",
    memberSince: "January 2024",
    bio: "Passionate about problem-solving and competitive programming",
    stats: {
      totalContests: 24,
      avgScore: "82%",
      bestRank: "#45",
      successRate: "87%",
    },
  };

  const chartData = [
    { category: "Reasoning", score: 90 },
    { category: "Quant", score: 85 },
    { category: "Verbal", score: 75 },
    { category: "Logic", score: 88 },
    { category: "Data", score: 70 },
  ];

  const activeIndex = 1;

  const achievements = [
    {
      title: "Top Performer",
      description: "Ranked in top 100 globally",
      icon: <Trophy className="w-7 h-7 text-yellow-500" />,
      color: "bg-yellow-100",
      earned: true,
    },
    {
      title: "Consistency Master",
      description: "Participated in 30 consecutive contests",
      icon: <Star className="w-7 h-7 text-blue-500" />,
      color: "bg-blue-100",
      earned: true,
    },
    {
      title: "Streak Champion",
      description: "Maintained 7-day win streak",
      icon: <Flame className="w-7 h-7 text-orange-500" />,
      color: "bg-orange-100",
      earned: true,
    },
    {
      title: "Speed Demon",
      description: "Completed contest in under 30 minutes",
      icon: <Zap className="w-7 h-7 text-purple-500" />,
      color: "bg-purple-100",
      earned: true,
    },
    {
      title: "Perfect Score",
      description: "Score 100% in a contest",
      icon: <Target className="w-7 h-7 text-gray-400" />,
      color: "bg-gray-100",
      earned: false,
    },
    {
      title: "Master of All",
      description: "Win all types of contests",
      icon: <Award className="w-7 h-7 text-gray-400" />,
      color: "bg-gray-100",
      earned: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </div>

      {/* Main Section */}
      <div className="pt-24 px-4 sm:px-6 md:px-8 space-y-8">
        {/* Navigation Tabs */}
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

        {/* Overview Section */}
        {activeTab === "overview" && (
          <>
            <Card className="p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-900">
                      {user.name}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {user.college} • Member since {user.memberSince}
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 sm:mt-0 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Button>
              </div>

              <hr className="my-6 border-gray-200" />
              <p className="text-gray-700 text-center sm:text-left">
                {user.bio}
              </p>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(user.stats).map(([key, value], i) => (
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
                  <BarChart data={chartData}>
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
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                      }}
                    />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={50}>
                      {chartData.map((entry, index) => (
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

        {/* Achievements */}
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

        {/* Security */}
        {activeTab === "security" && (
          <Card className="p-8 rounded-2xl shadow-sm border border-gray-100 bg-white w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Security Settings
            </h2>

            {/* Change Password */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Change Password
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {["current", "new", "confirm"].map((type, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 mb-2 capitalize">
                      {type} Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword[type] ? "text" : "password"}
                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`Enter ${type} password`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility(type)}
                        className="absolute right-3 top-3.5 text-gray-500"
                      >
                        {showPassword[type] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg">
                  Update Password
                </Button>
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            {/* Two-Factor Authentication */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-gray-600 mb-4">
                Add an extra layer of security to your account using OTP or
                authenticator apps.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Enable 2FA
              </Button>
            </section>

            <hr className="my-8 border-gray-200" />

            {/* Account Recovery */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Account Recovery Options
              </h3>
              <p className="text-gray-600 mb-4">
                Set recovery email or security questions to help regain access
                if you forget your password.
              </p>
              <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg">
                Manage Recovery Options
              </Button>
            </section>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
