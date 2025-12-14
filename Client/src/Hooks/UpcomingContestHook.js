import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUpcomingContests,
  resetUpcomingContests,
} from "../lib/UpcomingContestSlice";

const useUpcomingContests = () => {
  const dispatch = useDispatch();

  const { contests, loading, error } = useSelector(
    (state) => state.upcomingContest
  );

  // Fetch contests on mount
  useEffect(() => {
    dispatch(fetchUpcomingContests());

    return () => {
      dispatch(resetUpcomingContests());
    };
  }, [dispatch]);

  return {
    contests,
    loading,
    error,
    refreshContests: () => dispatch(fetchUpcomingContests()), // manual refresh
  };
};

export default useUpcomingContests;
