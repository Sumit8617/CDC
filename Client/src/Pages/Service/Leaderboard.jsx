import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Card,
  Button,
  PageLoaderWrapper,
  AnimatedDigit,
} from "../../Components/index";
import { Trophy, Search, Filter } from "lucide-react";
import useLeaderboard from "../../Hooks/LeaderboardHook";
import useUpcomingContests from "../../Hooks/UpcomingContestHook";

const parseISTDate = (istString) => {
  const [datePart, timePart] = istString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((v) => Number(v.replace("Z", "")));
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const methods = useForm({ defaultValues: { search: "" } });

  const { leaderboard, loading, error, getLeaderboard, contest } =
    useLeaderboard();
  const { contests } = useUpcomingContests();

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [contestEndTime, setContestEndTime] = useState(0); // Persisted for countdown after contest ends

  // Find if there's a live contest
  const activeContest = contests.find((c) => {
    const start = parseISTDate(c.startDate).getTime();
    const end = start + c.duration * 60 * 1000;
    return currentTime >= start && currentTime <= end;
  });

  // Also find the most recent contest that has ended (for leaderboard countdown)
  // This persists the end time even after the contest window passes
  const endedContest = contests.find((c) => {
    if (activeContest && c._id === activeContest._id) return false; // skip if same as active
    const start = parseISTDate(c.startDate).getTime();
    const end = start + c.duration * 60 * 1000;
    return currentTime > end; // ended
  });

  // Compute the contest end time: prefer active contest, fallback to most recent ended contest
  const contestToUse = activeContest || endedContest;
  const computedContestEndTime = contestToUse
    ? parseISTDate(contestToUse.startDate).getTime() + contestToUse.duration * 60 * 1000
    : 0;

  // Persist contest end time when we have a valid contest
  useEffect(() => {
    if (computedContestEndTime > 0) {
      setContestEndTime(computedContestEndTime);
    }
  }, [computedContestEndTime]);

  // Calculate leaderboard publish time: contest end + 5 min delay
  const LEADERBOARD_DELAY_SECONDS = 5 * 60;

  // Determine the target time for the countdown
  // If there's a live contest running, countdown shows time until contest ends
  // Otherwise, countdown shows time until leaderboard is published
  // Leaderboard is published at: contestEnd + 5 min delay
  const hasContestEnded = contestEndTime > 0 && currentTime > contestEndTime;
  const leaderboardPublishTime = contestEndTime > 0
    ? contestEndTime + LEADERBOARD_DELAY_SECONDS * 1000
    : 0;

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Start timer if there's a target time to count down to
    if (!leaderboardPublishTime && !contestEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      // Show countdown to contest end if contest is live
      // Show countdown to leaderboard publish if contest has ended
      const diff = activeContest
        ? Math.max(0, Math.floor((contestEndTime - now) / 1000))
        : Math.max(0, Math.floor((leaderboardPublishTime - now) / 1000));
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [leaderboardPublishTime, activeContest, contestEndTime]);

  // Convert seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hrs: hrs.toString().padStart(2, "0"),
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const { hrs, mins, secs } = formatTime(timeLeft);

  const rankedUsers = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  const filteredUsers = rankedUsers.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center bg-yellow-400 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #1
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center bg-gray-400 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #2
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center bg-orange-400 text-white font-bold rounded-md px-3 py-1 text-sm">
            <Trophy className="w-4 h-4 mr-1" /> #3
          </div>
        );
      default:
        return (
          <div className="font-semibold text-gray-700 text-sm">#{rank}</div>
        );
    }
  };

  if (loading) {
    return <PageLoaderWrapper loading={loading} />;
  }

  if (!loading && activeContest && !contest) {
    return (
      <div className="min-h-screen bg-gray-50 md:pl-64 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Trophy className="mx-auto mb-3 w-10 h-10 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">
            Contest in Progress
          </h2>
          <p className="text-gray-500 mt-2">
            The leaderboard will be available once the contest ends.
          </p>

          <div className="mt-4 flex justify-center items-center gap-2 text-xl font-mono font-bold">
            <AnimatedDigit value={hrs[0]} />
            <AnimatedDigit value={hrs[1]} />
            <span>:</span>
            <AnimatedDigit value={mins[0]} />
            <AnimatedDigit value={mins[1]} />
            <span>:</span>
            <AnimatedDigit value={secs[0]} />
            <AnimatedDigit value={secs[1]} />
          </div>
          <p className="mt-2 text-gray-500">
            Time left until contest ends
          </p>
        </div>
      </div>
    );
  }

  if (!loading && !contest) {
    return (
      <div className="min-h-screen bg-gray-50 md:pl-64 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Trophy className="mx-auto mb-3 w-10 h-10 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">
            Leaderboard Not Available
          </h2>
          <p className="text-gray-500 mt-2">
            The leaderboard will appear once the contest results are published.
          </p>

          {timeLeft > 0 && (
            <div className="mt-4 flex justify-center items-center gap-2 text-xl font-mono font-bold">
              <AnimatedDigit value={hrs[0]} />
              <AnimatedDigit value={hrs[1]} />
              <span>:</span>
              <AnimatedDigit value={mins[0]} />
              <AnimatedDigit value={mins[1]} />
              <span>:</span>
              <AnimatedDigit value={secs[0]} />
              <AnimatedDigit value={secs[1]} />
            </div>
          )}
          {timeLeft > 0 && (
            <p className="mt-2 text-gray-500">
              Time left until leaderboard is published
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <title>CDC JGEC | Leaderboard</title>
      <meta
        name="Leaderboard"
        content="This is the leaderboard page of the CDC JGEC Site."
      />

      <div className="min-h-screen bg-gray-50 md:pl-64">
        {/* Header */}
        <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
          <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                {activeContest ? "Contest Live" : "Leaderboard"}
              </h1>
              {activeContest && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  Ends in
                </span>
              )}
            </div>

            {/* Countdown for active contest or publish countdown */}
            {timeLeft > 0 && (
              <div className="flex items-center gap-1 font-mono font-bold text-red-600">
                <AnimatedDigit value={hrs[0]} />
                <AnimatedDigit value={hrs[1]} />
                <span>:</span>
                <AnimatedDigit value={mins[0]} />
                <AnimatedDigit value={mins[1]} />
                <span>:</span>
                <AnimatedDigit value={secs[0]} />
                <AnimatedDigit value={secs[1]} />
              </div>
            )}
          </div>
        </div>

        <div className="pt-24 px-4 sm:px-6 md:px-8 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={"outline"} round="full" size="sm">
              College Ranking
            </Button>
          </div>

          {/* Search + Filter */}
          <FormProvider {...methods}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                College Ranking
              </h2>

              <div className="flex items-center w-full gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or college..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-500 text-amber-500 rounded-lg hover:bg-amber-50 transition-all duration-200">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter</span>
                </button>
              </div>
            </div>
          </FormProvider>

          {/* Leaderboard Table */}
          <Card variant="outlined" round="lg" className="overflow-x-auto">
            {loading && (
              <p className="p-4 text-gray-500">Loading leaderboard...</p>
            )}
            {error && <p className="p-4 text-red-500">{error}</p>}
            {!loading && !error && (
              <table className="min-w-full table-fixed text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
                    <th className="px-4 py-3 w-1/3 text-left">Rank</th>
                    <th className="px-4 py-3 w-1/3 text-center">Name</th>
                    <th className="px-4 py-3 w-1/3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="py-5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                        No leaderboard data available. Contest may not have participants yet.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id || index}
                        className="border-b hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-4 py-3 text-left">
                          {getRankBadge(index + 1)}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 text-center">
                          {user.fullName}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="bg-indigo-600 text-white font-semibold text-xs px-3 py-1 rounded-full">
                            {user.percentage !== undefined ? `${user.percentage}%` : user.score}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
