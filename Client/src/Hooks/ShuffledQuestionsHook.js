import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShuffledQuestions,
  resetShuffledQuestions,
} from "../lib/ContestSlice";

const useShuffledQuestions = (contestId) => {
  const dispatch = useDispatch();
  const { shuffledQuestions, loading, error } = useSelector(
    (state) => state.contest
  );

  useEffect(() => {
    if (contestId) {
      dispatch(fetchShuffledQuestions(contestId));
    }

    return () => {
      dispatch(resetShuffledQuestions());
    };
  }, [contestId, dispatch]);

  return {
    questions: shuffledQuestions?.questions || [],
    contestId: shuffledQuestions?.contestId,
    contestName: shuffledQuestions?.contestName,
    duration: shuffledQuestions?.duration,
    totalQuestions: shuffledQuestions?.totalQuestions,
    shuffledAt: shuffledQuestions?.shuffledAt,
    loading,
    error,
    refreshQuestions: () => {
      if (contestId) {
        dispatch(fetchShuffledQuestions(contestId));
      }
    },
  };
};

export default useShuffledQuestions;
