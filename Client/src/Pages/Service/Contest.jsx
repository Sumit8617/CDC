import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  PageLoaderWrapper,
  Card,
  CountdownTimer,
} from "../../Components/index";
import useUpcomingContests from "../../Hooks/UpcomingContestHook";
import useContestSubmission from "../../Hooks/SubmitContestHook";
import useSignup from "../../Hooks/AuthHooks";
import useCheckSubmission from "../../Hooks/CheckSubmissionHook";
import { useNavigate } from "react-router-dom";
import { Info, Clock, AlertTriangle, Camera } from "lucide-react";

const parseISTDate = (istString) => {
  const [datePart, timePart] = istString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((v) => Number(v.replace("Z", "")));
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const MAX_FACE_VIOLATIONS = 3000;

const Contest = () => {
  const { contests, loading, error, refreshContests } = useUpcomingContests();
  const { submit, loading: submitting } = useContestSubmission();
  const { user, handleFetchUserDetails, loadingUser } = useSignup();
  const navigate = useNavigate();

  const [contestIdToCheck, setContestIdToCheck] = useState(null);
  const {
    hasSubmitted: userHasSubmitted,
    loading: checkingSubmission,
    checkSubmission,
  } = useCheckSubmission(contestIdToCheck);

  const [selectedOption, setSelectedOption] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [contestAlreadySubmitted, setContestAlreadySubmitted] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [contestStarted, setContestStarted] = useState(false);
  const [frozenContest, setFrozenContest] = useState(null);
  const frozenContestRef = useRef(null);
  const [faceDetectorReady, setFaceDetectorReady] = useState(false);
  const [faceWarning, setFaceWarning] = useState(null);
  const [faceViolationCount, setFaceViolationCount] = useState(0);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [showEscWarning, setShowEscWarning] = useState(false);

  // Refs
  const faceDetectorRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const escWarningTimerRef = useRef(null);

  const finishedRef = useRef(false);
  const selectedOptionRef = useRef({});
  const contestToShowRef = useRef(null);
  const userRef = useRef(null);
  const ignoreFullscreenRef = useRef(true);
  const contestDataRef = useRef(null);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  useEffect(() => {
    selectedOptionRef.current = selectedOption;
  }, [selectedOption]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ── Contest timing ────────────────────────────────────────────────────────
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
  contestToShowRef.current = contestToShow;
  if (contestToShow) {
    contestDataRef.current = contestToShow;
  }

  const contestStart = contestToShow
    ? parseISTDate(contestToShow.startDate).getTime()
    : 0;
  const contestEnd = contestToShow
    ? contestStart + contestToShow.duration * 60 * 1000
    : frozenContest
      ? parseISTDate(frozenContest.startDate).getTime() +
        frozenContest.duration * 60 * 1000
      : 0;

  const INSTRUCTION_BEFORE_MS = 5 * 60 * 60 * 1000;

  const isContestUpcoming =
    !contestStarted &&
    !!contestToShow &&
    currentTime >= contestStart - INSTRUCTION_BEFORE_MS &&
    currentTime < contestStart;

  const isContestOngoing =
    !!contestToShow &&
    (contestStarted ||
      (currentTime >= contestStart && currentTime <= contestEnd));

  const hasContestEnded =
    !contestStarted && !!contestToShow && currentTime > contestEnd;

  // Refresh contests periodically to get updated status and questions
  useEffect(() => {
    if (isContestUpcoming || isContestOngoing) {
      const interval = setInterval(() => {
        refreshContests();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isContestUpcoming, isContestOngoing, refreshContests]);

  useEffect(() => {
    if (contestToShow?._id && !userHasSubmitted) {
      setContestIdToCheck(contestToShow._id);
    }
  }, [contestToShow?._id, userHasSubmitted]);

  // ── Camera stop ───────────────────────────────────────────────────────────
  const stopFaceDetection = useCallback(() => {
    if (faceIntervalRef.current) {
      clearInterval(faceIntervalRef.current);
      faceIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (finished) stopFaceDetection();
  }, [finished, stopFaceDetection]);

  useEffect(() => () => stopFaceDetection(), [stopFaceDetection]);

  // ── finishContest ─────────────────────────────────────────────────────────
  const finishContest = useCallback(
    async (reason) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      ignoreFullscreenRef.current = true;

      setFinished(true);
      setContestAlreadySubmitted(true);
      setShowFullscreenModal(false);
      setShowEscWarning(false);
      if (escWarningTimerRef.current) {
        clearTimeout(escWarningTimerRef.current);
        escWarningTimerRef.current = null;
      }

      const contest =
        frozenContestRef.current || // most reliable
        contestDataRef.current ||
        contestToShowRef.current;

      if (contest) {
        localStorage.setItem(
          "contestEnded",
          JSON.stringify({ time: Date.now(), contestId: contest._id })
        );
      }

      const currentUser = userRef.current;
      if (!currentUser || !contest) return;

      const questionsPayload = Object.entries(selectedOptionRef.current).map(
        ([questionId, option]) => ({
          question: questionId,
          submittedOption: Number(option),
        })
      );

      try {
        await submit({
          contest: contest._id,
          user: currentUser.id,
          questions: questionsPayload,
        });
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
    [submit]
  );

  const handleSubmit = async () => {
    ignoreFullscreenRef.current = true;
    await finishContest("Manual submission");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  // ── Face detection ────────────────────────────────────────────────────────
  const detectFace = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = faceDetectorRef.current;
    if (!detector || !video || !canvas || video.readyState < 2) return;

    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    canvas.getContext("2d").drawImage(video, 0, 0);

    try {
      const count = detector.detect(canvas)?.detections?.length ?? 0;
      if (count === 0) {
        setFaceWarning("No face detected — please stay in frame.");
        setFaceViolationCount((prev) => {
          const next = prev + 1;
          if (next >= MAX_FACE_VIOLATIONS)
            finishContest("Auto-submitted: no face detected.");
          return next;
        });
      } else if (count > 1) {
        setFaceWarning("Multiple faces detected — only you should be visible.");
        setFaceViolationCount((prev) => {
          const next = prev + 1;
          if (next >= MAX_FACE_VIOLATIONS)
            finishContest("Auto-submitted: multiple faces.");
          return next;
        });
      } else {
        setFaceWarning(null);
        setFaceViolationCount(0);
      }
    } catch (err) {
      console.warn("Detection error:", err);
    }
  }, [finishContest]);

  const startFaceDetection = useCallback(async () => {
    if (!faceDetectorRef.current || streamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      faceIntervalRef.current = setInterval(detectFace, 3000);
    } catch (err) {
      console.warn("Webcam unavailable:", err);
    }
  }, [detectFace]);

  // ── Load MediaPipe ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import(
          /* webpackIgnore: true */
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs"
        );
        if (cancelled) return;
        const vision = await mod.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        if (cancelled) return;
        const detector = await mod.FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          minDetectionConfidence: 0.5,
        });
        if (cancelled) return;
        faceDetectorRef.current = detector;
        setFaceDetectorReady(true);
      } catch (err) {
        console.warn("MediaPipe load failed (non-fatal):", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (contestStarted && faceDetectorReady) startFaceDetection();
  }, [contestStarted, faceDetectorReady, startFaceDetection]);

  // ── General effects ───────────────────────────────────────────────────────
  useEffect(() => {
    const ended = localStorage.getItem("contestEnded");
    if (ended) {
      const { time } = JSON.parse(ended);
      if (Date.now() - time > 86400000) localStorage.removeItem("contestEnded");
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) handleFetchUserDetails();
  }, [user, handleFetchUserDetails]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!contestStarted || contestEnd === 0) return;

    setTimeLeft(Math.max(0, Math.floor((contestEnd - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((contestEnd - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) {
        finishContest("Time up");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contestStarted, contestEnd, finishContest]);

  // Upcoming countdown
  useEffect(() => {
    if (!isContestUpcoming || contestStart === 0) return;
    setTimeLeft(Math.max(0, Math.floor((contestStart - Date.now()) / 1000)));
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((contestStart - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContestUpcoming, contestStart]);

  // Check already submitted from localStorage
  useEffect(() => {
    if (!contestToShow) return;
    const ended = localStorage.getItem("contestEnded");
    if (!ended) return;
    const parsed = JSON.parse(ended);
    if (Date.now() - parsed.time > 86400000) {
      localStorage.removeItem("contestEnded");
    } else if (parsed.contestId === contestToShow._id) {
      finishedRef.current = true;
      setFinished(true);
      setContestAlreadySubmitted(true);
    }
  }, [contestToShow]);

  // Show fullscreen modal when contest goes live
  useEffect(() => {
    if (!contestToShow || contestAlreadySubmitted || finished || contestStarted)
      return;
    if (isContestOngoing && !showFullscreenModal) setShowFullscreenModal(true);
  }, [
    isContestOngoing,
    contestStarted,
    contestToShow,
    contestAlreadySubmitted,
    finished,
    showFullscreenModal,
  ]);

  // ── ESC key → show warning + 10 s auto-submit timer ──────────────────────
  useEffect(() => {
    if (!contestStarted) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !finishedRef.current) {
        setShowEscWarning(true);
        if (escWarningTimerRef.current)
          clearTimeout(escWarningTimerRef.current);
        escWarningTimerRef.current = setTimeout(() => {
          finishContest("Auto-submitted: ESC pressed and warning ignored.");
        }, 10000);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [contestStarted, finishContest]);

  // ── Fullscreen exit handler ───────────────────────────────────────────────
  useEffect(() => {
    if (!contestStarted) return;
    const onFSChange = () => {
      if (ignoreFullscreenRef.current) return;
      if (!document.fullscreenElement && !finishedRef.current) {
        setShowEscWarning(true);
        if (escWarningTimerRef.current)
          clearTimeout(escWarningTimerRef.current);
        escWarningTimerRef.current = setTimeout(() => {
          finishContest(
            "Auto-submitted: exited fullscreen and warning ignored."
          );
        }, 10000);
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, [contestStarted, finishContest]);

  // ── Tab switch → auto-submit immediately ─────────────────────────────────
  useEffect(() => {
    if (!contestStarted) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !finishedRef.current) {
        finishContest("Auto-submitted: switched tabs or minimised window.");
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [contestStarted, finishContest]);

  // ── Block devtools / copy ─────────────────────────────────────────────────
  useEffect(() => {
    if (!contestStarted) return;
    const block = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      )
        e.preventDefault();
    };
    const prevent = (e) => e.preventDefault();
    document.addEventListener("keydown", block);
    ["contextmenu", "copy", "paste", "cut"].forEach((ev) =>
      document.addEventListener(ev, prevent)
    );
    return () => {
      document.removeEventListener("keydown", block);
      ["contextmenu", "copy", "paste", "cut"].forEach((ev) =>
        document.removeEventListener(ev, prevent)
      );
    };
  }, [contestStarted]);

  // ── Enter fullscreen & start ──────────────────────────────────────────────
  const handleStartContest = async () => {
    if (contestAlreadySubmitted || finished) return;
    if (userHasSubmitted) return;

    const contestSnapshot = contestToShow || contestDataRef.current;
    if (!contestSnapshot) return;

    if (!contestSnapshot.questions || contestSnapshot.questions.length === 0) {
      await refreshContests();
      const updatedContest = contests.find(
        (c) => c._id === contestSnapshot._id
      );
      if (updatedContest?.questions?.length > 0) {
        contestSnapshot.questions = updatedContest.questions;
      }
    }

    console.log("Contest snapshot:", JSON.stringify(contestSnapshot, null, 2));
    console.log("Questions:", contestSnapshot?.questions);
    console.log("First question:", contestSnapshot?.questions?.[0]);

    // Check if questions exist before starting
    if (!contestSnapshot.questions || contestSnapshot.questions.length === 0) {
      alert("Questions not loaded yet. Please wait and try again.");
      return;
    }

    // ✅ Set ref synchronously BEFORE any await or setState
    contestDataRef.current = contestSnapshot;
    frozenContestRef.current = contestSnapshot; // synchronous
    setFrozenContest(contestSnapshot); // triggers re-render

    // Wait for state to update before entering fullscreen
    await new Promise((resolve) => setTimeout(resolve, 100));

    setContestStarted(true);
    setShowFullscreenModal(false);

    ignoreFullscreenRef.current = true;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      alert("Please allow fullscreen to start the contest.");
      ignoreFullscreenRef.current = false;
      return;
    }
    setTimeout(() => {
      ignoreFullscreenRef.current = false;
    }, 300);
  };

  const handleNext = () => {
    const contest = frozenContest || frozenContestRef.current;
    if (contest && currentQuestion < contest.questions.length - 1)
      setCurrentQuestion((p) => p + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const QuestionCard = ({ question }) => (
    <div className="bg-white mt-5 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 w-full border-2 border-gray-200">
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

  if (loading || submitting || loadingUser || checkingSubmission)
    return <PageLoaderWrapper loading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <title>CDC JGEC | Contest</title>
      <meta
        name="description"
        content="This is the Contest page of the CDC JGEC"
      />

      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />

      {/* ── Camera preview ────────────────────────────────────────────────── */}
      <div
        className="fixed z-50 transition-all duration-300"
        style={{
          visibility: contestStarted && !finished ? "visible" : "hidden",
          opacity: contestStarted && !finished ? 1 : 0,
          pointerEvents: contestStarted && !finished ? "auto" : "none",
          ...(cameraMinimized
            ? { bottom: 16, right: 16 }
            : { top: 80, right: 16 }),
        }}
      >
        <button
          onClick={() => setCameraMinimized(false)}
          title="Expand camera"
          style={{ display: cameraMinimized ? "flex" : "none" }}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${
            faceWarning ? "bg-red-500 animate-pulse" : "bg-green-500"
          }`}
        >
          <Camera className="w-5 h-5 text-white" />
        </button>

        <div
          style={{
            display: cameraMinimized ? "none" : "block",
            width: 280,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: faceWarning ? "#ef4444" : "#22c55e",
            borderRadius: 16,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <div
            className={`flex items-center justify-between px-2.5 py-1.5 text-white text-xs font-medium ${
              faceWarning ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-white ${faceWarning ? "animate-ping" : ""}`}
              />
              {faceWarning ? "Face Issue" : "Proctoring On"}
            </span>
            <button
              onClick={() => setCameraMinimized(true)}
              className="hover:opacity-70 ml-2 text-sm"
              title="Minimise"
            >
              ✕
            </button>
          </div>

          <video
            ref={videoRef}
            className="w-full block"
            style={{
              aspectRatio: "16/9",
              objectFit: "cover",
              transform: "scaleX(-1)",
              marginTop: 6,
              marginBottom: 6,
            }}
            muted
            playsInline
            autoPlay
          />

          {faceWarning && (
            <div className="bg-red-600 text-white text-xs px-2 py-1 text-center">
              <AlertTriangle className="w-3 h-3 inline mr-0.5" />
              {faceWarning} ({faceViolationCount}/{MAX_FACE_VIOLATIONS})
            </div>
          )}
        </div>
      </div>

      {/* ── ESC / fullscreen-exit warning overlay ────────────────────────── */}
      {showEscWarning && !finished && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-5 shadow-2xl">
            <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">⚠️ Warning!</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              You pressed{" "}
              <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono">
                ESC
              </kbd>{" "}
              or exited fullscreen. If you do not return within{" "}
              <strong>10 seconds</strong>, your contest will be auto-submitted.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  setShowEscWarning(false);
                  if (escWarningTimerRef.current) {
                    clearTimeout(escWarningTimerRef.current);
                    escWarningTimerRef.current = null;
                  }
                  ignoreFullscreenRef.current = true;
                  document.documentElement.requestFullscreen().catch(() => {});
                  setTimeout(() => {
                    ignoreFullscreenRef.current = false;
                  }, 300);
                }}
              >
                Return to Fullscreen
              </Button>
              <button
                className="text-sm text-red-500 hover:text-red-700 underline transition-colors"
                onClick={() =>
                  finishContest("User chose to submit from ESC warning.")
                }
              >
                Submit &amp; End Contest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face warning banner */}
      {faceWarning && contestStarted && !finished && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {faceWarning}
          <span className="text-red-200 text-xs ml-1">
            {faceViolationCount}/{MAX_FACE_VIOLATIONS}
          </span>
        </div>
      )}

      {/* ── Submitted / ended card ────────────────────────────────────────── */}
      {(finished ||
        hasContestEnded ||
        (!contestStarted &&
          !loading &&
          !contestToShow &&
          contests.length === 0)) && (
        <div className="min-h-screen ml-64 flex items-center justify-center bg-gray-50 px-4">
          <Card
            variant="default"
            round="lg"
            padding="p-8"
            className="max-w-md w-full"
            title={frozenContest?.title || contestToShow?.title || "Contest"}
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
            <p className="text-gray-500 text-sm leading-relaxed">
              {finished
                ? "Your contest has been submitted successfully. Visit the leaderboard to check your results once evaluation is complete."
                : "This contest has ended. Visit the leaderboard to see the results."}
            </p>
          </Card>
        </div>
      )}

      {/* ── Fullscreen modal ──────────────────────────────────────────────── */}
      {showFullscreenModal && !finished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-5 shadow-2xl">
            {userHasSubmitted ? (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Already Submitted
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  You have already submitted this contest. You cannot attempt it
                  again.
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate("/leaderboard")}
                >
                  View Leaderboard
                </Button>
              </>
            ) : (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fullscreen Required
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  You must stay in fullscreen for the entire contest. Exiting
                  will auto-submit your answers. Your camera is used for live
                  proctoring.
                </p>
                <ul className="text-xs text-left text-gray-500 space-y-1.5 bg-gray-50 rounded-lg p-3">
                  <li>📷 Stay visible in the camera at all times</li>
                  <li>👤 Only one face should be visible</li>
                  <li>🔲 Do not exit fullscreen</li>
                  <li>
                    ⚠️ {MAX_FACE_VIOLATIONS} violations trigger auto-submission
                  </li>
                </ul>
                <Button className="w-full" onClick={handleStartContest}>
                  Enter Fullscreen &amp; Start Contest
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Upcoming contest ──────────────────────────────────────────────── */}
      {isContestUpcoming && !finished && (
        <div className="min-h-screen flex items-center justify-center pl-64 bg-linear-to-br from-slate-50 to-slate-100">
          <Card
            variant="outlined"
            round="lg"
            padding="p-6"
            className="max-w-lg w-full"
          >
            <div className="space-y-6 w-full">
              <Card
                variant="gradient"
                round="lg"
                padding="p-6"
                className="w-full"
                title="Contest Starts In"
              >
                <CountdownTimer targetTime={contestStart} />
              </Card>
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
                    The contest starts automatically once the countdown ends.
                  </li>
                  <li>Ensure a stable internet connection before starting.</li>
                  <li>Each participant can attempt the contest only once.</li>
                  <li>
                    Malpractice or unfair means will lead to disqualification.
                  </li>
                  <li>
                    Rankings are score-based; ties are broken by time taken.
                  </li>
                  <li>Your camera will be active for live proctoring.</li>
                  <li>
                    Results will be published on the leaderboard after
                    evaluation.
                  </li>
                </ul>
              </Card>
              <p className="text-xs text-center text-gray-500">
                Please read all guidelines carefully before the contest begins.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* ── Active contest ────────────────────────────────────────────────── */}
      {contestStarted &&
        !finished &&
        (frozenContest || frozenContestRef.current) &&
        (() => {
          const contest = frozenContest || frozenContestRef.current; // ✅ never undefined
          return (
            <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:pl-64">
              {/* Topbar */}
              <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-40">
                <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-6">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate max-w-xs">
                    {contest.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    {faceDetectorReady && (
                      <div
                        className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${faceWarning ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${faceWarning ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                        />
                        {faceWarning ? "Face Issue" : "Proctoring Active"}
                      </div>
                    )}
                    <div className="bg-gray-100 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base text-red-600 shrink-0 tabular-nums">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:px-6 px-3">
                <div
                  className="flex flex-col justify-center items-center"
                  style={{ minHeight: "calc(100vh - 4rem)" }}
                >
                  <div className="w-full max-w-3xl mt-20">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-4">
                      {contest.questions.map((q, idx) => (
                        <button
                          key={q._id}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border text-xs sm:text-sm transition-all duration-200 ${
                            currentQuestion === idx
                              ? "bg-blue-500 border-blue-700 text-white"
                              : selectedOption[q._id] !== undefined
                                ? "bg-green-500 border-green-700 text-white"
                                : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ✅ Guard question access so it's never undefined */}
                  {contest.questions[currentQuestion] && (
                    <QuestionCard
                      question={contest.questions[currentQuestion]}
                    />
                  )}

                  <div className="mt-4 sm:mt-6 flex justify-between w-full gap-2 sm:gap-0 max-w-3xl mb-8">
                    <Button
                      variant="secondary"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    {currentQuestion === contest.questions.length - 1 ? (
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
          );
        })()}

      {/* ── Waiting room ──────────────────────────────────────────────────── */}
      {contestToShow &&
        !hasContestEnded &&
        !isContestUpcoming &&
        !contestStarted &&
        !contestAlreadySubmitted &&
        !showFullscreenModal &&
        !finished && (
          <div className="min-h-screen flex items-center justify-center pl-64 bg-linear-to-br from-slate-50 to-slate-100">
            <div className="text-center space-y-4">
              {checkingSubmission || loading ? (
                <PageLoaderWrapper loading={true} />
              ) : userHasSubmitted ? (
                <Card
                  variant="default"
                  round="lg"
                  padding="p-6"
                  className="max-w-md"
                >
                  <p className="text-gray-600 text-sm mb-4">
                    You have already submitted this contest.
                  </p>
                  <Button onClick={() => navigate("/leaderboard")}>
                    View Leaderboard
                  </Button>
                </Card>
              ) : (
                <>
                  <p className="text-gray-600 text-sm">Contest is live.</p>
                  <Button onClick={() => setShowFullscreenModal(true)}>
                    Enter Contest
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
    </>
  );
};

export default Contest;
