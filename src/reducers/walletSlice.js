import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallets",
  initialState: {
    value: null,
  },
  reducers: {
    setWallets: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setWallets } = walletSlice.actions;
export default walletSlice.reducer;
