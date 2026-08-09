import React, { useEffect, useState } from "react";
import { Card, Button, PageLoaderWrapper, Modal } from "../../Components/index";
import useContests from "../../Hooks/Admin/ManageContestHook";
import { Edit, Trash2, Eye, PlusCircle, Clock, FileQuestion, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageContest = () => {
  const {
    contests: contestData,
    loading,
    fetchContests,
    removeContest,
  } = useContests();

  // State for view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  // Fetch contests on mount
  useEffect(() => {
    fetchContests();
  }, []);

  const contests = (contestData || []).map((contest) => ({
    id: contest._id,
    name: contest.testName || "No Title Found",
    description: contest.description,
    duration: contest.duration,
    totalQuestions: contest.questions?.length || 0,
    status: contest.isDraft ? "Draft" : "Active",
    date: contest.date,
    questions: contest.questions || [],
  }));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      removeContest(id);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/create-contest?edit=${id}`);
  };

  const handleView = (contest) => {
    setSelectedContest(contest);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedContest(null);
  };

  const navigate = useNavigate();

  return (
    <>
      <title>CDC JGEC | Manage Contests</title>
      <meta name="description" content="This is the manage contests page" />
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
            {contests.map(
              (contest) => (
                console.log(contest),
                (
                  <Card
                    key={contest.id}
                    className="flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    {/* Top: Description on left + Status on right */}
                    <div className="flex justify-between items-start mb-4">
                      {/* Description */}
                      <div className="flex-1 pr-4">
                        <p className="text-sm text-gray-800 font-medium line-clamp-3">
                          {contest.name}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
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
                        <span className="font-medium text-gray-700">
                          Duration:
                        </span>{" "}
                        {contest.duration} mins
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Questions:
                        </span>{" "}
                        {contest.totalQuestions}
                      </div>
                    </div>

                    {/* Navigation Buttons: Centered */}
                    <div className="flex justify-center gap-11 mt-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        round="md"
                        className="flex items-center gap-1"
                        onClick={() => handleView(contest)}
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
                )
              )
            )}
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

      {/* View Contest Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title="Contest Details"
      >
        {selectedContest && (
          <div className="space-y-4">
            {/* Contest Name */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedContest.name}
              </h3>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedContest.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedContest.status}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
              <p className="text-sm text-gray-600">{selectedContest.description || "No description provided"}</p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContest.duration} mins</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContest.totalQuestions}</p>
                </div>
              </div>
            </div>

            {/* Date */}
            {selectedContest.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Scheduled Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedContest.date).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Questions Preview */}
            {selectedContest.questions && selectedContest.questions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Questions Preview</h4>
                <div className="max-h-60 overflow-y-auto space-y-3 border border-gray-200 rounded-lg p-3">
                  {selectedContest.questions.slice(0, 5).map((q, index) => (
                    <div key={q._id || index} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                      <p className="font-medium text-gray-800">Q{index + 1}: {q.questionText?.substring(0, 100)}{q.questionText?.length > 100 ? "..." : ""}</p>
                      <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-gray-500">
                        {q.options?.map((opt, i) => (
                          <span key={i} className={i === q.correctOption ? "text-green-600 font-medium" : ""}>
                            {String.fromCharCode(65 + i)}: {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {selectedContest.questions.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{selectedContest.questions.length - 5} more questions
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="md"
                round="md"
                onClick={closeViewModal}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="indigo"
                size="md"
                round="md"
                onClick={() => {
                  closeViewModal();
                  handleEdit(selectedContest.id);
                }}
                className="flex-1"
              >
                Edit Contest
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ManageContest;
