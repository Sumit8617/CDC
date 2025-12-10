import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Button } from "../../Components/index";
import { PlusCircle, BarChart3, Send } from "lucide-react";
import { useAdminStats } from "../../Hooks/AdminStatsHook";
import { useAdminInvite } from "../../Hooks/Admin/AdminAuthHook";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => state.auth);

  const { stats, recentContests } = useAdminStats();

  const {
    sendAdminInvite,
    inviteLoading,
    inviteError,
    inviteSuccess,
    resetInviteState,
  } = useAdminInvite();

  const navigate = useNavigate();

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 font-semibold text-lg">
          Access Denied – Admins Only
        </p>
      </div>
    );
  }

  const handleAdminInvite = async (e) => {
    try {
      e.preventDefault();
      await sendAdminInvite(fullName, email);
      setFullName("");
      setEmail("");
      setTimeout(() => {
        setOpenModal(false);
      }, 2000);
    } catch (error) {
      console.log("Err While Sending the Admin invite", error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setFullName("");
    setEmail("");
    resetInviteState();
  };

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

        <div className="flex justify-end items-center gap-3">
          <Button
            variant="green"
            size="md"
            round="md"
            className="flex items-center justify-end gap-2"
            onClick={() => setOpenModal(true)}
          >
            <Send className="w-5 h-5" />
            Admin Invite
          </Button>

          <Button
            variant="indigo"
            size="md"
            round="md"
            className="flex items-center gap-2"
            onClick={() => navigate("/admin/create-contest")}
          >
            <PlusCircle className="w-5 h-5" />
            Create Contest
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              variant="outlined"
              className="flex items-center justify-between p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              height="8"
            >
              <div>
                <h3 className="text-sm text-gray-500 font-medium flex justify-center items-center gap-3">
                  {item.title} <Icon className="w-6 h-6 text-indigo-600" />
                </h3>
                <p className="text-2xl font-semibold text-gray-900 mt-4">
                  {item.value}
                </p>
              </div>
            </Card>
          );
        })}
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
            onClick={() => navigate("/admin/contest-history")}
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
              {recentContests && recentContests.length > 0 ? (
                recentContests.slice(0, 7).map((contest) => (
                  <tr
                    key={contest._id}
                    className="border-b last:border-none hover:bg-gray-50 transition-all"
                  >
                    <td className="py-2 px-3 text-gray-800">
                      {contest.testName}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {contest.participants || 0}
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
                        {contest.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No contests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admin Invite popup */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Invite Admin
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleAdminInvite}>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Enter the College mail
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="green"
                size="md"
                round="md"
                className="mt-2 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />

                {inviteLoading
                  ? "Sending Invite..."
                  : inviteSuccess
                    ? "Invite Sent!"
                    : inviteError
                      ? "Failed to Send Invite"
                      : "Send"}
              </Button>
            </form>

            {/* Success message */}
            {inviteSuccess && (
              <p className="mt-4 text-green-600 font-medium text-center">
                {inviteSuccess}
              </p>
            )}

            {/* Error message */}
            {inviteError && (
              <p className="mt-4 text-red-600 font-medium text-center">
                {inviteError}
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
