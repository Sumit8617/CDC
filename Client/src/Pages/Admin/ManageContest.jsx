import React, { useState } from "react";
import { Card, Button } from "../../Components/index";
import { Edit, Trash2, Eye, PlusCircle } from "lucide-react";

const ManageContest = () => {
  // Example contest data (can later come from backend)
  const [contests, setContests] = useState([
    {
      id: 1,
      name: "Weekly Coding Challenge",
      description: "Solve 5 questions in 45 minutes.",
      duration: 45,
      totalQuestions: 5,
      status: "Active",
    },
    {
      id: 2,
      name: "Frontend Quiz",
      description: "Test your React & JS knowledge.",
      duration: 30,
      totalQuestions: 10,
      status: "Draft",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      setContests(contests.filter((contest) => contest.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit contest with ID: ${id}`);
  };

  const handleView = (id) => {
    alert(`View contest with ID: ${id}`);
  };

  return (
    <section className="min-h-screen flex flex-col space-y-6 md:pl-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Manage Contests
          </h1>
          <p className="text-gray-500 text-sm">
            View, edit, or delete existing contests.
          </p>
        </div>

        <Button
          variant="indigo"
          size="md"
          round="md"
          className="flex items-center gap-2"
          onClick={() => alert("Navigate to Create Contest")}
        >
          <PlusCircle className="w-5 h-5" />
          Create New Contest
        </Button>
      </div>

      {/* Contest List */}
      {contests.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contests.map((contest) => (
            <Card
              key={contest.id}
              className="p-6 bg-white shadow-sm border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {contest.name}
                </h2>
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

              <p className="text-sm text-gray-600 mb-3">
                {contest.description}
              </p>

              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <span className="mr-4">
                  <strong>Duration:</strong> {contest.duration} mins
                </span>
                <span>
                  <strong>Questions:</strong> {contest.totalQuestions}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
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
        <Card className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl">
          <h3 className="text-gray-700 font-medium text-lg mb-2">
            No contests found
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
      )}
    </section>
  );
};

export default ManageContest;
