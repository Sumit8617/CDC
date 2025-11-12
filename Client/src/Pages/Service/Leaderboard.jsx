import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Button, Input } from "../../Components/index";
import {
  Trophy,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const leaderboardData = [
  {
    id: 1,
    name: "Arjun Sharma",
    college: "IIT Delhi",
    score: 9850,
    contests: 45,
    trend: "up",
  },
  {
    id: 2,
    name: "Priya Singh",
    college: "IIT Bombay",
    score: 9720,
    contests: 42,
    trend: "up",
  },
  {
    id: 3,
    name: "Rohan Gupta",
    college: "BITS Pilani",
    score: 9580,
    contests: 40,
    trend: "down",
  },
  {
    id: 4,
    name: "Neha Verma",
    college: "Delhi University",
    score: 9410,
    contests: 38,
    trend: "up",
  },
  {
    id: 5,
    name: "Aditya Kumar",
    college: "IISER Pune",
    score: 9280,
    contests: 36,
    trend: "neutral",
  },
  {
    id: 6,
    name: "Sophia Patel",
    college: "IIT Madras",
    score: 9150,
    contests: 35,
    trend: "down",
  },
  {
    id: 7,
    name: "Karan Mehta",
    college: "IIT Kanpur",
    score: 9010,
    contests: 33,
    trend: "up",
  },
  {
    id: 8,
    name: "Maya Reddy",
    college: "NIT Trichy",
    score: 8920,
    contests: 31,
    trend: "neutral",
  },
  {
    id: 9,
    name: "Ayaan Khan",
    college: "IIT Roorkee",
    score: 8800,
    contests: 30,
    trend: "up",
  },
  {
    id: 10,
    name: "Tanya Desai",
    college: "VIT Vellore",
    score: 8700,
    contests: 29,
    trend: "down",
  },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [searchTerm, setSearchTerm] = useState("");
  const methods = useForm({ defaultValues: { search: "" } });

  const filteredUsers = leaderboardData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #1
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #2
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #3
          </div>
        );
      default:
        return (
          <div className="font-semibold text-gray-700 text-sm">#{rank}</div>
        );
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Leaderboard
          </h1>
        </div>
      </div>

      <div className="pt-24 px-4 sm:px-6 md:px-8 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["global", "college", "month"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "primary" : "outline"}
              round="full"
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "global"
                ? "Global Rankings"
                : tab === "college"
                  ? "College Rankings"
                  : "This Month"}
            </Button>
          ))}
        </div>

        {/* Updated Search + Filter Section */}
        <FormProvider {...methods}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "global"
                ? "Global Leaderboard"
                : activeTab === "college"
                  ? "College Leaderboard"
                  : "Monthly Leaderboard"}
            </h2>

            <div className="flex items-center w-full gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-50 transition-all duration-200">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>
        </FormProvider>

        {/* Leaderboard Table */}
        <Card variant="outlined" round="lg" className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Contests</th>
                <th className="px-4 py-3">Trend</th>
              </tr>
            </thead>
            <tbody className="py-5">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-3">{getRankBadge(index + 1)}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.college}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-600 text-white font-semibold text-xs px-3 py-1 rounded-full">
                      {user.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.contests}</td>
                  <td className="px-4 py-3">{getTrendIcon(user.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Rank Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white">
            <h3 className="text-gray-600 font-medium mb-2">Your Global Rank</h3>
            <div className="text-4xl font-extrabold text-indigo-700">#145</div>
            <div className="flex items-center gap-2 mt-1 text-green-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4" /> +12 from last week
            </div>
          </Card>

          <Card className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white">
            <h3 className="text-gray-600 font-medium mb-2">College Rank</h3>
            <div className="text-4xl font-extrabold text-indigo-700">#8</div>
            <div className="flex items-center gap-2 mt-1 text-green-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4" /> +2 from last week
            </div>
          </Card>

          <Card className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white">
            <h3 className="text-gray-600 font-medium mb-2">Month Rank</h3>
            <div className="text-4xl font-extrabold text-indigo-700">#23</div>
            <div className="flex items-center gap-2 mt-1 text-red-600 text-sm font-medium">
              <ArrowDown className="w-4 h-4" /> -5 from last month
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
