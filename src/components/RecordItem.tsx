import React from 'react';
import EditIcon from '../assets/icons/pencil.svg';

function RecordItem() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={`record-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <div className='record-item-row'>
        <p className='record-item-bold'>13/03/2025</p>
          <p className='record-item-bold'>P13,000</p>
        </div>
        <div className='record-item-row'>
          <p className='record-item-small'>Record Description</p>
          <p className='record-item-small'>- P1,000</p>
        </div>
      </div>

      {open && (
        <div className={`record-details ${open ? 'open' : ''}`}>
          <div className='record-details-wallet'>
            <div className='record-item-row'>
              <p className='record-item-small'>Wallet 1</p>
              <p className='record-item-small'>P13,000</p>
            </div>
            <div className='record-item-row'>
              <p className='record-item-small'></p>
              <p className='record-item-small'>-P13,000</p>
            </div>
          </div>
          <div className='record-details-wallet'>
            <div className='record-item-row'>
              <p className='record-item-small'>Wallet 1</p>
              <p className='record-item-small'>P13,000</p>
            </div>
            <div className='record-item-row'>
              <p className='record-item-small'></p>
              <p className='record-item-small'>-P13,000</p>
            </div>
          </div>

          <div className='record-details-button-container'>
            <div className='record-details-button'>
              <img src={EditIcon} alt='Edit' />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecordItem;
