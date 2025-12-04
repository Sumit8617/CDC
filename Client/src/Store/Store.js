import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../lib/UserAuthSlice";
import adminStatsReducer from "../lib/StatsSlice";
import contestDeatilsReducer from "../lib/TestSlice";
import forgotPasswordReducer from "../lib/ForgotPasswordSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminStats: adminStatsReducer,
    contestDetails: contestDeatilsReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export { store };
