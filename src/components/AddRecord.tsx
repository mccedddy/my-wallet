import React, { useState } from 'react';
import AddRecordItem from './AddRecordItem';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";

function AddRecord() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);

  if (currentPage === 'Add Record' || currentPage === 'Edit Record') {
    return(
      // Wallets to insert or edit values
      <div className='records'>
        <AddRecordItem />
        <AddRecordItem />
        <AddRecordItem />
        <AddRecordItem />

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => {dispatch(setCurrentPage('Records'))}}>Cancel</button>
          <button className='save-btn'>Save</button>
        </div>
      </div>
    );
  } else if (currentPage === 'Add Wallet' || currentPage === 'Edit Wallet') {
    return(
      // Wallet to add or edit
      <div className='records'>
        <AddRecordItem />

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => {dispatch(setCurrentPage('Wallets'))}}>Cancel</button>
          <button className='save-btn'>Save</button>
        </div>
      </div>
    );
  } else {
    return null;
  }
  
}

export default AddRecord;
