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

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const methods = useForm({ defaultValues: { search: "" } });

  const { leaderboard, loading, error, getLeaderboard } = useLeaderboard();

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(0);

  // Set your contest result publish time here
  const publishDate = new Date("").getTime();

  useEffect(() => {
    getLeaderboard();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((publishDate - now) / 1000));
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [getLeaderboard, publishDate]);

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

  const filteredUsers =
    leaderboard?.filter((user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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

  if (!loading && leaderboard?.length === 0) {
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

          {/* Countdown to publish */}
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
            Time left until leaderboard is published
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:pl-64">
      {/* Header */}
      <div className="fixed top-0 left-0 md:left-64 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Leaderboard
          </h1>

          {/* Optional countdown for active leaderboard */}
          {/* {timeLeft > 0 && (
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
          )} */}
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
                {filteredUsers.map((user, index) => (
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
                        {user.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
