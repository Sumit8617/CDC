import React, { useState } from "react";
import { Card, Button } from "../../Components/index";

const contestHistoryData = [
  {
    id: 1,
    name: "November Coding Challenge",
    date: "2025-11-01",
    status: "Completed",
    score: 85,
  },
  {
    id: 2,
    name: "October Algorithms Contest",
    date: "2025-10-15",
    status: "Completed",
    score: 92,
  },
  {
    id: 3,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 4,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 5,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 6,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 7,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 8,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 9,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
  {
    id: 10,
    name: "September Math Marathon",
    date: "2025-09-20",
    status: "Completed",
    score: 78,
  },
];

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 6;

  // Calculate indexes for slicing
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = contestHistoryData.slice(
    indexOfFirstContest,
    indexOfLastContest
  );

  const totalPages = Math.ceil(contestHistoryData.length / contestsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      {/* Topbar */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Contest History
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 md:px-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-700">
          Your Past Contests
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentContests.map((contest) => (
            <Card
              key={contest.id}
              variant="hover"
              round="lg"
              className="p-5 flex flex-col justify-between h-full transition-transform"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                  {contest.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Date: <span className="font-medium">{contest.date}</span>
                </p>
                <p className="text-sm mb-1">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      contest.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {contest.status}
                  </span>
                </p>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Score: <span className="font-semibold">{contest.score}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "primary" : "outline"}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History;
