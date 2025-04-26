import React from 'react';
import { supabase } from '../services/supabaseClient';
import { useDispatch } from "react-redux";
import { logOut } from '../reducers/userSlice';

function Settings() {
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      dispatch(logOut());
      console.log('Logged out successfully');
      window.location.href = '/my-wallet';
    }
  };

  return (
    <div className="settings">
      <button className='save-btn' onClick={handleLogOut}>Log Out</button>
    </div>
  );
}

export default Settings;