import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Button } from "../../Components/index";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import axios from "axios";

const ContestHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const fetchAllContests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/v1/admin/auth/get-contest`
        );
        setContests(res.data.data.recentContests || []);
      } catch (err) {
        console.error("Error fetching contests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContests();
  }, [user]);

  // Protect route
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

  return (
    <div className="flex flex-col w-full space-y-8 md:pl-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Contest History
        </h1>
        <Button
          variant="secondary"
          size="sm"
          round="md"
          className="flex items-center gap-2"
          onClick={() => navigate("/admin/dashboard")}
        >
          <BarChart3 className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Contest Table */}
      <Card
        variant="outlined"
        className="p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-2 px-3 font-medium text-gray-600">Name</th>
                <th className="py-2 px-3 font-medium text-gray-600">
                  Description
                </th>
                <th className="py-2 px-3 font-medium text-gray-600">
                  Duration
                </th>
                <th className="py-2 px-3 font-medium text-gray-600">
                  Participants
                </th>
                <th className="py-2 px-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Loading contests...
                  </td>
                </tr>
              ) : contests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No contests found.
                  </td>
                </tr>
              ) : (
                contests.map((contest) => (
                  <tr
                    key={contest._id}
                    className="border-b last:border-none hover:bg-gray-50 transition-all"
                  >
                    <td className="py-2 px-3 text-gray-800">
                      {contest.testName}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {contest.description}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {contest.duration} min
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
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ContestHistory;
