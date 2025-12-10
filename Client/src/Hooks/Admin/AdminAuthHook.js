import { useDispatch, useSelector } from "react-redux";
import { adminInvite, resetInviteState } from "../../lib/Admin/AdminSlice";

export const useAdminInvite = () => {
  const dispatch = useDispatch();

  const { inviteLoading, inviteError, inviteSuccess, inviteLink } = useSelector(
    (state) => state.adminInvite
  );

  const sendAdminInvite = (fullName, email) => {
    dispatch(adminInvite({ fullName, email }));
  };

  return {
    sendAdminInvite,
    inviteLoading,
    inviteError,
    inviteSuccess,
    inviteLink,
    resetInviteState: () => dispatch(resetInviteState()),
  };
};
