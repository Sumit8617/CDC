// src/hooks/useCreateContest.js
import { useDispatch, useSelector } from "react-redux";
import {
  createContest,
  saveDraftContest,
  resetContestState,
} from "../../lib/Admin/CreateContestSlice";
import { useCallback } from "react";

const useCreateContest = () => {
  const dispatch = useDispatch();

  // Get state from the slice
  const { contest, draftContest, loading, success, error } = useSelector(
    (state) => state.createContest
  );

  // Function to create/publish contest
  const handleCreateContest = useCallback(
    (contestData) => {
      dispatch(createContest(contestData));
    },
    [dispatch]
  );

  // Function to save contest as draft
  const handleSaveDraftContest = useCallback(
    (contestData) => {
      dispatch(saveDraftContest(contestData));
    },
    [dispatch]
  );

  // Function to reset state
  const handleReset = useCallback(() => {
    dispatch(resetContestState());
  }, [dispatch]);

  return {
    contest,
    draftContest,
    loading,
    success,
    error,
    createContest: handleCreateContest,
    saveDraftContest: handleSaveDraftContest,
    resetContestState: handleReset,
  };
};

export default useCreateContest;
