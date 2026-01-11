import React, { useState, useEffect } from "react";
import {
  Button,
  PageLoaderWrapper,
  Card,
  CountdownTimer,
} from "../../Components/index";
import useUpcomingContests from "../../Hooks/UpcomingContestHook";
import useContestSubmission from "../../Hooks/SubmitContestHook";
import useSignup from "../../Hooks/AuthHooks";
import { useNavigate } from "react-router-dom";
import { Info, Clock } from "lucide-react";

// Helper to parse backend IST string as local date
const parseISTDate = (istString) => {
  const [datePart, timePart] = istString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((v) => Number(v.replace("Z", "")));

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const Contest = () => {
  const { contests, loading, error } = useUpcomingContests();
  const { submit, loading: submitting } = useContestSubmission();
  const { user, handleFetchUserDetails, loadingUser } = useSignup();

  const [selectedOption, setSelectedOption] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [fullscreenAllowed, setFullscreenAllowed] = useState(false);
  const [forceStart, setForceStart] = useState(false);
  const [contestAlreadySubmitted, setContestAlreadySubmitted] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [contestStarted, setContestStarted] = useState(false);
  const [ignoreFullscreenAlert, setIgnoreFullscreenAlert] = useState(false);
  const [lastContestEnded, setLastContestEnded] = useState(null);

  const navigate = useNavigate();

  // Questions Card Component
  const QuestionCard = ({ question, selectedOption, setSelectedOption }) => (
    <div
      className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full border-2 border-gray-200"
      style={{
        pointerEvents: contestStarted ? "auto" : "none",
      }}
    >
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        {question?.questionText}
      </h3>
      <div className="flex flex-col gap-3">
        {question?.options.map((option, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() =>
              setSelectedOption((prev) => ({ ...prev, [question._id]: idx }))
            }
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

  // Format time in H:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentQuestion < contestToShow.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // Handle manual submit
  const handleSubmit = async () => {
    setIgnoreFullscreenAlert(true);
    await finishContest("Manual submission");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Auto-remove contestEnded after 1 day
  useEffect(() => {
    const ended = localStorage.getItem("contestEnded");
    if (ended) {
      const { time } = JSON.parse(ended);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000; // 1 day
      if (now - time > oneDay) {
        localStorage.removeItem("contestEnded");
      }
    }
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user if not available
  useEffect(() => {
    if (!user) handleFetchUserDetails();
  }, [user, handleFetchUserDetails]);

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

  const INSTRUCTION_BEFORE_MS = 5 * 60 * 60 * 1000;

  const isContestUpcoming =
    contestToShow &&
    currentTime >= contestStart - INSTRUCTION_BEFORE_MS &&
    currentTime < contestStart;

  const isContestOngoing =
    contestToShow &&
    (forceStart || (currentTime >= contestStart && currentTime <= contestEnd));

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
    setContestAlreadySubmitted(true);

    localStorage.setItem(
      "contestEnded",
      JSON.stringify({ time: Date.now(), contestId: contestToShow._id })
    );

    if (!user) return;

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

  // Check if this contest was already submitted
  useEffect(() => {
    if (!contestToShow) return;

    const ended = localStorage.getItem("contestEnded");
    if (ended) {
      const parsed = JSON.parse(ended);

      // Auto-remove if 1 day passed
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - parsed.time > oneDay) {
        localStorage.removeItem("contestEnded");
        setFinished(false);
        setContestAlreadySubmitted(false);
      } else if (parsed.contestId === contestToShow._id) {
        setFinished(true);
        setContestAlreadySubmitted(true);
      }
    }
  }, [contestToShow]);

  // Fullscreen exit handling
  useEffect(() => {
    if (!contestStarted) return;

    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !ignoreFullscreenAlert) {
        const confirmExit = window.confirm(
          "Exiting fullscreen will submit your contest automatically. Continue?"
        );
        if (!confirmExit) {
          document.documentElement.requestFullscreen();
        } else {
          finishContest("Exited fullscreen");
        }
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [contestStarted, ignoreFullscreenAlert]);

  // TODO: Block copy/devtools
  useEffect(() => {
    if (!contestStarted) return;

    const block = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    const prevent = (e) => e.preventDefault();

    document.addEventListener("keydown", block);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);

    return () => {
      document.removeEventListener("keydown", block);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, []);

  // Trigger fullscreen modal when contest is about to start
  useEffect(() => {
    if (!contestToShow) return;

    // Check localStorage directly
    const ended = localStorage.getItem("contestEnded");
    const contestSubmitted =
      ended && JSON.parse(ended).contestId === contestToShow._id;

    // Do not show modal if contest already submitted or finished
    if (contestSubmitted || finished || contestAlreadySubmitted) return;

    if (!contestStarted && !showFullscreenModal && isContestOngoing) {
      setShowFullscreenModal(true);
    }
  }, [
    currentTime,
    contestToShow,
    contestStarted,
    showFullscreenModal,
    isContestOngoing,
    contestAlreadySubmitted,
    finished,
  ]);

  // Handle fullscreen start
  const handleStartContest = async () => {
    // Show an alert if already submitted
    if (contestAlreadySubmitted) {
      alert("You have already submitted this contest.");
      return;
    }
    try {
      await document.documentElement.requestFullscreen();
      setFullscreenAllowed(true);
      setContestStarted(true);
      setForceStart(true); // ensures questions render immediately
      setShowFullscreenModal(false);
      setIgnoreFullscreenAlert(false); // reset ignore flag
    } catch (err) {
      alert("Please allow fullscreen to start the contest.");
    }
  };

  // Page loading and error handling
  if (loading || submitting || loadingUser)
    return <PageLoaderWrapper loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <title>CDC JGEC | Contest</title>
      <meta
        name="description"
        content="This is the Contest page of the CDC JGEC"
      />
      {/* FULLSCREEN MODAL */}
      {showFullscreenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          style={{ pointerEvents: showFullscreenModal ? "auto" : "none" }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-bold">Fullscreen Required</h2>
            <p className="text-sm text-gray-600">
              You must stay in fullscreen. Exiting will auto-submit.
            </p>

            <Button className="w-full" onClick={handleStartContest}>
              Enter Fullscreen & Start
            </Button>
          </div>
        </div>
      )}

      {/* UPCOMING CONTEST */}
      {isContestUpcoming && (
        <div className="min-h-screen flex items-center justify-center pl-64 bg-linear-to-br from-slate-50 to-slate-100">
          <Card
            variant="outlined"
            round="lg"
            padding="p-6"
            className="max-w-lg w-full"
          >
            <div className="space-y-6 w-full">
              {/* Countdown Card */}
              <Card
                variant="gradient"
                round="lg"
                padding="p-6"
                className="w-full"
                title="Contest Starts In"
              >
                <CountdownTimer targetTime={contestStart} />
              </Card>

              {/* Guidelines Card */}
              <Card
                variant="default"
                round="lg"
                padding="p-5"
                className="w-full"
                title="Contest Guidelines"
                icon={<Info />}
                layout="vertical"
              >
                <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside text-left">
                  <li>
                    The contest will start automatically once the countdown
                    ends.
                  </li>
                  <li>Ensure a stable internet connection before starting.</li>
                  <li>Each participant can attempt the contest only once.</li>
                  <li>
                    Any form of malpractice or unfair means will lead to
                    disqualification.
                  </li>
                  <li>
                    Rankings are based on total score. In case of a tie, time
                    taken will be considered.
                  </li>
                  <li>
                    Results will be published on the leaderboard after
                    evaluation.
                  </li>
                </ul>
              </Card>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-500">
                Please read all guidelines carefully before the contest begins.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* CONTEST ENDED CARD */}
      {(finished ||
        hasContestEnded ||
        (!contestToShow && contests.length === 0)) && (
        <div className="min-h-screen ml-64 flex items-center justify-center bg-gray-50 px-4">
          {console.log("Rendering contest ended card")}

          <Card
            variant="default"
            round="lg"
            padding="p-8"
            className="max-w-md w-full"
            title={contestToShow?.title || lastContestEnded?.title || "Contest"}
            icon={
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <Clock className="h-7 w-7 text-indigo-600" />
              </div>
            }
            footer={
              <Button
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition w-full"
                onClick={() => navigate("/leaderboard")}
              >
                View Leaderboard
              </Button>
            }
          >
            <p className="text-gray-500 text-sm">
              {finished || hasContestEnded
                ? "You have successfully submitted the contest. Results will be available soon."
                : "This contest has ended. Results and leaderboard are available."}
            </p>
          </Card>
        </div>
      )}

      {/* ACTIVE CONTEST */}
      {contestToShow && !hasContestEnded && !isContestUpcoming && (
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
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={contestAlreadySubmitted}
                  >
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
      )}
    </>
  );
};

export default Contest;
