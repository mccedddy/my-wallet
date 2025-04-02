import React from 'react';
import { useSelector, useDispatch } from "react-redux";

interface AddRecordItemProps {
  walletValueId?: number; // wallet value id to edit
  walletId?: number; // wallet id to edit
}

function AddRecordItem({ walletValueId, walletId }: AddRecordItemProps) {
  const currentPage = useSelector((state: any) => state.global.currentPage);

  if (currentPage === 'Add Record' || currentPage === 'Edit Record') {
    return (
      <div className='record-item'>
        <div className='record-item-row'>
          <h6 className='bold'>Wallet 1</h6>
          <input type='text' className='textbox' placeholder='Increased By'></input>
        </div>
        
        <div className='record-item-row'>
          <p></p>
          <input type='text' className='textbox' placeholder='P13,000'></input>
        </div>
      </div>
    );
  } else if (currentPage === 'Add Wallet' || currentPage === 'Edit Wallet') {
    return (
      <div className='record-item'>
        <div className='record-item-row'>
          <h6 className='bold'>Wallet Name</h6>
          <input type='text' className='textbox' placeholder='Name'></input>
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Initial Value</h6>
          <input type='text' className='textbox' placeholder='P13,000'></input>
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Color</h6>
          <input type='color' className='textbox color' placeholder='#FFFFFF' value='#FFFFFF'></input>
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Order</h6>
          <input type='text' className='textbox' placeholder='1'></input>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default AddRecordItem;
