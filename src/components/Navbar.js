import React from "react";
import WalletIcon from "../assets/icons/wallet.svg";

const Navbar = ({ username }) => {
  return (
    <nav className="px-5 py-3 w-full flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <img src={WalletIcon} alt="Wallet" className="w-8 h-8" />
        <h1 className="text-xl">My Wallet</h1>
      </div>
      <h1 className="text-text-dark">{username}</h1>
    </nav>
  );
};

export default Navbar;
