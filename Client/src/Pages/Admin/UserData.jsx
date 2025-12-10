import React from "react";
import { Card, Button } from "../../Components/index";
import { useAdminStats } from "../../Hooks/AdminStatsHook";
import { User, Mail, Shield, Ban, Edit, Trash2 } from "lucide-react";

const ManageUsers = () => {
  const { userDetails, loading, error, refresh } = useAdminStats();
  console.log(userDetails);
  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
  };

  const handleBlock = (id) => {
    console.log("Toggle block user:", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Delete user:", id);
    }
  };

  return (
    <section className="min-h-screen flex flex-col space-y-8 md:pl-64 pt-4 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manage Users
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage all registered users and their activity.
          </p>
        </div>

        <Button variant="indigo" size="sm" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-gray-700">Loading users...</p>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="p-8 text-center bg-red-50 border border-red-300 rounded-xl">
          <p className="text-red-600 font-medium">{error}</p>
        </Card>
      )}

      {/* User List */}
      {!loading && !error && userDetails?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {userDetails.map((user) => (
            <Card
              key={user._id}
              className="
                p-6 bg-white shadow-sm border border-gray-200 rounded-2xl 
                hover:shadow-lg hover:border-indigo-200 
                transition-all duration-300
              "
            >
              {/* Header */}
              <div className="flex items-center justify-start mb-6 gap-5">
                {/* Profile Picture */}
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-indigo-200 flex items-center justify-center bg-indigo-100">
                  <img
                    src={user?.profilePic?.url || "/default-avatar.png"}
                    alt={`${user.fullName} Profile Picture`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.fullName}
                  </h2>

                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Mail className="w-4 h-4 opacity-70" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="text-sm text-gray-700 mb-5 space-y-3">
                <p className="flex items-center gap-2 ">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Role:</span>
                  <span className="font-semibold">{user.role}</span>
                </p>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      Contests Taken
                    </span>
                    <span className="text-base font-semibold">
                      {user.contestsTaken ?? 0}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Avg Score</span>
                    <span className="text-base font-semibold">
                      {user.avgScore ?? 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleEdit(user._id)}
                >
                  <Edit size={16} /> Edit
                </Button>

                <Button
                  variant={user.status === "Active" ? "danger" : "indigo"}
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleBlock(user._id)}
                >
                  <Ban size={16} />
                  {user.status === "Active" ? "Block" : "Unblock"}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(user._id)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl">
            <h3 className="text-gray-700 font-medium text-lg mb-1">
              No users found
            </h3>
            <p className="text-gray-500 text-sm">
              There are no registered users yet.
            </p>
          </Card>
        )
      )}
    </section>
  );
};

export default ManageUsers;
