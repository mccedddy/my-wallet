import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null,
    name: "",
    email: "",
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setUserName, setUserEmail, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
