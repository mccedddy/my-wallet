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

const Sidebar = ({ user }) => {
  const [walletName, setWalletName] = useState("");
  const [wallets, setWallets] = useState([]);
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);

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
    } catch (error) {
      console.error("Error saving records: ", error);
    }
  };

  return (
    <div className="h-full w-3/12 flex flex-col bg-red-200 py-2 px-4 gap-2">
      <form onSubmit={handleAddWallet} className="flex flex-col gap-1">
        <h1 className="font-bold">WALLETS</h1>
        <ul className="flex flex-col gap-1">
          {wallets.map((wallet) => (
            <div className="flex justify-between" key={wallet}>
              <h1 value={wallet}>{wallet}</h1>
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

      <form onSubmit={handleSave} className="flex flex-col gap-1">
        <h1 className="font-bold">RECORD</h1>
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
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleAddRecord}
            className="w-5/12 px-1 rounded bg-red-500"
          >
            +
          </button>
          <button type="submit" className="w-full rounded px-1 bg-red-500">
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sidebar;
