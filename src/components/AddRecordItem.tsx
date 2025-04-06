import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

interface AddRecordItemProps {
  walletName: string;
  setWalletName: React.Dispatch<React.SetStateAction<string>>;
  initialValue: string;
  setInitialValue: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  position: string;
  setPosition: React.Dispatch<React.SetStateAction<string>>;
}

function AddRecordItem({
  walletName,
  setWalletName,
  initialValue,
  setInitialValue,
  color,
  setColor,
  position,
  setPosition,
}: AddRecordItemProps) {
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
          <input
            type='text'
            className='textbox'
            placeholder='Name'
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            minLength={1}
            maxLength={12}
          />
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Initial Value</h6>
          <input
            type='text'
            className='textbox'
            placeholder='0'
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            readOnly={currentPage === 'Edit Wallet'}
          />
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Color</h6>
          <input
            type='color'
            className='textbox color'
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
          />
        </div>
        <div className='record-item-row'>
          <h6 className='bold'>Position</h6>
          <input
            type='text'
            className='textbox'
            placeholder='1'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default AddRecordItem;
