import React, { useState } from "react";
import Navbar from "./Navbar";
import Records from "./Records";
import Graphs from "./Graphs";
import Wallets from "./Wallets";
import Settings from "./Settings";
import WalletIcon from "../assets/icons/walletLine.svg";
import WalletIconDark from "../assets/icons/walletLineDark.svg";
import RecordsIcon from "../assets/icons/table.svg";
import RecordsIconDark from "../assets/icons/tableDark.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import SettingsIconDark from "../assets/icons/settingsDark.svg";
import GraphIcon from "../assets/icons/graph.svg";
import GraphIconDark from "../assets/icons/graphDark.svg";
import OwedIcon from "../assets/icons/owed.svg";
import OwedIconDark from "../assets/icons/owedDark.svg";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user.value);
  const userName = useSelector((state) => state.user.name);

  const [page, setPage] = useState("records");

  const openCreateWallet = () => {
    setPage("wallets");
  };

  const toPage = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div className="h-full w-full flex flex-col flex-grow items-center">
      <Navbar username={userName} />
      <div className="w-11/12 md:w-9/12 lg:w-8/12 flex flex-col">
        <div className="flex mt-4 mb-2 text-center border-b-2 border-background-light gap-5">
          <button
            onClick={() => toPage("records")}
            className={`flex gap-2 justify-center items-center bg-background hover:text-text text-xl ${
              page === "records" ? "border-b-2 border-accent" : "text-text-dark"
            }`}
          >
            <img
              src={page === "records" ? RecordsIcon : RecordsIconDark}
              alt="records icon"
              className="w-6 h-6"
            />
            {page === "records" ? "RECORDS" : ""}
          </button>
          <button
            onClick={() => toPage("graphs")}
            className={`flex gap-2 justify-center items-center bg-background hover:text-text text-xl ${
              page === "graphs" ? "border-b-2 border-primary" : "text-text-dark"
            }`}
          >
            <img
              src={page === "graphs" ? GraphIcon : GraphIconDark}
              alt="graph icon"
              className="w-6 h-6"
            />
            {page === "graphs" ? "GRAPHS" : ""}
          </button>
          <button
            onClick={() => toPage("wallets")}
            className={`flex gap-2 justify-center items-center bg-background hover:text-text text-xl ${
              page === "wallets"
                ? "border-b-2 border-secondary"
                : "text-text-dark"
            }`}
          >
            <img
              src={page === "wallets" ? WalletIcon : WalletIconDark}
              alt="wallet icon"
              className="w-6 h-6"
            />
            {page === "wallets" ? "WALLETS" : ""}
          </button>
          <button
            onClick={() => toPage("owed")}
            className={`flex gap-2 justify-center items-center bg-background hover:text-text text-xl ${
              page === "owed" ? "border-b-2 border-accent" : "text-text-dark"
            }`}
          >
            <img
              src={page === "owed" ? OwedIcon : OwedIconDark}
              alt="owed icon"
              className="w-6 h-6"
            />
            {page === "owed" ? "OWED" : ""}
          </button>
          <button
            onClick={() => toPage("settings")}
            className={`flex gap-2 justify-center items-center bg-background hover:text-text text-xl ${
              page === "settings" ? "border-b-2 border-text" : "text-text-dark"
            }`}
          >
            <img
              src={page === "settings" ? SettingsIcon : SettingsIconDark}
              alt="settings icon"
              className="w-6 h-6"
            />
            {page === "settings" ? "SETTINGS" : ""}
          </button>
        </div>
        {page === "records" && (
          <Records user={user} openCreateWallet={openCreateWallet} />
        )}
        {page === "graphs" && <Graphs />}
        {page === "wallets" && <Wallets />}
        {/* {page === "owed" && <Owed />} */}
        {page === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Home;
