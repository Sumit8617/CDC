import { useDispatch, useSelector } from "react-redux";
import {
  fetchContestDetails,
  previousContestQuestions as fetchPreviousQuestions,
} from "../lib/TestSlice";

export const useContestDetails = () => {
  const dispatch = useDispatch();
  const {
    contests = [],
    questions = [],
    errors,
    loading,
  } = useSelector((state) => state.contestDetails);

  // Fetch all contests
  const getContests = () => {
    dispatch(fetchContestDetails());
  };

  // Fetch questions for a specific contestId
  const getPreviousQuestions = (contestId) => {
    if (!contestId) return;
    return dispatch(fetchPreviousQuestions(contestId));
  };

  return {
    contests,
    questions,
    loading,
    error: errors || null,
    getContests,
    getPreviousQuestions,
  };
};
