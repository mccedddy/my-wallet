import React, { useState } from "react";
import { logOut } from "../firebase/authService";
import Navbar from "./Navbar";
import Records from "./Records";
import Wallets from "./Wallets";

const Home = ({ user }) => {
  const [page, setPage] = useState("records");

  const toPage = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div className="h-full w-full flex flex-col flex-grow items-center">
      <Navbar handleLogOut={logOut} />
      <div className="w-11/12 md:w-9/12 lg:w-8/12 flex flex-col">
        <div className="flex my-4 text-center gap-3">
          <button
            onClick={() => toPage("records")}
            className={`bg-customWhite text-customBlack ${
              page === "records" ? "border-b-2 border-customBlue" : ""
            }`}
          >
            RECORDS
          </button>
          <button
            onClick={() => toPage("graphs")}
            className={`bg-customWhite text-customBlack ${
              page === "graphs" ? "border-b-2 border-customBlue" : ""
            }`}
          >
            GRAPHS
          </button>
          <button
            onClick={() => toPage("wallets")}
            className={`bg-customWhite text-customBlack ${
              page === "wallets" ? "border-b-2 border-customBlue" : ""
            }`}
          >
            WALLETS
          </button>
          <button
            onClick={() => toPage("settings")}
            className={`bg-customWhite text-customBlack ${
              page === "settings" ? "border-b-2 border-customBlue" : ""
            }`}
          >
            SETTINGS
          </button>
        </div>
        {page === "records" && <Records user={user} />}
        {page === "wallets" && <Wallets user={user} />}
      </div>
    </div>
  );
};

export default Home;
