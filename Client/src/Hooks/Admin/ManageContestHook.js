import { useDispatch, useSelector } from "react-redux";
import {
  getContests,
  updateContest,
  deleteContest,
} from "../../lib/Admin/ManageContestSlice";

const useContests = () => {
  const dispatch = useDispatch();

  const contests = useSelector((state) => state.manageContest.contests);
  const totalContests = useSelector(
    (state) => state.manageContest.totalContests
  );
  const loading = useSelector((state) => state.manageContest.loading);
  const error = useSelector((state) => state.manageContest.error);

  // Actions
  const fetchContests = () => dispatch(getContests());
  const modifyContest = (contestId, updatedData) =>
    dispatch(updateContest({ contestId, updatedData }));
  const removeContest = (contestId) => dispatch(deleteContest(contestId));

  return {
    contests,
    totalContests,
    loading,
    error,
    fetchContests,
    modifyContest,
    removeContest,
  };
};

export default useContests;
