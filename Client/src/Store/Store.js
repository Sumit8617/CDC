import { configureStore } from "@reduxjs/toolkit";
import  authReducer from "../lib/UserAuthSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export { store };
