import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const Modal = ({ user, toggleModal, wallets, setWallets, onUpdate }) => {
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);
  const [description, setDescription] = useState("");

  // Fetch wallet names
  useEffect(() => {
    if (user?.email) {
      const fetchWalletNames = async () => {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setWallets(data.wallets || []);
        }
      };

      fetchWalletNames();
    }
  }, [user, setWallets]);

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const handleAddRecord = () => {
    setRecords([...records, { wallet: "", balance: "" }]);
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

    // Reset records and description after saving
    setRecords([{ wallet: "", balance: "" }]);
    setDescription("");

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
      await setDoc(newDocRef, { ...mergedRecords, description, timestamp });

      await setDoc(latestDocRef, mergedRecords);

      console.log("Records saved successfully");
      onUpdate();
      toggleModal();
    } catch (error) {
      console.error("Error saving records: ", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
      onClick={toggleModal}
    >
      <div
        className="h-4/6 w-11/12 md:w-8/12 lg:w-6/12 flex flex-col items-center rounded bg-red-100 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 w-full p-3 bg-red-300 flex rounded-t justify-between items-center">
          <h1 className="">Add Record</h1>
          <h1
            onClick={toggleModal}
            className="cursor-pointer font-bold text-xl"
          >
            ×
          </h1>
        </div>
        <div className="h-full w-full p-3 bg-red-100 overflow-y-auto custom-scrollbar">
          <form
            id="recordForm"
            onSubmit={handleSave}
            className="flex flex-col gap-1"
          >
            {records.map((record, index) => (
              <div key={index} className="flex gap-1 items-center">
                <select
                  className="border rounded w-32"
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
              className="px-1 w-24 text-white rounded bg-red-500"
            >
              +
            </button>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-1"
            />
          </form>
        </div>
        <div className="h-10 w-full p-3 bg-red-100 flex rounded-b items-center">
          <button
            type="submit"
            form="recordForm"
            className="px-2 bg-red-500 text-white rounded"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
