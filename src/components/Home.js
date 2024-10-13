import React, { useState, useEffect } from "react";
import { logOut } from "../firebase/authService";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import Records from "./Records";
import Graphs from "./Graphs";
import Wallets from "./Wallets";
import Settings from "./Settings";

const Home = ({ user }) => {
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState("records");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUsername(data.username || "Guest");
        }
      }
    };

    fetchUsername();
  }, [user, refresh]);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  const openCreateWallet = () => {
    setPage("wallets");
  };

  const toPage = (selectedPage) => {
    setPage(selectedPage);
  };

  return (
    <div className="h-full w-full flex flex-col flex-grow items-center">
      <Navbar username={username} />
      <div className="w-11/12 md:w-9/12 lg:w-8/12 flex flex-col">
        <div className=" flex mt-4 mb-2 text-center border-b-2 border-background-light gap-5">
          <button
            onClick={() => toPage("records")}
            className={`bg-background hover:text-text text-md sm:text-lg ${
              page === "records" ? "border-b-2 border-accent" : "text-text-dark"
            }`}
          >
            RECORDS
          </button>
          <button
            onClick={() => toPage("graphs")}
            className={`bg-background hover:text-text text-md sm:text-lg ${
              page === "graphs" ? "border-b-2 border-primary" : "text-text-dark"
            }`}
          >
            GRAPHS
          </button>
          <button
            onClick={() => toPage("wallets")}
            className={`bg-background hover:text-text text-md sm:text-lg ${
              page === "wallets"
                ? "border-b-2 border-secondary"
                : "text-text-dark"
            }`}
          >
            WALLETS
          </button>
          <button
            onClick={() => toPage("settings")}
            className={`bg-background hover:text-text text-md sm:text-lg ${
              page === "settings" ? "border-b-2 border-text" : "text-text-dark"
            }`}
          >
            SETTINGS
          </button>
        </div>
        {page === "records" && (
          <Records user={user} openCreateWallet={openCreateWallet} />
        )}
        {page === "graphs" && <Graphs user={user} />}
        {page === "wallets" && <Wallets user={user} />}
        {page === "settings" && (
          <Settings
            user={user}
            username={username}
            handleLogOut={logOut}
            onUpdate={triggerRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
