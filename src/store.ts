import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./reducers/globalSlice";
import userReducer from "./reducers/userSlice";
import walletsReducer from "./reducers/walletsSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    wallets: walletsReducer
  },
});
