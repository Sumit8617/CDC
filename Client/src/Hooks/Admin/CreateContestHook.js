import { useDispatch, useSelector } from "react-redux";
import {
  createContest,
  saveDraftContest,
  resetContestState,
} from "../../lib/Admin/CreateContestSlice";
import { updateDraft as updateDraftApi, publishDraft as publishDraftApi } from "../../lib/Admin/ManageContestSlice";
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
      return dispatch(createContest(contestData));
    },
    [dispatch]
  );

  // Function to save contest as draft
  const handleSaveDraftContest = useCallback(
    (contestData) => {
      return dispatch(saveDraftContest(contestData));
    },
    [dispatch]
  );

  // Function to update a draft contest
  const handleUpdateDraft = useCallback(
    (contestId, contestData) => {
      return dispatch(updateDraftApi({ contestId, updatedData: contestData }));
    },
    [dispatch]
  );

  // Function to publish a draft contest
  const handlePublishDraft = useCallback(
    (contestId) => {
      return dispatch(publishDraftApi(contestId));
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
    // "published" | "draft" | null — lets callers tell the two apart
    success,
    error,
    isPublished: success === "published",
    isDraftSaved: success === "draft",
    createContest: handleCreateContest,
    saveDraftContest: handleSaveDraftContest,
    updateDraft: handleUpdateDraft,
    publishDraft: handlePublishDraft,
    resetContestState: handleReset,
  };
};

export default useCreateContest;
