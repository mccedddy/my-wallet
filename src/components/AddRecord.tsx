import React, { useState, useEffect } from 'react';
import AddRecordItem from './AddRecordItem';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";
import { setWallets } from "../reducers/walletsSlice";
import { setRecords } from '../reducers/recordsSlice';
import { supabase } from '../services/supabaseClient';
import { fetchWallets, fetchRecords } from '../services/walletService';
import { setCurrentWallet } from '../reducers/walletsSlice';
import { setCurrentRecord } from '../reducers/recordsSlice'

function AddRecord() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const userId = useSelector((state: any) => state.user.id);
  const currentWallet = useSelector((state: any) => state.wallets.currentWallet);
  const wallets = useSelector((state: any) => state.wallets.wallets);
  const currentRecord = useSelector((state: any) => state.records.currentRecord);

  // Wallet details to insert/edit
  const [walletName, setWalletName] = useState(currentWallet?.title || '');
  const [initialValue, setInitialValue] = useState(currentWallet?.value || '0');
  const [color, setColor] = useState(currentWallet?.color || '#FFFFFF');
  const [position, setPosition] = useState(currentWallet?.order?.toString() || '1');

  // Helper function to get the current time in Asia/Manila timezone
  const getManilaTime = () => {
    const now = new Date();

    // Format date to YYYY-MM-DD for the date input field
    const year = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', year: 'numeric' });
    const month = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', month: '2-digit' });
    const day = now.toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: '2-digit' });
    const date = `${year}-${month}-${day}`;

    // Format time to HH:MM:SS
    const time = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Manila', hour12: false });

    return { date, time };
  };

  // Initialize record date and time to now (Asia/Manila)
  const { date: initialDate, time: initialTime } = getManilaTime();

  // Record details to inser/edit
  const [recordDate, setRecordDate] = useState(currentRecord?.date || initialDate); 
  const [recordTime, setRecordTime] = useState(currentRecord?.time || initialTime); 
  const [description, setDescription] = useState(currentRecord?.description || ''); 
  const [walletValues, setWalletValues] = useState<object[]>([]);

  useEffect(() => {
      console.log('Updated wallet values:', walletValues);
    }, [walletValues]);

  const handleSave = async () => {
     if (currentPage === 'Edit Record') {
      // Update the record in the 'records' table
      const { data, error } = await supabase
        .from('records')
        .update({
          description: description,
          created_at: `${recordDate}T${recordTime}`,
        })
        .eq('id', currentRecord.id);

      if (error) {
        console.error('Error updating records:', error.message);
        return;
      }

      console.log('Record updated successfully:', data);

      // Set the current page to 'Records'
      dispatch(setCurrentPage('Records'));
    } else if (currentPage === 'Add Record') {
      // Insert a new record into the 'records' table
      const { data, error } = await supabase
      .from('records')
      .insert([
        {
        description: description,
        created_at: `${recordDate}T${recordTime}`,
        },
      ])
      .select();

      if (error) {
        console.error('Error inserting record:', error.message);
        return;
      }

      // Get the ID of the newly inserted record
      const recordId = data[0].id;

      // For each object in walletValues, insert a new record into the 'wallet_values' table
      for (let walletValue of walletValues) {
        const { id: walletId, value } = walletValue as { id: number; value: number };

        const { error } = await supabase
          .from('wallet_values')
          .insert([
            {
              record_id: recordId,
              wallet_id: walletId,
              value: value,
            },
          ]);

        if (error) {
          console.error('Error inserting wallet value:', error.message);
          return;
        }
      }

      console.log('Record added successfully');

      // Set the current page to 'Records'
      dispatch(setCurrentPage('Records'));
    } else if (currentPage === 'Edit Wallet') {
      // Update the wallet in the 'wallets' table
      const { data, error } = await supabase
        .from('wallets')
        .update({
          name: walletName,
          value: initialValue,
          color: color,
          position: parseInt(position, 10),
        })
        .eq('id', currentWallet.id);

      if (error) {
        console.error('Error updating wallet:', error.message);
        return;
      }

      console.log('Wallet updated successfully:', data);

      // Set the current page to 'Wallets'
      dispatch(setCurrentPage('Wallets'));
    } else if (currentPage === 'Add Wallet') {
      // Insert a new wallet into the 'wallets' table
      const { data, error } = await supabase
        .from('wallets')
        .insert([
          {
            name: walletName,
            value: initialValue,
            color: color,
            position: parseInt(position, 10),
            user_id: userId,
          },
        ]);

      if (error) {
        console.error('Error inserting wallet:', error.message);
        return;
      }

      console.log('Wallet added successfully:', data);

      // Set the current page to 'Wallets'
      dispatch(setCurrentPage('Wallets'));
    }

    // Refetch wallets and update the wallets state
    const updatedWallets = await fetchWallets(userId);
    dispatch(setWallets(updatedWallets));

    const updatedRecords = await fetchRecords(userId);
    dispatch(setRecords(updatedRecords));

    
    dispatch(setCurrentWallet(null)); 
    dispatch(setCurrentRecord(null)); 
  };

  // Reset current wallet and move to target page
  const handleCancel = (targetPage: string) => {
    dispatch(setCurrentPage(targetPage));
    dispatch(setCurrentWallet(null)); 
    dispatch(setCurrentRecord(null)); 
  }

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

      // Set the current page to 'Records'
      dispatch(setCurrentPage('Records'));
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

       // Set the current page to 'Wallets'
      dispatch(setCurrentPage('Wallets'));
    }
   
    // Refetch wallets and records and update the wallets state
    const updatedWallets = await fetchWallets(userId);
    const updatedRecords = await fetchRecords(userId);
    dispatch(setWallets(updatedWallets));
    dispatch(setRecords(updatedRecords));

    // Reset current wallet and record
    dispatch(setCurrentWallet(null)); 
    dispatch(setCurrentRecord(null)); 
  }

  if (currentPage === 'Add Record' || currentPage === 'Edit Record') {
    return (
      <div className='records'>
        {currentPage === 'Add Record' && wallets.map((wallet: any) => (
          <AddRecordItem
            key={wallet.id}
            walletId={wallet.id}
            setWalletValues={setWalletValues}
            walletName={wallet.name}
            setWalletName={() => {}}
            initialValue=""
            setInitialValue={() => {}}
            color={wallet.color}
            setColor={() => {}}
            position=""
            setPosition={() => {}}
          />
        ))}

        <div className='record-item'>
          <h6 className='bold'>Record details</h6>
          <div className='record-item-row'>
            <h6 className='bold'>Date</h6>
            <input
              type='date'
              className='textbox'
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
            />
          </div>
          <div className='record-item-row'>
            <h6 className='bold'>Time</h6>
            <input
              type='time'
              className='textbox'
              value={recordTime}
              onChange={(e) => setRecordTime(e.target.value)}
            />
          </div>
          <div className='record-item-row'>
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

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => handleCancel('Records')}>Cancel</button>
          {currentPage === 'Edit Record' && (
            <button className='delete-btn' onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className='save-btn' onClick={handleSave}>Save</button>
        </div>
      </div>
    );
  } else if (currentPage === 'Add Wallet' || currentPage === 'Edit Wallet') {
    return(
      // Wallet to add or edit
      <div className='records'>
        <AddRecordItem
          walletName={walletName}
          setWalletName={setWalletName}
          setWalletValues={() => {}}
          initialValue={initialValue}
          setInitialValue={setInitialValue}
          color={color}
          setColor={setColor}
          position={position}
          setPosition={setPosition}
        />

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => {handleCancel('Wallets')}}>Cancel</button>

          {currentPage === 'Edit Wallet' && (
            <button className='delete-btn' onClick={handleDelete}>
              Delete
            </button>
          )}
          
          <button className='save-btn' onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
  
}

export default AddRecord;
