import React, { useState } from 'react';
import AddRecordItem from './AddRecordItem';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../reducers/globalSlice";
import { setWallets } from "../reducers/walletsSlice";
import { supabase } from '../services/supabaseClient';
import { fetchWallets } from '../services/walletService';
import { setCurrentWallet } from '../reducers/walletsSlice';
import DeleteIcon from '../assets/icons/trash.svg';

function AddRecord() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: any) => state.global.currentPage);
  const userId = useSelector((state: any) => state.user.id);
  const currentWallet = useSelector((state: any) => state.wallets.currentWallet);

  // Wallet details to insert/edit
  const [walletName, setWalletName] = useState(currentWallet?.title || '');
  const [initialValue, setInitialValue] = useState(currentWallet?.value || '0');
  const [color, setColor] = useState(currentWallet?.color || '#FFFFFF');
  const [position, setPosition] = useState(currentWallet?.order?.toString() || '1');

  const handleSave = async () => {
    if (currentPage === 'Edit Wallet') {
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
    } else {
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
    }

    // Refetch wallets and update the wallets state
    const updatedWallets = await fetchWallets(userId);
    dispatch(setWallets(updatedWallets));

    // Set the current page to 'Wallets'
    dispatch(setCurrentPage('Wallets'));
    dispatch(setCurrentWallet(null)); 
  };

  // Reset current wallet and move to target page
  const handleCancel = (targetPage: string) => {
    dispatch(setCurrentPage(targetPage));
    dispatch(setCurrentWallet(null)); 
  }

  const handleDelete = async () => {
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

    // Refetch wallets and update the wallets state
    const updatedWallets = await fetchWallets(userId);
    dispatch(setWallets(updatedWallets));

    // Set the current page to 'Wallets'
    dispatch(setCurrentPage('Wallets'));
    dispatch(setCurrentWallet(null)); 
  }

  if (currentPage === 'Add Record' || currentPage === 'Edit Record') {
    return(
      <div className='records'>
        <AddRecordItem
          walletName={walletName}
          setWalletName={setWalletName}
          initialValue={initialValue}
          setInitialValue={setInitialValue}
          color={color}
          setColor={setColor}
          position={position}
          setPosition={setPosition}
        />
        <AddRecordItem
          walletName={walletName}
          setWalletName={setWalletName}
          initialValue={initialValue}
          setInitialValue={setInitialValue}
          color={color}
          setColor={setColor}
          position={position}
          setPosition={setPosition}
        />
        <AddRecordItem
          walletName={walletName}
          setWalletName={setWalletName}
          initialValue={initialValue}
          setInitialValue={setInitialValue}
          color={color}
          setColor={setColor}
          position={position}
          setPosition={setPosition}
        />

        <div className='save-container'>
          <button className='cancel-btn' onClick={() => handleCancel('Records')}>Cancel</button>
          <button className='save-btn'>Save</button>
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
