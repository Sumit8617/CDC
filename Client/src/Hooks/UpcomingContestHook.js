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

  useEffect(() => {
    dispatch(fetchUpcomingContests());
  }, [dispatch]);

  return {
    contests,
    loading,
    error,
    refreshContests: () => dispatch(fetchUpcomingContests()),
  };
};

export default useUpcomingContests;
