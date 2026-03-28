import { useDispatch, useSelector } from "react-redux";
import { submitContactMessage, clearContactState } from "../lib/ContactSlice";
import { useCallback } from "react";

const useContact = () => {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.contact
  );

  const handleSubmitContact = useCallback(
    async (formData) => {
      try {
        const result = await dispatch(submitContactMessage(formData)).unwrap();
        return result;
      } catch (err) {
        console.error("Contact submission failed:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const clearState = useCallback(() => {
    dispatch(clearContactState());
  }, [dispatch]);

  return {
    handleSubmitContact,
    clearState,
    loading,
    error,
    success,
    message,
  };
};

export default useContact;
