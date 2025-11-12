import React from "react";
import { Card, Button } from "../../Components/index";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Users, Trophy, Zap, Activity } from "lucide-react";

const AdminAnalytics = () => {
  // Example data — replace with real API data
  const overviewStats = [
    {
      title: "Total Users",
      value: 2450,
      icon: <Users className="w-5 h-5" />,
      color: "text-indigo-600",
    },
    {
      title: "Total Contests",
      value: 128,
      icon: <Trophy className="w-5 h-5" />,
      color: "text-yellow-600",
    },
    {
      title: "Active Users",
      value: 1980,
      icon: <Zap className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      title: "Avg. Score",
      value: "78%",
      icon: <Activity className="w-5 h-5" />,
      color: "text-blue-600",
    },
  ];

  const contestPerformance = [
    { contest: "Contest 1", avgScore: 85 },
    { contest: "Contest 2", avgScore: 78 },
    { contest: "Contest 3", avgScore: 92 },
    { contest: "Contest 4", avgScore: 68 },
    { contest: "Contest 5", avgScore: 80 },
  ];

  const userGrowth = [
    { month: "Jan", users: 500 },
    { month: "Feb", users: 800 },
    { month: "Mar", users: 1200 },
    { month: "Apr", users: 1650 },
    { month: "May", users: 1900 },
    { month: "Jun", users: 2200 },
    { month: "Jul", users: 2450 },
  ];

  return (
    <section className="min-h-screen flex flex-col gap-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Analytics Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Insights into user activity, contest performance, and growth.
          </p>
        </div>
        <Button variant="indigo" size="md" round="md">
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card
            key={stat.title}
            className="p-5 flex flex-col items-start justify-center bg-white shadow-sm border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className={`p-2 rounded-lg bg-gray-100 mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Contest Performance */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Contest Performance
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contestPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="contest" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* User Growth Over Time */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Growth Over Time
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminAnalytics;
