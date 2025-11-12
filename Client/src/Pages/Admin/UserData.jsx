import React, { useState } from "react";
import { Card, Button } from "../../Components/index";
import { User, Mail, Shield, Ban, Edit, Trash2 } from "lucide-react";

const ManageUsers = () => {
  // Example data — later, fetch this from backend
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Subhas Mondal",
      email: "subhas@example.com",
      role: "Admin",
      status: "Active",
      contestsTaken: 12,
      avgScore: 87,
    },
    {
      id: 2,
      name: "Riya Sharma",
      email: "riya.sharma@example.com",
      role: "User",
      status: "Active",
      contestsTaken: 8,
      avgScore: 76,
    },
    {
      id: 3,
      name: "Amit Verma",
      email: "amit.verma@example.com",
      role: "User",
      status: "Blocked",
      contestsTaken: 5,
      avgScore: 61,
    },
  ]);

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
  };

  const handleBlock = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Blocked" : "Active",
            }
          : user
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <section className="min-h-screen flex flex-col space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm">
            View and manage all registered users.
          </p>
        </div>
      </div>

      {/* User List */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full p-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* User Details */}
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Role: <span className="font-medium">{user.role}</span>
                </p>
                <p>
                  Contests Taken:{" "}
                  <span className="font-medium">{user.contestsTaken}</span>
                </p>
                <p>
                  Avg. Score:{" "}
                  <span className="font-medium">{user.avgScore}%</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleEdit(user.id)}
                >
                  <Edit size={16} /> Edit
                </Button>

                <Button
                  variant={user.status === "Active" ? "danger" : "indigo"}
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleBlock(user.id)}
                >
                  <Ban size={16} />
                  {user.status === "Active" ? "Block" : "Unblock"}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl">
          <h3 className="text-gray-700 font-medium text-lg mb-2">
            No users found
          </h3>
          <p className="text-gray-500 text-sm">No registered users yet.</p>
        </Card>
      )}
    </section>
  );
};

export default ManageUsers;
