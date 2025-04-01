import React from 'react';

interface AddRecordItemProps {
  type: string;
}

function AddRecordItem({ type }: AddRecordItemProps) {
  if (type === 'record') {
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
  } else if (type === 'wallet') {
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
          <input type='text' className='textbox' placeholder='#FFFFFF'></input>
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
