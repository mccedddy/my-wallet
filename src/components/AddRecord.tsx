import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";
import { setWallets, setCurrentWallet } from "../reducers/walletsSlice";
import { setRecords, setCurrentRecord } from "../reducers/recordsSlice";
import { supabase } from '../services/supabaseClient';
import { fetchWallets, fetchRecords } from '../services/walletService';

function AddRecord() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const userId = useSelector((state: any) => state.user.id);
  const currentWallet = useSelector((state: any) => state.wallets.currentWallet);
  const wallets = useSelector((state: any) => state.wallets.wallets);
  const currentRecord = useSelector((state: any) => state.records.currentRecord);

  // State for record and wallet details
  const [recordDate, setRecordDate] = useState('');
  const [recordTime, setRecordTime] = useState('');
  const [description, setDescription] = useState('');
  const [walletValues, setWalletValues] = useState<{ id: string; value: string }[]>([]);
  const [walletName, setWalletName] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('');

  // Helper function to get the current time in Asia/Manila timezone
  const getManilaTime = () => {
    const now = new Date();
    const year = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', year: 'numeric' });
    const month = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', month: '2-digit' });
    const day = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: '2-digit' });
    const date = `${year}-${month}-${day}`;
    const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Manila', hour12: false });
    return { date, time };
  };

  // Initialize record date and time
  useEffect(() => {
    const { date, time } = getManilaTime();
    setRecordDate(currentRecord?.date || date);
    setRecordTime(currentRecord?.time || time);
    setDescription(currentRecord?.description || '');
    setWalletName(currentWallet?.name || '');
    setInitialValue(currentWallet?.value || '0');
    setColor(currentWallet?.color || '#FFFFFF');
    setPosition(currentWallet?.order?.toString() || '1');
  }, [currentRecord, currentWallet]);

  // Update wallet values dynamically
  const updateWalletValues = (walletId: string, value: string) => {
    setWalletValues((prevValues) => {
      const existingIndex = prevValues.findIndex((item: any) => item.id === walletId);
      const updatedItem = { id: walletId, value: value };

      if (existingIndex !== -1) {
        const updatedValues = [...prevValues];
        updatedValues[existingIndex] = updatedItem;
        return updatedValues;
      } else {
        return [...prevValues, updatedItem];
      }
    });
  };

  // Handle save logic
  const handleSave = async () => {
    if (currentPage === 'Edit Record') {
      const { error } = await supabase
        .from('records')
        .update({
          description,
          created_at: `${recordDate}T${recordTime}`,
        })
        .eq('id', currentRecord.id);

      if (error) {
        console.error('Error updating record:', error.message);
        return;
      }
    } else if (currentPage === 'Add Record') {
      const { data, error } = await supabase
        .from('records')
        .insert([{ description, created_at: `${recordDate}T${recordTime}` }])
        .select();

      if (error) {
        console.error('Error inserting record:', error.message);
        return;
      }

      const recordId = data[0].id;
      for (let walletValue of walletValues) {
        const { id: walletId, value } = walletValue as { id: string; value: string };
        const { error } = await supabase
          .from('wallet_values')
          .insert([{ record_id: recordId, wallet_id: walletId, value }]);

        if (error) {
          console.error('Error inserting wallet value:', error.message);
          return;
        }
      }
    } else if (currentPage === 'Edit Wallet') {
      const { error } = await supabase
        .from('wallets')
        .update({
          name: walletName,
          value: initialValue,
          color,
          position: parseInt(position, 10),
        })
        .eq('id', currentWallet.id);

      if (error) {
        console.error('Error updating wallet:', error.message);
        return;
      }
    } else if (currentPage === 'Add Wallet') {
      const { error } = await supabase
        .from('wallets')
        .insert([{ name: walletName, value: initialValue, color, position: parseInt(position, 10), user_id: userId }]);

      if (error) {
        console.error('Error inserting wallet:', error.message);
        return;
      }
    }

    const updatedWallets = await fetchWallets(userId);
    const updatedRecords = await fetchRecords(userId);
    dispatch(setWallets(updatedWallets));
    dispatch(setRecords(updatedRecords));
    dispatch(setCurrentWallet(null));
    dispatch(setCurrentRecord(null));
    dispatch(setCurrentPage(currentPage.includes('Wallet') ? 'Wallets' : 'Records'));
  };

  const handleDelete = async () => {
    if (currentPage === 'Edit Record') {
       // Delete the record from the 'records' table
       const { data, error } = await supabase
       .from('records')
       .delete()
       .eq('id', currentRecord.id);

     if (error) {
       console.error('Error deleting record:', error.message);
       return;
     }

     console.log('Record deleted successfully:', data);
    } else if (currentPage === 'Edit Wallet') {
      // Delete the wallet from the 'wallets' table
      const { data, error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', currentWallet.id);

      if (error) {
        console.error('Error deleting wallet:', error.message);
        return;
      }

      console.log('Wallet deleted successfully:', data);
    }
   
    const updatedWallets = await fetchWallets(userId);
    const updatedRecords = await fetchRecords(userId);
    dispatch(setWallets(updatedWallets));
    dispatch(setRecords(updatedRecords));
    dispatch(setCurrentWallet(null));
    dispatch(setCurrentRecord(null));
    dispatch(setCurrentPage(currentPage.includes('Wallet') ? 'Wallets' : 'Records'));
  }

  // Handle cancel logic
  const handleCancel = () => {
    dispatch(setCurrentPage(currentPage.includes('Wallet') ? 'Wallets' : 'Records'));
    dispatch(setCurrentWallet(null));
    dispatch(setCurrentRecord(null));
  };

  // Render wallet or record items
  const renderItems = () => {
    if (currentPage === 'Add Record') {
      return wallets.map((wallet: any) => (
        <div key={wallet.id} className='item'>
          <div className='item-row'>
            <h6 className='bold' style={{ color: wallet.color }}>{wallet.name}</h6>
            <input
              type='text'
              className='textbox'
              placeholder='P13,000'
              value={walletValues.find((item: any) => item.id === wallet.id)?.value || ''}
              onChange={(e) => updateWalletValues(wallet.id, e.target.value)}
              readOnly={currentPage === 'Edit Record'}
            />
          </div>
        </div>
      ));
    } else if (currentPage === 'Add Wallet' || currentPage === 'Edit Wallet') {
      return (
        <div className='item'>
          <div className='item-row'>
            <h6 className='bold'>Wallet Name</h6>
            <input
              type='text'
              className='textbox'
              placeholder='Name'
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
          <div className='item-row'>
            <h6 className='bold'>Initial Value</h6>
            <input
              type='text'
              className='textbox'
              placeholder='0'
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
            />
          </div>
          <div className='item-row'>
            <h6 className='bold'>Color</h6>
            <input
              type='color'
              className='textbox color'
              value={color}
              onChange={(e) => setColor(e.target.value.toUpperCase())}
            />
          </div>
          <div className='item-row'>
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
    }
  };

  return (
    <div className='records'>
      {renderItems()}

      {(currentPage === 'Add Record' || currentPage === 'Edit Record') && (
        <div className='item'>
          <h6 className='bold'>Record details</h6>
          <div className='item-row'>
            <h6 className='bold'>Date</h6>
            <input
              type='date'
              className='textbox'
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
            />
          </div>
          <div className='item-row'>
            <h6 className='bold'>Time</h6>
            <input
              type='time'
              className='textbox'
              value={recordTime}
              onChange={(e) => setRecordTime(e.target.value)}
            />
          </div>
          <div className='item-row'>
            <h6 className='bold'>Description</h6>
            <input
              type='text'
              className='textbox'
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className='save-container'>
        <button className='cancel-btn' onClick={handleCancel}>Cancel</button>
        {currentPage.includes('Edit') && <button className='delete-btn' onClick={handleDelete}>Delete</button>}
        <button className='save-btn' onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default AddRecord;