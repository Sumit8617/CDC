import React, { useState, useEffect } from "react";
import {
  Button,
  PageLoaderWrapper,
  Card,
  AnimatedDigit,
} from "../../Components/index";
import useUpcomingContests from "../../Hooks/UpcomingContestHook";
import useContestSubmission from "../../Hooks/SubmitContestHook";
import useSignup from "../../Hooks/AuthHooks";

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
          onClick={() => setSelectedOption(question._id, idx)}
          className={`flex items-center gap-2 border rounded-lg px-3 sm:px-4 py-2 text-left w-full transition text-sm sm:text-base ${
            selectedOption[question._id] === idx
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

// Helper to parse backend IST string as local date
const parseISTDate = (istString) => {
  // Split date and time
  const [datePart, timePart] = istString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((v) => Number(v.replace("Z", "")));

  // Note: month is 0-indexed in JS
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const Contest = () => {
  const { contests, loading, error } = useUpcomingContests();
  const { submit, loading: submitting } = useContestSubmission();
  const { user, handleFetchUserDetails, loadingUser } = useSignup();

  const [selectedOption, setSelectedOptionState] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user if not available
  useEffect(() => {
    if (!user) handleFetchUserDetails();
  }, [user, handleFetchUserDetails]);

  // Prevent re-entry after contest ended
  useEffect(() => {
    if (localStorage.getItem("contestEnded") === "true") {
      window.location.href = "/contest-ended?reason=already-finished";
    }
  }, []);

  // Find active and upcoming contests
  const activeContest = contests.find((c) => {
    const start = parseISTDate(c.startDate).getTime();
    const end = start + c.duration * 60 * 1000;
    return currentTime >= start && currentTime <= end;
  });

  const upcomingContest = contests.find((c) => {
    const start = parseISTDate(c.startDate).getTime();
    return start > currentTime;
  });

  const contestToShow = activeContest || upcomingContest;

  const contestStart = contestToShow
    ? parseISTDate(contestToShow.startDate).getTime()
    : 0;
  const contestEnd = contestToShow
    ? contestStart + contestToShow.duration * 60 * 1000
    : 0;

  const INSTRUCTION_BEFORE_MS = 5 * 60 * 60 * 1000; // 5 hours

  const isContestUpcoming =
    contestToShow &&
    currentTime >= contestStart - INSTRUCTION_BEFORE_MS &&
    currentTime < contestStart;

  const isContestOngoing =
    contestToShow && currentTime >= contestStart && currentTime <= contestEnd;

  const hasContestEnded = contestToShow && currentTime > contestEnd;

  // Countdown timer
  useEffect(() => {
    let interval;
    if (isContestOngoing) {
      interval = setInterval(() => {
        const left = Math.max(0, Math.floor((contestEnd - Date.now()) / 1000));
        setTimeLeft(left);
        if (left === 0) {
          finishContest("Time up");
          clearInterval(interval);
        }
      }, 1000);
    } else if (isContestUpcoming) {
      interval = setInterval(() => {
        const left = Math.max(
          0,
          Math.floor((contestStart - Date.now()) / 1000)
        );
        setTimeLeft(left);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [contestStart, contestEnd, isContestOngoing, isContestUpcoming]);

  const finishContest = async (reason) => {
    if (finished) return;
    setFinished(true);
    localStorage.setItem("contestEnded", "true");

    if (!user) {
      console.error("User not loaded yet. Cannot submit.");
      return;
    }

    const questionsPayload = Object.entries(selectedOption).map(
      ([questionId, option]) => ({
        question: questionId,
        submittedOption: Number(option),
      })
    );

    try {
      await submit({
        contest: contestToShow._id,
        user: user.id,
        questions: questionsPayload,
      });
      alert(`Contest submitted automatically: ${reason}`);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const setSelectedOption = (questionId, optionIndex) => {
    setSelectedOptionState((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () =>
    currentQuestion < contestToShow.questions.length - 1 &&
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

  if (loading || submitting || loadingUser)
    return <PageLoaderWrapper loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  // Render instructions if contest is upcoming
  if (isContestUpcoming) {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const hourDigits = hours.toString().padStart(2, "0");
    const minuteDigits = minutes.toString().padStart(2, "0");
    const secondDigits = seconds.toString().padStart(2, "0");

    return (
      <div className="min-h-screen flex items-center justify-center pl-64 bg-linear-to-br from-slate-50 to-slate-100">
        <Card
          title={
            <div className="flex items-center gap-2 text-xl font-semibold text-slate-800">
              <i className="fas fa-clock text-indigo-600" />
              {contestToShow.title}
            </div>
          }
          variant="outlined"
          round="md"
          width="full"
          className="max-w-lg w-full bg-white/90 backdrop-blur border border-slate-200 shadow-lg"
          padding="p-6"
          layout="vertical"
        >
          <div className="space-y-6 text-left">
            {/* Instructions */}
            <div className="rounded-xl border border-black bg-slate-100 p-4">
              <p className="mb-3 text-lg font-semibold text-red-500 flex justify-center items-center gap-2">
                <i className="fas fa-exclamation-circle font-ubuntu" />
                Important Instructions
              </p>

              <ul className="space-y-2 text-md font-medium text-red-600">
                <li className="flex gap-2">
                  <span className=" flex justify-center items-center ">1.</span>
                  Each question carries <strong>1 mark</strong>
                </li>
                <li className="flex gap-2">
                  <span className=" flex justify-center items-center ">2.</span>
                  Do not switch tabs or refresh the page, otherwise your contest
                  will be submitted automatically.
                </li>
                <li className="flex gap-2">
                  <span className=" flex justify-center items-center ">3.</span>
                  Contest will start automatically at the scheduled time.
                </li>

                <li className="flex gap-2">
                  <span className=" flex justify-center items-center ">4.</span>
                  If after Countdown Time end and the Contest does not start,
                  please refresh the page.
                </li>
              </ul>
            </div>

            {/* Countdown Timer */}
            <div className="rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 p-5 text-center text-white shadow-md">
              <p className="text-sm opacity-90 mb-3">Contest starts in</p>

              <div className="flex items-center justify-center gap-1 sm:gap-2 font-mono font-bold tracking-wider">
                {/* Hours */}
                <AnimatedDigit value={hourDigits[0]} />
                <AnimatedDigit value={hourDigits[1]} />

                <span className="mx-1 text-3xl sm:text-4xl">:</span>

                {/* Minutes */}
                <AnimatedDigit value={minuteDigits[0]} />
                <AnimatedDigit value={minuteDigits[1]} />

                <span className="mx-1 text-3xl sm:text-4xl">:</span>

                {/* Seconds */}
                <AnimatedDigit value={secondDigits[0]} />
                <AnimatedDigit value={secondDigits[1]} />
              </div>
            </div>

            {/* Footer Hint */}
            <p className="text-md text-center font-bold text-black">
              Please stay on this page. The contest will begin automatically.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Render message if no active contest or contest ended
  if (!contestToShow || hasContestEnded) {
    return (
      <div className="min-h-screen ml-64 flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          {contestToShow ? (
            <>
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <svg
                  className="h-7 w-7 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Content */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {contestToShow.title}
              </h2>
              <p className="text-gray-500 mb-6">
                This contest has ended. Results and leaderboard are available.
              </p>

              {/* Action */}
              <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition">
                View Leaderboard
              </button>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-7 w-7 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17v-2a4 4 0 014-4h4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                  />
                </svg>
              </div>

              {/* Content */}
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Active Contest
              </h2>
              <p className="text-gray-500">
                There is no contest available at the moment. Please check back
                later.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render active contest
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:pl-64">
      {/* Topbar */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-40">
        <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 shrink">
            {contestToShow.title}
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
              {contestToShow.questions.map((q, idx) => (
                <div
                  key={q._id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border text-xs sm:text-sm cursor-pointer transition-all duration-200
                    ${
                      currentQuestion === idx
                        ? "bg-blue-500 border-blue-700 text-white"
                        : selectedOption[q._id] !== undefined
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
            question={contestToShow.questions[currentQuestion]}
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

            {currentQuestion === contestToShow.questions.length - 1 ? (
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
