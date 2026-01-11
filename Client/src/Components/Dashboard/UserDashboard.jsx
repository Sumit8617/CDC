import React, { useState, useEffect } from "react";
import { Flame, Award, Target, TrendingUp } from "lucide-react";
import { Card, Button, PageLoaderWrapper } from "../index";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useSignup from "../../Hooks/AuthHooks";

const UserDashboard = () => {
  const { user, loadingUser, handleFetchUserDetails } = useSignup();

  useEffect(() => {
    handleFetchUserDetails();
  }, [handleFetchUserDetails]);

  const [activeTab, setActiveTab] = useState("Performance Overview");

  const stats = [
    {
      label: "Total Contest",
      value: user?.totalContestsGiven || 0,
      icon: <Award className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Current Streak",
      value: "7 Days",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      label: "Best Rank",
      value: "#12",
      icon: <Target className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      label: "Avg. Score",
      value: "82%",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  const tabs = ["Performance Overview", "Upcoming Contests", "Recent History"];

  // Mock Performance Data
  const performanceData = [
    { week: "Week 1", score: 45, percentile: 65 },
    { week: "Week 2", score: 0, percentile: 0 },
    { week: "Week 3", score: 100, percentile: 75 },
    { week: "Week 4", score: 80, percentile: 80 },
    { week: "Week 5", score: 78, percentile: 85 },
    { week: "Week 6", score: 85, percentile: 90 },
    { week: "Week 7", score: 25, percentile: 90 },
    { week: "Week 8", score: 25, percentile: 90 },
    { week: "Week 9", score: 25, percentile: 90 },
    { week: "Week 10", score: 50, percentile: 90 },
    { week: "Week 11", score: 45, percentile: 90 },
    { week: "Week 12", score: 75, percentile: 90 },
    { week: "Week 13", score: 5, percentile: 90 },
    { week: "Week 14", score: 85, percentile: 90 },
    { week: "Week 15", score: 55, percentile: 90 },
    { week: "Week 16", score: 95, percentile: 90 },
  ];

  if (loadingUser)
    return (
      <div>
        {" "}
        <PageLoaderWrapper loading={loadingUser} />{" "}
      </div>
    );

  return (
    <div className="md:pl-64">
      <div
        className="
        flex-1 w-full 
        px-3 sm:px-6 xl:px-10 lg:pl-64
        pb-20 sm:pb-16 pb-safe 
        overflow-y-auto 
        bg-gray-50
      "
        style={{ scrollPaddingBottom: "6rem" }}
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Hello, {user?.fullName?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Your personal dashboard to track and improve your aptitude.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-10">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              padding="p-3 sm:p-6"
              className="relative border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300
                 w-full xs:w-[48%] sm:w-[45%] md:w-[30%] lg:w-[22%]"
            >
              {/* Icon */}
              <div
                className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl ${stat.bg}`}
              >
                {stat.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col items-start w-full pr-2 sm:pr-4">
                <p className="text-gray-600 text-[10px] xs:text-[11px] sm:text-sm font-medium leading-snug truncate sm:whitespace-normal">
                  {stat.label}
                </p>
                <h3 className="text-lg sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 leading-tight wrap-break-words">
                  {stat.value}
                </h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="w-full overflow-x-auto hide-scrollbar p-2 mb-6">
          <div className="flex min-w-max sm:min-w-0 gap-2 sm:gap-3 border-b-2 border-gray-500 p-3">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "indigo" : "secondary"}
                size="sm"
                round="md"
                className={`
          shrink-0 
          px-3 sm:px-4 
          py-1.5 sm:py-2 
          text-xs sm:text-sm 
          font-medium 
          transition-all
          ${activeTab === tab ? "text-white" : "text-gray-700"}
        `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "Performance Overview" && (
            <div>
              {/* Performance Trend Section */}
              <Card className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Performance Trend
                </h2>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performanceData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorScore"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#111111"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#111111"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                      />
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#000", fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#000", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ color: "#111", fontWeight: 600 }}
                        formatter={(value, name) =>
                          name === "score"
                            ? [`${value}%`, "Average Score"]
                            : [`${value}`, "Percentile Rank"]
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#111"
                        fill="url(#colorScore)"
                        strokeWidth={2}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-around mt-4 text-gray-600 text-xs sm:text-sm">
                  {/* <span>Average Score</span> */}
                  <span>Percentile Rank</span>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "Upcoming Contests" && (
            <p className="text-gray-700 text-base sm:text-lg">
              Upcoming contests and registration details will appear here.
            </p>
          )}

          {activeTab === "Recent History" && (
            <p className="text-gray-700 text-base sm:text-lg">
              Your recent participation history and results will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
