import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useUserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/user/dashboard/stats", {
        withCredentials: true,
      });
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(err);
    }
  }, []);

  const fetchPerformance = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/user/dashboard/performance", {
        withCredentials: true,
      });
      setPerformanceData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch performance:", err);
      setError(err);
    }
  }, []);

  const fetchUpcomingContests = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/user/dashboard/upcoming-contests", {
        withCredentials: true,
      });
      setUpcomingContests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch upcoming contests:", err);
      setError(err);
    }
  }, []);

  const fetchRecentHistory = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/user/dashboard/recent-history", {
        withCredentials: true,
      });
      setRecentHistory(res.data.data);
    } catch (err) {
      console.error("Failed to fetch recent history:", err);
      setError(err);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([
      fetchStats(),
      fetchPerformance(),
      fetchUpcomingContests(),
      fetchRecentHistory(),
    ]);
    setLoading(false);
  }, [fetchStats, fetchPerformance, fetchUpcomingContests, fetchRecentHistory]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats,
    performanceData,
    upcomingContests,
    recentHistory,
    loading,
    error,
    refetch: fetchAll,
  };
};

export default useUserDashboard;