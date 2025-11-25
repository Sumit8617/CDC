import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../lib/UserAuthSlice";
import adminStatsReducer from "../lib/StatsSlice";
import contestDeatilsReducer from "../lib/TestSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminStats: adminStatsReducer,
    contestDetails: contestDeatilsReducer,
  },
});

export { store };
