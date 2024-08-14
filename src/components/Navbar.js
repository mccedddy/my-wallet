import React from "react";

const Navbar = ({ handleLogOut }) => {
  return (
    <nav className="px-4 py-3 w-full flex justify-between items-center">
      <h1>My Wallet</h1>
      <button
        onClick={handleLogOut}
        className="text-xs underline bg-background"
      >
        Log Out
      </button>
    </nav>
  );
};

export default Navbar;
