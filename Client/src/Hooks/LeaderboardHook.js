import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { fetchLeaderboard, resetLeaderboard } from "../lib/LeaderBoardSlice";

const useLeaderboard = () => {
  const dispatch = useDispatch();

  // Get state from the slice
  const { contest, leaderboard, loading, error } = useSelector(
    (state) => state.leaderboard
  );

  // Function to fetch the most recent leaderboard
  const getLeaderboard = useCallback(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  // Function to reset leaderboard state
  const clearLeaderboard = useCallback(() => {
    dispatch(resetLeaderboard());
  }, [dispatch]);

  return {
    contest,
    leaderboard,
    loading,
    error,
    getLeaderboard,
    clearLeaderboard,
  };
};

export default useLeaderboard;
