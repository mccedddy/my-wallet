import React from "react";

const Navbar = ({ username }) => {
  return (
    <nav className="px-5 py-3 w-full flex justify-between items-center">
      <h1 className="text-xl">My Wallet</h1>
      <h1 className="text-text-dark">{username}</h1>
    </nav>
  );
};

export default Navbar;
