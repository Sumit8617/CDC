import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchContest, fetchUsers, fetchAdmins } from "../lib/StatsSlice";

export const useAdminStats = () => {
  const dispatch = useDispatch();

  const { stats, recentContests, userDetails, adminDetails, loading, error } =
    useSelector((state) => state.adminStats);

  // Fetch all stats on mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Wrap dispatch inside the hook
  const fetchAllStats = () => {
    dispatch(fetchContest());
    dispatch(fetchUsers());
    dispatch(fetchAdmins());
  };

  return {
    stats,
    recentContests,
    userDetails,
    adminDetails,
    loading,
    error,
    refresh: fetchAllStats,
  };
};
