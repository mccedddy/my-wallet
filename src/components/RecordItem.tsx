import React from 'react';
import EditIcon from '../assets/icons/pencil.svg';

function RecordItem() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={`record-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <div className='record-item-row'>
        <h6 className='bold'>13/03/2025</h6>
          <h6 className='bold'>P13,000</h6>
        </div>
        <div className='record-item-row'>
          <h6>Record Description</h6>
          <p>- P1,000</p>
        </div>
      </div>

      {open && (
        <div className={`record-details ${open ? 'open' : ''}`}>
          <div className='record-details-wallet'>
            <div className='record-item-row'>
              <h6>Wallet 1</h6>
              <h6>P13,000</h6>
            </div>
            <div className='record-item-row'>
              <p></p>
              <p>-P13,000</p>
            </div>
          </div>
          <div className='record-details-wallet'>
            <div className='record-item-row'>
              <h6>Wallet 1</h6>
              <h6>P13,000</h6>
            </div>
            <div className='record-item-row'>
              <p></p>
              <p>-P13,000</p>
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
