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
        <div className=" flex mt-4 mb-2 text-center border-b-2 border-background-light gap-5">
          <button
            onClick={() => toPage("records")}
            className={`bg-background hover:text-text text-lg ${
              page === "records" ? "border-b-2 border-accent" : "text-text-dark"
            }`}
          >
            RECORDS
          </button>
          <button
            onClick={() => toPage("graphs")}
            className={`bg-background hover:text-text text-lg ${
              page === "graphs" ? "border-b-2 border-primary" : "text-text-dark"
            }`}
          >
            GRAPHS
          </button>
          <button
            onClick={() => toPage("wallets")}
            className={`bg-background hover:text-text text-lg ${
              page === "wallets"
                ? "border-b-2 border-secondary"
                : "text-text-dark"
            }`}
          >
            WALLETS
          </button>
          <button
            onClick={() => toPage("settings")}
            className={`bg-background hover:text-text text-lg ${
              page === "settings" ? "border-b-2 border-text" : "text-text-dark"
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
