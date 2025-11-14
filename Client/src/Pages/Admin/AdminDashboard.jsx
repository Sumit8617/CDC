import React from "react";
import { useSelector } from "react-redux";
import { Card, Button } from "../../Components/index";
import {
  Trophy,
  Users,
  FileText,
  DollarSign,
  PlusCircle,
  BarChart3,
  Settings,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Prevent crash if user loading
  if (!user) return null;

  // Protect route
  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-semibold text-lg">
          Access Denied – Admins Only
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Contests",
      value: "12",
      icon: <Trophy className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: "Registered Users",
      value: "1,284",
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Total Submissions",
      value: "5,642",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Revenue (₹)",
      value: "92,430",
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
    },
  ];

  const recentContests = [
    {
      id: 1,
      name: "Aptitude Test Round 1",
      participants: 230,
      status: "Ongoing",
    },
    {
      id: 2,
      name: "Coding Challenge 2025",
      participants: 154,
      status: "Completed",
    },
    { id: 3, name: "Data Science Quiz", participants: 180, status: "Upcoming" },
  ];

  return (
    <div className="flex flex-col w-full space-y-8 md:pl-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Overview of your platform’s performance and activity
          </p>
        </div>

        <Button
          variant="indigo"
          size="md"
          round="md"
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create Contest
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <Card
            key={index}
            variant="outlined"
            className="flex items-center justify-between p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                {item.title}
              </h3>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {item.value}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
          </Card>
        ))}
      </div>

      {/* Recent Contests Table */}
      <Card
        variant="outlined"
        className="p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Contests
          </h2>
          <Button
            variant="secondary"
            size="sm"
            round="md"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-2 px-3 font-medium text-gray-600">Name</th>
                <th className="py-2 px-3 font-medium text-gray-600">
                  Participants
                </th>
                <th className="py-2 px-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentContests.map((contest) => (
                <tr
                  key={contest.id}
                  className="border-b last:border-none hover:bg-gray-50 transition-all"
                >
                  <td className="py-2 px-3 text-gray-800">{contest.name}</td>
                  <td className="py-2 px-3 text-gray-600">
                    {contest.participants}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contest.status === "Ongoing"
                          ? "bg-green-100 text-green-600"
                          : contest.status === "Completed"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="p-5 flex flex-col justify-between bg-indigo-50 hover:bg-indigo-100 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Contest
            </h3>
          </div>
          <Button variant="indigo" size="sm" round="md">
            Get Started
          </Button>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-blue-50 hover:bg-blue-100 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Users
            </h3>
          </div>
          <Button variant="secondary" size="sm" round="md">
            View Users
          </Button>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-gray-50 hover:bg-gray-100 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Admin Settings
            </h3>
          </div>
          <Button variant="secondary" size="sm" round="md">
            Go to Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
