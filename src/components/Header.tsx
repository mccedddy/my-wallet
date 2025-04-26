import React from 'react';
import { useSelector } from 'react-redux';
import WalletIcon from '../assets/icons/walletLogo.svg';

function Header() {
  const id = useSelector((state: any) => state.user.id);
  const email = useSelector((state: any) => state.user.email);
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="header">
      <div className='title-container'>
        <img src={WalletIcon} style={{height: "30px", width: "30px"}}></img>
        <h5>My Wallet</h5>
      </div>
      <p>{username}</p>
    </div>
  );
}

export default Header;
