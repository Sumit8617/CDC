import React from "react";
import { Card, Button } from "../../Components/index";
import { useNavigate } from "react-router-dom";
import { UserCog, Trophy, BarChart3, Users, Settings } from "lucide-react";

const AdminProfile = () => {
  const navigate = useNavigate();

  // Example admin info
  const admin = {
    name: "Rohan Sharma",
    email: "admin@aptiquest.com",
    role: "Super Admin",
    joined: "February 2024",
  };

  // Example stats
  const stats = [
    {
      label: "Total Contests",
      value: 128,
      icon: <Trophy className="w-5 h-5" />,
      color: "text-yellow-600",
    },
    {
      label: "Active Users",
      value: 2450,
      icon: <Users className="w-5 h-5" />,
      color: "text-indigo-600",
    },
    {
      label: "Reports Reviewed",
      value: 89,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-green-600",
    },
  ];

  // Quick Actions
  const actions = [
    {
      label: "Create Contest",
      icon: <Trophy className="w-4 h-4" />,
      path: "/admin/create-contest",
    },
    {
      label: "Manage Contests",
      icon: <Settings className="w-4 h-4" />,
      path: "/admin/manage-contest",
    },
    {
      label: "User Data",
      icon: <Users className="w-4 h-4" />,
      path: "/admin/user-data",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      path: "/admin/analytics",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-6 md:pl-64">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <Button
          variant="indigo"
          size="md"
          round="md"
          onClick={() => navigate("/admin/settings")}
        >
          <Settings className="w-4 h-4 mr-2" /> Admin Settings
        </Button>
      </div>

      {/* Admin Info */}
      <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
          <UserCog className="w-10 h-10 text-indigo-600" />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-900">{admin.name}</h2>
          <p className="text-gray-600">{admin.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            {admin.role} • Joined {admin.joined}
          </p>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-5 text-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`flex justify-center mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="secondary"
              size="md"
              round="md"
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => navigate(action.path)}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
