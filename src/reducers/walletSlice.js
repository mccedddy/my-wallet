import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallets: [],
    loadingWallets: false,
    records: [],
    loadingRecords: false,
    reRender: false,
  },
  reducers: {
    setWallets: (state, action) => {
      state.wallets = action.payload;
    },
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    setLoadingWallets: (state, action) => {
      state.loadingWallets = action.payload;
    },
    setLoadingRecords: (state, action) => {
      state.loadingRecords = action.payload;
    },
    toggleReRender: (state) => {
      state.reRender = !state.reRender;
    },
  },
});

export const {
  setWallets,
  setRecords,
  setLoadingWallets,
  setLoadingRecords,
  toggleReRender,
} = walletSlice.actions;
export default walletSlice.reducer;
