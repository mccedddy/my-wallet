import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const Modal = ({ user, toggleModal, wallets, setWallets, onUpdate, type }) => {
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);
  const [description, setDescription] = useState("");
  const [newWallets, setNewWallets] = useState([{ walletName: "" }]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const localTime = new Date(now.getTime());

    const defaultDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(localTime);

    const defaultTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(localTime);

    setDate(defaultDate);
    setTime(defaultTime.substring(0, 5));
  }, []);

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const handleWalletChange = (index, value) => {
    const updatedWallets = [...newWallets];
    updatedWallets[index].walletName = value;
    setNewWallets(updatedWallets);
  };

  const handleAddRecord = () => {
    setRecords([...records, { wallet: "", balance: "" }]);
  };

  const handleAddWallet = () => {
    setNewWallets([...newWallets, { walletName: "" }]);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleDeleteWallet = (index) => {
    const updatedWallets = newWallets.filter((_, i) => i !== index);
    setNewWallets(updatedWallets);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (type === "addRecord") {
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

        const timestamp = `${date} ${time}`;

        const newDocRef = doc(recordsCollectionRef, timestamp);
        await setDoc(newDocRef, { ...mergedRecords, description, timestamp });

        await setDoc(latestDocRef, mergedRecords);

        console.log("Records saved successfully");
        onUpdate();
        toggleModal();
      } catch (error) {
        console.error("Error saving records: ", error);
      }
    } else if (type === "addWallet") {
      // Save wallets
      const uniqueWallets = newWallets.reduce((acc, curr) => {
        if (curr.walletName) acc[curr.walletName] = curr;
        return acc;
      }, {});
      const filteredWallets = Object.keys(uniqueWallets);

      // Reset wallets after saving
      setNewWallets([{ walletName: "" }]);

      console.log("Saving wallets:", filteredWallets);

      try {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const updatedWallets = [
            ...(userData.wallets || []),
            ...filteredWallets,
          ];

          await setDoc(
            userDocRef,
            { wallets: updatedWallets },
            { merge: true }
          );

          setWallets(updatedWallets);
          onUpdate();
          toggleModal();
        }
      } catch (error) {
        console.error("Error saving wallets: ", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-customBlack bg-opacity-25 shadow-lg"
      onClick={toggleModal}
    >
      <div
        className="h-2/6 md:h-3/6 lg:h-4/6 w-10/12 md:w-7/12 lg:w-4/12 flex flex-col items-center rounded bg-customWhite"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 w-full p-3 bg-customBlue flex rounded-t justify-between items-center">
          <h1 className="text-customWhite">
            {type === "addRecord" ? "Add Record" : "Add Wallet"}
          </h1>
          <h1
            onClick={toggleModal}
            className="cursor-pointer font-bold text-xl text-customWhite"
          >
            ×
          </h1>
        </div>
        <div className="h-full w-full p-3 bg-customWhite overflow-y-auto custom-scrollbar">
          <form
            id="modalForm"
            onSubmit={handleSave}
            className="flex flex-col gap-1"
          >
            {type === "addRecord" ? (
              <>
                {records.map((record, index) => (
                  <div key={index} className="flex gap-1 items-center">
                    <select
                      className="border border-gray-300 rounded w-32 text-customBlack outline-customBlue"
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
                      className="w-full border border-gray-300 rounded px-1 text-customBlack outline-customBlue"
                    />
                    {records.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(index)}
                        className="h-6 px-2 text-xs bg-customBlack-lighter rounded text-white"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRecord}
                  className="h-6 w-12 px-2 text-xs bg-customBlue rounded text-white"
                >
                  +
                </button>
                <div className="flex mt-2 gap-1">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded text-customBlack outline-customBlue"
                  ></input>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-gray-300 rounded text-customBlack outline-customBlue"
                  ></input>
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-1 text-customBlack outline-customBlue"
                />
              </>
            ) : (
              <>
                {newWallets.map((wallet, index) => (
                  <div key={index} className="flex gap-1 items-center">
                    <input
                      type="text"
                      placeholder="Wallet Name"
                      value={wallet.walletName}
                      onChange={(e) =>
                        handleWalletChange(index, e.target.value)
                      }
                      required
                      className="w-full border border-gray-300 rounded px-1 text-customBlack outline-customBlue"
                    />
                    {newWallets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteWallet(index)}
                        className="h-6 px-2 text-xs bg-customBlack-lighter rounded text-white"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddWallet}
                  className="h-6 w-12 px-2 text-xs bg-customBlue rounded text-white"
                >
                  +
                </button>
              </>
            )}
          </form>
        </div>
        <div className="h-10 w-full p-3 bg-customWhite flex rounded-b items-center">
          <button
            type="submit"
            form="modalForm"
            className="bg-customBlue px-2 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;