import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../lib/UserAuthSlice";
import adminStatsReducer from "../lib/StatsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminStats: adminStatsReducer,
  },
});

export { store };
