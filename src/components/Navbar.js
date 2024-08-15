import React from "react";

const Navbar = ({ handleLogOut }) => {
  return (
    <nav className="px-4 py-3 w-full flex justify-between items-center">
      <h1>My Wallet</h1>
      <button
        onClick={handleLogOut}
        className="px-2 py-1 text-xs rounded bg-secondary"
      >
        Log Out
      </button>
    </nav>
  );
};

export default Navbar;
