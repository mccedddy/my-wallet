import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

const Sidebar = ({ user, onUpdate }) => {
  const [walletName, setWalletName] = useState("");
  const [wallets, setWallets] = useState([]);
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);

  const [showWallets, setShowWallets] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch wallets
  useEffect(() => {
    if (user?.email) {
      const userDocRef = doc(db, "users", user.email);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWallets(data.wallets || []);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddWallet = async (e) => {
    e.preventDefault();
    if (walletName && !wallets.includes(walletName)) {
      try {
        const userDocRef = doc(db, "users", user.email);
        await updateDoc(userDocRef, {
          wallets: arrayUnion(walletName),
        });
        console.log("Added wallet:", walletName);
        onUpdate();
        setWalletName("");
      } catch (error) {
        console.error("Error adding wallet: ", error);
      }
    }
  };

  const handleDeleteWallet = async (walletToDelete) => {
    try {
      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, {
        wallets: arrayRemove(walletToDelete),
      });
      console.log("Deleted wallet:", walletToDelete);
      onUpdate();

      // Remove record
      const updatedRecords = records.filter(
        (record) => record.wallet !== walletToDelete
      );
      setRecords(updatedRecords);

      // Remove the wallet field from the latest document
      const recordRef = doc(db, "users", user.email, "records", "latest");
      await updateDoc(recordRef, {
        [walletToDelete]: deleteField(),
      });
    } catch (error) {
      console.error("Error deleting wallet: ", error);
    }
  };

  const handleAddRecord = () => {
    setRecords([...records, { wallet: "", balance: "" }]);
  };

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Save only unique records
    const uniqueRecords = records.reduce((acc, curr) => {
      acc[curr.wallet] = curr;
      return acc;
    }, {});
    const filteredRecords = Object.values(uniqueRecords);

    // Reset records after saving
    setRecords([{ wallet: "", balance: "" }]);

    console.log("Saving records:", filteredRecords);

    try {
      const recordsCollectionRef = collection(
        db,
        "users",
        user.email,
        "records"
      );

      // Get the latest record
      const latestDocRef = doc(recordsCollectionRef, "latest");
      const latestDocSnap = await getDoc(latestDocRef);
      let mergedRecords = {};

      if (latestDocSnap.exists()) {
        mergedRecords = latestDocSnap.data();
      }

      filteredRecords.forEach((record) => {
        mergedRecords[record.wallet] = record.balance;
      });

      const timestamp = new Date().toISOString();

      const newDocRef = doc(recordsCollectionRef, timestamp);
      await setDoc(newDocRef, { ...mergedRecords, timestamp });

      await setDoc(latestDocRef, mergedRecords);

      console.log("Records saved successfully");
      onUpdate();
    } catch (error) {
      console.error("Error saving records: ", error);
    }
  };

  return (
    <div
      className={`relative h-full flex bg-red-300 transition-all duration-300 ease-in-out
      ${isVisible ? "w-full md:w-6/12 lg:w-4/12" : "w-5"}`}
    >
      <div
        className={`flex flex-col flex-grow bg-red-300 py-2 px-4 gap-2
        ${isVisible ? "" : "hidden"}`}
      >
        {/* Profile Section */}
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="text-left font-bold border-b border-black p-1"
        >
          PROFILE
        </button>
        {showProfile && <h1>{user.email}</h1>}

        {/* Wallets Section */}
        <button
          onClick={() => setShowWallets(!showWallets)}
          className="text-left font-bold border-b border-black p-1"
        >
          WALLETS
        </button>
        {showWallets && (
          <form onSubmit={handleAddWallet} className="flex flex-col gap-1">
            <ul className="flex flex-col gap-1">
              {wallets.map((wallet) => (
                <div className="flex justify-between" key={wallet}>
                  <h1 value={wallet} className="pl-1">
                    {wallet}
                  </h1>
                  <button
                    type="button"
                    onClick={() => handleDeleteWallet(wallet)}
                    className="bg-red-500 rounded px-1"
                  >
                    +
                  </button>
                </div>
              ))}
            </ul>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Wallet Name"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                required
                className="w-full border rounded px-1"
              />
              <button type="submit" className="bg-red-500 rounded px-1">
                +
              </button>
            </div>
          </form>
        )}

        {/* Records Section */}
        <button
          onClick={() => setShowRecords(!showRecords)}
          className="text-left font-bold border-b border-black p-1"
        >
          RECORDS
        </button>
        {showRecords && (
          <form onSubmit={handleSave} className="flex flex-col gap-1">
            {records.map((record, index) => (
              <div key={index} className="flex gap-1 items-center">
                <select
                  className="border rounded"
                  value={record.wallet}
                  onChange={(e) =>
                    handleRecordChange(index, "wallet", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {wallets.map((wallet) => (
                    <option key={wallet} value={wallet}>
                      {wallet}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Balance"
                  value={record.balance}
                  onChange={(e) =>
                    handleRecordChange(index, "balance", e.target.value)
                  }
                  required
                  className="w-full border rounded px-1"
                />
                {records.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(index)}
                    className="bg-red-500 rounded px-1"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRecord}
              className="px-1 rounded bg-red-500"
            >
              ADD RECORD
            </button>
            <button type="submit" className="w-full rounded px-1 bg-red-500">
              SAVE
            </button>
          </form>
        )}
      </div>

      {/* Show/Hide Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="h-24 w-5 bg-red-300 absolute top-1/2 transform -translate-y-1/2 translate-2/2 text-sm rounded-r-2xl"
        style={{ right: "-20px" }}
      >
        {">"}
      </button>
    </div>
  );
};

export default Sidebar;
