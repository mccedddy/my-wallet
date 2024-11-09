import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallets: [],
    records: [],
  },
  reducers: {
    setWallets: (state, action) => {
      state.wallets = action.payload;
    },
    setRecords: (state, action) => {
      state.records = action.payload;
    },
  },
});

export const { setWallets, setRecords } = walletSlice.actions;
export default walletSlice.reducer;
