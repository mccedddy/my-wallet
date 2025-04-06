import React, { useEffect, useState } from 'react';
import EditIcon from '../assets/icons/pencil.svg';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from '../reducers/globalSlice';
import { supabase } from '../services/supabaseClient';
import { setCurrentWallet } from '../reducers/walletsSlice';
import { setCurrentRecord } from '../reducers/recordsSlice';

interface RecordItemProps {
  data: {
    id: string;
    title?: string;
    value?: string;
    description?: string;
    color?: string;
    order?: number;
    date?: string;
    time?: string;
  };
}

function RecordItem({ data }: RecordItemProps) {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const wallets = useSelector((state: any) => state.wallets.wallets);
  const [walletValues, setWalletValues] = useState<any[]>([]); 
  const [open, setOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    if (currentPage === 'Records') {
      dispatch(setCurrentPage('Edit Record'));
      dispatch(setCurrentRecord(data));
    } else if (currentPage === 'Wallets') {
      dispatch(setCurrentPage('Edit Wallet'));
      dispatch(setCurrentWallet(data));
    }
  };

  // Fetch wallet values for the current record
  useEffect(() => {
    const fetchWalletValues = async () => {
      const walletIds = wallets.map((wallet: any) => wallet.id);

      const { data: walletValuesData, error } = await supabase
        .from('wallet_values')
        .select('*')
        .eq('record_id', data.id)
        .in('wallet_id', walletIds);

      if (error) {
        console.error('Error fetching wallet values:', error.message);
        return;
      }

      setWalletValues(walletValuesData || []);

      // Calculate total value
      const total = walletValuesData?.reduce((sum, walletValue) => sum + parseFloat(walletValue.value), 0) || 0;
      setTotalValue(total);
    };

    fetchWalletValues();
  }, [data.id, wallets]);

  if (currentPage === 'Records') {
    return (
      <>
        <div
          className={`record-item ${open ? 'open' : ''}`}
          onClick={() => {
            if (open) {
              handleClose();
            } else {
              handleOpen();
            }
          }}
        >
          <div className='record-item-row'>
            <h6 className='bold'>{data.title}</h6>
            <h6 className='bold'>{totalValue}</h6>
          </div>
          <div className='record-item-row'>
            <p>{data.description}</p>
          </div>
        </div>

        {open && (
          <div className={`record-details ${open ? 'open' : ''}`} id='record-details'>
            {walletValues.map((walletValue: any) => {
              const wallet = wallets.find((w: any) => w.id === walletValue.wallet_id);
              return (
                <div key={walletValue.wallet_id} className='record-details-wallet'>
                  <div className='record-item-row'>
                    <h6 style={{ color: wallet?.color }}>{wallet?.name || 'Unknown Wallet'}</h6>
                    <h6>{walletValue.value}</h6>
                  </div>
                </div>
              );
            })}

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