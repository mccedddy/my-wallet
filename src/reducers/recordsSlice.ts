import { createSlice } from "@reduxjs/toolkit";

const recordsSlice = createSlice({
  name: "records",
  initialState: {
    records: [], // Array of record objects
    currentRecord: null, //  Record being edited
  },
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    // Set the wallet being edited
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload; 
    },
  },
});

export const { setRecords, setCurrentRecord } = recordsSlice.actions;

export default recordsSlice.reducer;