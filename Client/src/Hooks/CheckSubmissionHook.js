import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const useCheckSubmission = (contestId) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSubmission = useCallback(async () => {
    if (!contestId) {
      setLoading(false);
      return false;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/user/contest-details/check-submission/${contestId}`, {
        withCredentials: true,
      });
      setHasSubmitted(res.data.data.hasSubmitted);
      return res.data.data.hasSubmitted;
    } catch (err) {
      console.error("Failed to check submission:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    checkSubmission();
  }, [checkSubmission]);

  return {
    hasSubmitted,
    loading,
    error,
    checkSubmission,
  };
};

export default useCheckSubmission;