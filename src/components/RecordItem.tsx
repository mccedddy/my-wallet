import React from 'react';
import EditIcon from '../assets/icons/pencil.svg';

interface RecordItemProps {
  type: string;
}

function RecordItem({ type }: RecordItemProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (type === 'record') {
    return (
      <>
        <div className={`record-item ${open ? 'open' : ''}`} onClick={() => {
          if (open) {
            handleClose();
          } else {
            handleOpen();
          }
        }}>
          <div className='record-item-row'>
            <h6 className='bold'>13/03/2025</h6>
            <h6 className='bold'>P13,000</h6>
          </div>
          <div className='record-item-row'>
            <p>Record Description</p>
            <p>- P1,000</p>
          </div>
        </div>
  
        {(open) && (
          <div className={`record-details ${open ? 'open' : ''}`} id='record-details'>
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
              <h6 className='bold text-dark'>ID</h6>
              <div className='record-details-button'>
                <img src={EditIcon} alt='Edit' />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (type === 'wallet') {
    return (
      <>
        <div className={`record-item ${open ? 'open' : ''}`} onClick={() => {
          if (open) {
            handleClose();
          } else {
            handleOpen();
          }
        }}>
          <div className='record-item-row'>
            <h6 className='bold'>Wallet 1</h6>
            <h6 className='bold'>P13,000</h6>
          </div>
          <div className='record-item-row'>
            <p>Last Updated: 03/29/2025</p>
          </div>
        </div>
  
        {(open) && (
          <div className={`record-details ${open ? 'open' : ''}`} id='record-details'>
            <div className='record-details-wallet'>
              <div className='record-item-row'>
                <h6>Color</h6>
                <h6>#FFFFFF</h6>
              </div>
            </div>
            <div className='record-details-wallet'>
              <div className='record-item-row'>
                <h6>Order</h6>
                <h6>1</h6>
              </div>
            </div>
  
            <div className='record-details-button-container'>
              <h6 className='bold text-dark'>ID</h6>
              <div className='record-details-button'>
                <img src={EditIcon} alt='Edit' />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return null;
  }
}

export default RecordItem;
