import { createSlice } from "@reduxjs/toolkit";
import { log } from "console";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    email: "",
    username: "", 
  },
  reducers: {
    logIn: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    logOut: (state) => {
      state.id = "";
      state.email = "";
      state.username = "";
    },
  },
});

// Export the actions
export const { logIn, logOut } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
