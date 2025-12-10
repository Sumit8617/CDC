import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyAdminInvite,
  resetVerifyState,
} from "../../lib/Admin/VerifyAdminSlice";

const useAdminInvite = () => {
  const dispatch = useDispatch();

  const { loading, error, data } = useSelector((state) => state.verifyAdmin);

  // Function to send invite
  const sendInvite = useCallback(
    (fullName, email) => {
      dispatch(verifyAdminInvite({ fullName, email }));
    },
    [dispatch]
  );

  // Function to reset state
  const resetState = useCallback(() => {
    dispatch(resetVerifyState());
  }, [dispatch]);

  // Function to verify token and return the result
  const verifyToken = useCallback(
    async (token) => {
      try {
        const action = await dispatch(verifyAdminInvite(token));
        if (verifyAdminInvite.fulfilled.match(action)) {
          return action.payload; // this will contain { fullName, email }
        }
        throw new Error(action.payload || "Verification failed");
      } catch (err) {
        throw err;
      }
    },
    [dispatch]
  );

  return {
    inviteLoading: loading,
    inviteError: error,
    inviteSuccess: null,
    inviteLink: data,
    sendInvite,
    resetState,
    verifyToken, // now available
  };
};

export default useAdminInvite;
