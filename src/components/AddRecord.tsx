import React, { useState } from 'react';
import AddRecordItem from './AddRecordItem';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";

interface AddRecordProps {
  type: string;
}

function AddRecord({ type }: AddRecordProps) {
  const dispatch = useDispatch();
    const currentPage = useSelector((state: any) => state.global.currentPage);

  if (type === 'record') {
    return(
      <div className='records'>
        <AddRecordItem type='record' />
        <AddRecordItem type='record' />
        <AddRecordItem type='record' />
        <AddRecordItem type='record' />
        <AddRecordItem type='record' />

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => {dispatch(setCurrentPage('Records'))}}>Cancel</button>
          <button className='save-btn'>Save</button>
        </div>
      </div>
    );
  } else if (type === 'wallet') {
    return(
      <div className='records'>
        <AddRecordItem type='wallet' />

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
