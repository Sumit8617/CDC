import React, { useState, useEffect } from "react";
import { Button } from "../../Components/index";
import useUpcomingContests from "../../Hooks/UpcomingContestHook";

const QuestionCard = ({ question, selectedOption, setSelectedOption }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full border-2 border-gray-200">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      {question?.questionText}
    </h3>
    <div className="flex flex-col gap-3">
      {question?.options.map((option, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => setSelectedOption(question._id, option)}
          className={`flex items-center gap-2 border rounded-lg px-3 sm:px-4 py-2 text-left w-full transition text-sm sm:text-base ${
            selectedOption[question._id] === option
              ? "bg-blue-100 border-blue-500 text-blue-800"
              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const Contest = () => {
  const { contests, loading, error } = useUpcomingContests();
  console.log("Upcoming Contests:", contests);
  const activeContest =
    contests.find((c) => c?.status === "active") ||
    contests.find((c) => c?.status === "pending");

  const [selectedOption, setSelectedOptionState] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    activeContest ? Math.floor(activeContest.remainingTime / 1000) : 0
  );
  const [finished, setFinished] = useState(false);

  // Update timer when active contest changes
  useEffect(() => {
    if (activeContest)
      setTimeLeft(Math.floor(activeContest.remainingTime / 1000));
  }, [activeContest]);

  // Prevent re-entry after contest ended
  useEffect(() => {
    if (localStorage.getItem("contestEnded") === "true") {
      window.location.href = "/contest-ended?reason=already-finished";
    }
  }, []);

  const finishContest = (reason) => {
    if (finished) return;
    setFinished(true);
    localStorage.setItem("contestEnded", "true");
    console.log("Contest ended:", reason);
    console.log("User answers:", selectedOption);

    if (document.exitFullscreen) document.exitFullscreen();
    window.location.href = `/contest-ended?reason=${encodeURIComponent(reason)}`;
  };

  // Countdown Timer
  useEffect(() => {
    if (finished || !activeContest) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishContest("Time up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, activeContest]);

  // Question navigation
  const setSelectedOption = (questionId, option) => {
    setSelectedOptionState((prev) => ({ ...prev, [questionId]: option }));
  };
  const handleNext = () =>
    currentQuestion < activeContest.questions.length - 1 &&
    setCurrentQuestion(currentQuestion + 1);
  const handlePrevious = () =>
    currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1);
  const handleSubmit = () => finishContest("User submitted manually");

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) return <p>Loading contest...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!activeContest) return <p>No active contest at this time.</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:pl-64">
      {/* Topbar */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-40">
        <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 shrink">
            {activeContest.title}
          </h1>
          <div className="bg-gray-100 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base text-red-600 text-center shrink-0">
            Remaining Time {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sm:px-6 px-3">
        <div
          className="flex flex-col justify-center items-center"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          {/* Question Dashboard */}
          <div className="w-full max-w-3xl flex flex-col items-center gap-4">
            <div className="my-5 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {activeContest.questions.map((q, idx) => (
                <div
                  key={q._id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border text-xs sm:text-sm cursor-pointer transition-all duration-200
                    ${
                      currentQuestion === idx
                        ? "bg-blue-500 border-blue-700 text-white"
                        : selectedOption[q._id]
                          ? "bg-green-500 border-green-700 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Question Card */}
          <QuestionCard
            question={activeContest.questions[currentQuestion]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />

          {/* Pagination Buttons */}
          <div className="mt-4 sm:mt-6 flex justify-between w-full gap-2 sm:gap-0 max-w-3xl">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === activeContest.questions.length - 1 ? (
              <Button variant="primary" onClick={handleSubmit}>
                Submit Answers
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
