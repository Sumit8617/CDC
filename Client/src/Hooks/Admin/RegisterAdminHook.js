import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAdmin,
  resetRegisterState,
} from "../../lib/Admin/RegisterAdmin";

const useRegisterAdmin = () => {
  const dispatch = useDispatch();

  const { loading, error, success, adminData } = useSelector(
    (state) => state.registerAdmin
  );

  // Function to trigger registration
  const register = useCallback(
    (token, password, mobileNumber, rollNumber, dob, confirmPassword) => {
      return dispatch(
        registerAdmin({
          token,
          password,
          mobileNumber,
          rollNumber,
          dob,
          confirmPassword,
        })
      );
    },
    [dispatch]
  );

  // Reset slice state
  const resetState = useCallback(() => {
    dispatch(resetRegisterState());
  }, [dispatch]);

  return {
    loading,
    error,
    success,
    adminData,
    register,
    resetState,
  };
};

export default useRegisterAdmin;
