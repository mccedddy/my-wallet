import { createSlice } from "@reduxjs/toolkit";

const walletsSlice = createSlice({
  name: "wallets",
  initialState: {
    wallets: [], // Array of wallet objects
    currentWallet: null, //  Wallet being edited
  },
  reducers: {
    setWallets: (state, action) => {
      state.wallets = action.payload;
    },
    // Set the wallet being edited
    setCurrentWallet: (state, action) => {
      state.currentWallet = action.payload; 
    },
  },
});

export const { setWallets, setCurrentWallet } = walletsSlice.actions;

export default walletsSlice.reducer;