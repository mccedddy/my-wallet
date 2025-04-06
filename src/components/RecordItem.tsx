import React from 'react';
import EditIcon from '../assets/icons/pencil.svg';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from '../reducers/globalSlice';
import { setCurrentWallet } from '../reducers/walletsSlice';

interface RecordItemProps {
  data: {
    id: string;
    title: string;
    value: string;
    description?: string;
    color?: string;
    order?: number;
  };
}

function RecordItem({ data }: RecordItemProps) {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    if (currentPage === 'Wallets') {
      dispatch(setCurrentPage('Edit Wallet'));
      dispatch(setCurrentWallet(data));
    }
  };

  if (currentPage === 'Records') {
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
            <h6 className='bold'>{data.title}</h6>
            <h6 className='bold'>{data.value}</h6>
          </div>
          <div className='record-item-row'>
            <p>{data.description}</p>
            <p>+ P1,000</p>
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
              <p className='text-dark'>{data.id}</p>
              <div className='record-details-button' onClick={handleEdit}>
                <img src={EditIcon} alt='Edit' />
              </div>
            </div>
          </div>
        )}
      </>
    );
  } else if (currentPage === 'Wallets') {
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
            <h6 className='bold' style={{ color: data.color }}>{data.title}</h6>
            <h6 className='bold'>{data.value}</h6>
          </div>
          <div className='record-item-row'>
            <p>{data.description}</p>
          </div>
        </div>
  
        {(open) && (
          <div className={`record-details ${open ? 'open' : ''}`} id='record-details'>
            <div className='record-details-wallet'>
              <div className='record-item-row'>
                <h6>Color</h6>
                <h6 style={{ color: data.color }}>{data.color}</h6>
              </div>
            </div>
            <div className='record-details-wallet'>
              <div className='record-item-row'>
                <h6>Order</h6>
                <h6>{data.order}</h6>
              </div>
            </div>
  
            <div className='record-details-button-container'>
              <p className='bold text-dark'>{data.id}</p>
              <div className='record-details-button' onClick={handleEdit}>
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
