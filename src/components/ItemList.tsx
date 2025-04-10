import React, { useEffect, useState } from 'react';
import EditIcon from '../assets/icons/pencil.svg';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from '../reducers/globalSlice';
import { supabase } from '../services/supabaseClient';
import { setCurrentWallet } from '../reducers/walletsSlice';
import { setCurrentRecord } from '../reducers/recordsSlice';

interface ItemListProps {
  type: 'wallet' | 'record';
  data: any;
}

// Format timestamp to YYYY-MM-DD or HH:MM:SS
const formatDateTime = (timestamp: string, type: string = 'datetime') => {
  if (!timestamp) return "N/A"; 
  const date = new Date(timestamp);

  if (type === 'date') {
    // Format date to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  } else if (type === 'time') {
    // Format time to HH:MM:SS
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  } else {
    // Format full datetime to YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
  }
};

function ItemList({ type, data }: ItemListProps) {
  const dispatch = useDispatch();
  const wallets = useSelector((state: any) => state.wallets.wallets);
  const records = useSelector((state: any) => state.records.records); 
  const [walletValues, setWalletValues] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [latestWalletValue, setLatestWalletValue] = useState<number | null>(null); 


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = () => {
    if (type === 'record') {
      dispatch(setCurrentPage('Edit Record'));
      dispatch(setCurrentRecord(data));
    } else if (type === 'wallet') {
      dispatch(setCurrentPage('Edit Wallet'));
      dispatch(setCurrentWallet(data));
    }
  };

  // Fetch wallet values for records
  useEffect(() => {
    if (type === 'record') {
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
    } else if (type === 'wallet') {
      // Fetch latest wallet values
      const fetchLatestWalletValue = async () => {
        const latestRecord = records[0]; 
        if (!latestRecord) {
          console.error('No records found.');
          return;
        }

        const { data: walletValueData, error } = await supabase
          .from('wallet_values')
          .select('value')
          .eq('wallet_id', data.id)
          .eq('record_id', latestRecord.id) 
          .single();

        if (error) {
          console.error('Error fetching wallet value:', error.message);
          return;
        }

        setLatestWalletValue(walletValueData?.value || null);
      };

      fetchLatestWalletValue();
    }
  }, [type, data.id, records, wallets]);

  return (
    <>
      <div
        className={`item ${open ? 'open' : ''}`}
        onClick={() => (open ? handleClose() : handleOpen())}
      >
        <div className='item-row'>
          <h6 className='bold' style={{ color: type === 'wallet' ? data.color : undefined }}>
            {data.name || formatDateTime(data.created_at, 'datetime')}
          </h6>
          ₱ {type === 'record' ? totalValue : latestWalletValue !== null ? latestWalletValue : '0'}
        </div>
        <div className='item-row'>
          <p>{type === 'record' ? 
                data.description? data.description : 
                "No description" : 
                data.last_updated? 
                  `Last updated: ${formatDateTime(data.last_updated, 'datetime')}` : 
                  "No description"}
          </p>
        </div>
      </div>

      {open && (
        <div className={`item-details ${open ? 'open' : ''}`} id='item-details'>
          {type === 'record' && walletValues.map((walletValue: any) => {
            const wallet = wallets.find((w: any) => w.id === walletValue.wallet_id);
            return (
              <div key={walletValue.wallet_id} className='item-details-wallet'>
                <div className='item-row'>
                  <h6 style={{ color: wallet?.color }}>{wallet?.name || 'Unknown Wallet'}</h6>
                  <h6>₱ {walletValue.value}</h6>
                </div>
              </div>
            );
          })}

          {type === 'wallet' && (
            <>
              <div className='item-details-wallet'>
                <div className='item-row'>
                  <h6>Color</h6>
                  <h6 style={{ color: data.color }}>{data.color}</h6>
                </div>
              </div>
              <div className='item-details-wallet'>
                <div className='item-row'>
                  <h6>Order</h6>
                  <h6>{data.order}</h6>
                </div>
              </div>
            </>
          )}

          <div className='item-details-button-container'>
            <p className='text-dark'>{data.id}</p>
            <div className='item-details-button' onClick={handleEdit}>
              <img src={EditIcon} alt='Edit' />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ItemList;