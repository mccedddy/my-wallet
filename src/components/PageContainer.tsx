import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Records from './Records'
import Graphs from './Graphs'
import Settings from './Settings'
import { useSelector, useDispatch } from "react-redux";
import { toggleOverview, setStartDate, setEndDate } from "../reducers/globalSlice";
import AddRecord from './AddRecord';

function PageContainer() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const filterShown = useSelector((state: any) => state.global.filterShown);
  const toggleOverviewEnabled = useSelector((state: any) => state.global.toggleOverviewEnabled);
  const startDate = useSelector((state: any) => new Date(state.global.startDate));
  const endDate = useSelector((state: any) => new Date(state.global.endDate));

  return (
    <div className='page-container'>
      <h3 className='page-text' onClick={() => { 
        if (toggleOverviewEnabled) {
          dispatch(toggleOverview())};
      }}>{currentPage}</h3>

      {filterShown && 
        <div className='filter'>
          <label>
            Date:
          </label>
          <DatePicker
            selected={startDate}
            className='date-picker'
            onChange={(date: Date | null) => {
              if (date) dispatch(setStartDate(date.toISOString()));
            }}
          />
          <label>
            -
          </label>
          <DatePicker
            selected={endDate}
            className='date-picker'
            onChange={(date: Date | null) => {
              if (date) dispatch(setEndDate(date.toISOString()));
            }}
          />
        </div>
      }

      {currentPage === 'Records' ? (
        <Records />
      ) : currentPage === 'Wallets' ? (
        <Records />
      ) : currentPage === 'Graphs' ? (
        <Graphs />
      ) : currentPage === 'Add Record' || 
          currentPage === 'Add Wallet' || 
          currentPage === 'Edit Record' || 
          currentPage === 'Edit Wallet' ? (
        <AddRecord />
      ) : currentPage === 'Settings' ? (
        <Settings />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default PageContainer;
