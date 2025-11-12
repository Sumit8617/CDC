import { configureStore } from "@reduxjs/toolkit";
import  authReducer from "../lib/AuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export { store };
