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
    <div className="h-full w-full flex flex-col items-center bg-red-100">
      <Navbar handleLogOut={logOut} />
      <div className="w-11/12 md:w-9/12 lg:w-8/12 flex flex-col">
        <div className="flex my-4 text-center font-bold gap-2">
          <button
            onClick={() => toPage("records")}
            className={`${page === "records" ? "border-b-2 border-black" : ""}`}
          >
            {page === "records" ? "RECORDS" : "R"}
          </button>
          <button
            onClick={() => toPage("graphs")}
            className={`${page === "graphs" ? "border-b-2 border-black" : ""}`}
          >
            {page === "graphs" ? "GRAPHS" : "G"}
          </button>
          <button
            onClick={() => toPage("wallets")}
            className={`${page === "wallets" ? "border-b-2 border-black" : ""}`}
          >
            {page === "wallets" ? "WALLETS" : "W"}
          </button>
          <button
            onClick={() => toPage("settings")}
            className={`${
              page === "settings" ? "border-b-2 border-black" : ""
            }`}
          >
            {page === "settings" ? "SETTINGS" : "S"}
          </button>
        </div>
        {page === "records" && <Records user={user} />}
        {page === "wallets" && <Wallets user={user} />}
      </div>
    </div>
  );
};

export default Home;
