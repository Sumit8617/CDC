import React, { useEffect } from "react";
import { Card, Button, PageLoaderWrapper } from "../../Components/index";
import useContests from "../../Hooks/Admin/ManageContestHook";
import { Edit, Trash2, Eye, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageContest = () => {
  const {
    contests: contestData,
    loading,
    fetchContests,
    removeContest,
  } = useContests();

  // Fetch contests on mount
  useEffect(() => {
    fetchContests();
  }, []);

  const contests = (contestData || []).map((contest) => ({
    id: contest._id,
    name: contest.name,
    description: contest.description,
    duration: contest.duration,
    totalQuestions: contest.questions?.length || 0,
    status: contest.isDraft ? "Draft" : "Active",
  }));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      removeContest(id);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit feature for this ID: ${id} will be implemented soon.`);
  };

  const handleView = (id) => {
    alert(`View feature for this ID: ${id} will be implemented soon.`);
  };

  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Manage Contests
          </h1>
          <p className="text-gray-500 text-sm">
            View, edit, or delete Draft contests.
          </p>
        </div>

        <Button
          variant="indigo"
          size="md"
          round="md"
          className="flex items-center gap-2"
          onClick={() => navigate("/admin/create-contest")}
        >
          <PlusCircle className="w-5 h-5" />
          Create New Contest
        </Button>
      </div>

      {/* Loading */}
      {loading && <PageLoaderWrapper loading={loading} />}

      {/* Contest List */}
      {!loading && contests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card
              key={contest.id}
              className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              {/* Top: Description on left + Status on right */}
              <div className="flex justify-between items-start mb-4">
                {/* Description */}
                <div className="flex-1 pr-4">
                  <p className="text-sm text-gray-800 font-medium line-clamp-3">
                    {contest.description}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      contest.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {contest.status}
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex justify-between text-sm text-gray-500 mb-6">
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>{" "}
                  {contest.duration} mins
                </div>
                <div>
                  <span className="font-medium text-gray-700">Questions:</span>{" "}
                  {contest.totalQuestions}
                </div>
              </div>

              {/* Navigation Buttons: Centered */}
              <div className="flex justify-center gap-3 mt-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleView(contest.id)}
                >
                  <Eye size={16} />
                  View
                </Button>

                <Button
                  type="button"
                  variant="indigo"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleEdit(contest.id)}
                >
                  <Edit size={16} />
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  round="md"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(contest.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !loading && (
          <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl">
            <h3 className="text-gray-700 font-medium text-lg mb-2">
              No Draft contests found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Start by creating your first contest.
            </p>
            <Button
              variant="indigo"
              size="md"
              round="md"
              onClick={() => alert("Navigate to Create Contest")}
            >
              Create Contest
            </Button>
          </Card>
        )
      )}
    </section>
  );
};

export default ManageContest;
