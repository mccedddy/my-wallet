import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    overviewShown: true, 
    currentPage: 'Records',
    pagesWithOverview: ['Graphs', 'Records', 'Wallets'],
  },
  reducers: {
    // Overview
    showOverview: (state) => {
      state.overviewShown = true;
    },
    hideOverview: (state) => {
      state.overviewShown = false;
    },
    toggleOverview: (state) => {
      state.overviewShown = !state.overviewShown;
    },

    // Current Page
    setCurrentPage: (state, action) => {
      
      if (state.currentPage !== action.payload) {

        // If target page is without overview, hide overview
        if (!state.pagesWithOverview.includes(action.payload)) { 
          state.overviewShown = false; 
        }

        // If coming from a page without overview and target page has overview, show overview
        if (!state.pagesWithOverview.includes(state.currentPage) && state.pagesWithOverview.includes(action.payload)) {
          state.overviewShown = true; 
        }

        state.currentPage = action.payload;
      }
    },
  },
});

// Export the actions
export const { showOverview, hideOverview, toggleOverview, setCurrentPage } = globalSlice.actions;

// Export the reducer
export default globalSlice.reducer;
