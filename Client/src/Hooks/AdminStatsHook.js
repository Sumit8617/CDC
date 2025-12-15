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

  // Dispatch all thunks
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
    loading, // now separate flags: loading.users, loading.contest, loading.admins
    error, // separate flags: error.users, error.contest, error.admins
    refresh: fetchAllStats,
  };
};
