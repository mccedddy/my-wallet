import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import walletReducer from "./reducers/walletSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    wallets: walletReducer,
  },
});
