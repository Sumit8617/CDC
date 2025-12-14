import { useDispatch, useSelector } from "react-redux";
import { submitContest, resetSubmissionState } from "../lib/SubmitContestSlice";

const useContestSubmission = () => {
  const dispatch = useDispatch();

  const { submission, contest, loading, success, error } = useSelector(
    (state) => state.submitContest
  );

  const submit = ({ questions, contest, user }) => {
    return dispatch(
      submitContest({
        questions,
        contest,
        user,
      })
    );
  };

  const reset = () => {
    dispatch(resetSubmissionState());
  };

  return {
    submission,
    contest,
    loading,
    success,
    error,
    submit,
    reset,
  };
};

export default useContestSubmission;
