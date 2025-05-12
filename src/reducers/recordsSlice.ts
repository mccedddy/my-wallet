import { createSlice } from "@reduxjs/toolkit";

interface Record {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
  total?: number;
}

const recordsSlice = createSlice({
  name: "records",
  initialState: {
    records: [] as Record[], // Array of record objects
    currentRecord: null as Record | null, // Record being edited
  },
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload; 
    },
    setRecordTotal: (state, action) => {
      const { recordId, amount } = action.payload;
      const record = state.records.find(record => record.id === recordId);
      if (record) {
        if (typeof record.total !== 'number') {
          record.total = 0;
        }
        record.total = amount; 
      }
    }
  },
});

export const { setRecords, setCurrentRecord, setRecordTotal } = recordsSlice.actions;

export default recordsSlice.reducer;