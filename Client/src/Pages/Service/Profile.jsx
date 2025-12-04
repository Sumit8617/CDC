import React, { lazy, Suspense, useEffect, useState } from "react";
import { Card, Button, PageLoaderWrapper } from "../../Components/index";
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
import useSignup from "../../Hooks/AuthHooks";

// Lazy Loading
const UserProfileCard = lazy(
  () => import("../../Components/Profile/UserProfileCard")
);
const ChangePassword = lazy(
  () => import("../../Components/Password/UserPasswordChange")
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true); // track loading state

  const { contests = [], getContests } = useContestDetails();
  const { user, handleFetchUserDetails } = useSignup();

  const emptyPerformance = [
    { category: "Reasoning", score: 20 },
    { category: "Quant", score: 50 },
    { category: "Verbal", score: 30 },
    { category: "Logic", score: 80 },
    { category: "Data", score: 10 },
  ];
  const performance = emptyPerformance;
  const activeIndex = 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getContests(), handleFetchUserDetails()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Show loader if user data is not ready or fetching
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoaderWrapper />
      </div>
    );
  }

  // Compute stats after data is fetched
  const totalContestsAvailable =
    user.totalContestsAvailable || contests.length || 0;
  const totalContestsGiven = user.totalContestsGiven || 0;
  const appearance = totalContestsAvailable
    ? Math.round((totalContestsGiven / totalContestsAvailable) * 100)
    : 0;

  const stats = {
    totalContests: totalContestsAvailable,
    yourAppearance: appearance + "%",
    bestRank: user.bestRank ? "#" + user.bestRank : "N/A",
  };

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
              <Suspense fallback={<PageLoaderWrapper />}>
                <UserProfileCard />
              </Suspense>
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

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <Card>
            <Suspense fallback={<PageLoaderWrapper />}>
              <ChangePassword />
            </Suspense>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
