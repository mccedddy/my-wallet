import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    currentPage: 'Records',
    pagesWithOverview: ['Graphs', 'Records', 'Wallets'],
    overviewShown: true, 
    pagesWithFilter: ['Graphs', 'Records'],
    filterShown: true,
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    endDate: new Date().toISOString(),
    pagesWithoutNavbar: ['Add Record', 'Add Wallet'],
    navbarShown: true,
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
        // Hide/show filter
        if (state.pagesWithFilter.includes(action.payload)) {
          state.filterShown = true;
        } else {
          state.filterShown = false;
        }

        // If target page is without overview, hide overview
        if (!state.pagesWithOverview.includes(action.payload)) { 
          state.overviewShown = false; 
        }

        // If coming from a page without overview and target page has overview, show overview
        if (!state.pagesWithOverview.includes(state.currentPage) && state.pagesWithOverview.includes(action.payload)) {
          state.overviewShown = true; 
        }

        // Hide/show navbar
        if (state.pagesWithoutNavbar.includes(action.payload)) {
          state.navbarShown = false;
        } else {
          state.navbarShown = true;
        }

        state.currentPage = action.payload;
      }
    },
    
    // Date Range
    setStartDate: (state, action) => {
      if (action.payload <= state.endDate) {
        state.startDate = action.payload;
      }    
    },
    setEndDate: (state, action) => {
      if (action.payload >= state.startDate) {
        state.endDate = action.payload;
      }
    },
  },
});

// Export the actions
export const { showOverview, hideOverview, toggleOverview, setCurrentPage, setStartDate, setEndDate } = globalSlice.actions;

// Export the reducer
export default globalSlice.reducer;
