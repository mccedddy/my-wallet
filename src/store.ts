import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./reducers/globalSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
  },
});
