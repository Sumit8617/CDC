import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContest, fetchUsers, fetchAdmins } from "../lib/StatsSlice";

export const useAdminStats = () => {
  const dispatch = useDispatch();

  const { stats, recentContests, userDetails, adminDetails, loading, error } =
    useSelector((state) => state.adminStats);

  // Compute overall loading state - checking if ANY request is still loading
  const isLoading = loading.contest || loading.users || loading.admins;

  // Compute overall error state - return first error found
  const overallError = error.contest || error.users || error.admins;

  // Fetch all stats on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Dispatch all thunks - now returns a promise for proper awaiting
  const fetchAllStats = () => {
    return Promise.all([
      dispatch(fetchContest()),
      dispatch(fetchUsers()),
      dispatch(fetchAdmins()),
    ]);
  };

  return {
    stats,
    recentContests,
    userDetails,
    adminDetails,
    loading: isLoading, // Return computed boolean instead of object
    error: overallError, // Return first error instead of object
    refresh: fetchAllStats,
  };
};
