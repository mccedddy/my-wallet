import React from 'react';
import { useSelector } from 'react-redux';

function Header() {
  const id = useSelector((state: any) => state.user.id);
  const email = useSelector((state: any) => state.user.email);
  const username = useSelector((state: any) => state.user.username);

  return (
    <div className="header">
      <h3>My Wallet</h3>
      <p>{username}</p>
    </div>
  );
}

export default Header;
