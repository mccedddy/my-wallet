import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const Modal = ({ user, toggleModal, wallets, setWallets, onUpdate, type }) => {
  const [records, setRecords] = useState([{ wallet: "", balance: "" }]);
  const [description, setDescription] = useState("");
  const [newWallets, setNewWallets] = useState([{ walletName: "" }]);

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
      onClick={toggleModal}
    >
      <div
        className="h-2/6 md:h-3/6 lg:h-4/6 w-10/12 md:w-7/12 lg:w-4/12 flex flex-col items-center rounded bg-red-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 w-full p-3 bg-red-300 flex rounded-t justify-between items-center">
          <h1 className="">
            {type === "addRecord" ? "Add Record" : "Add Wallet"}
          </h1>
          <h1
            onClick={toggleModal}
            className="cursor-pointer font-bold text-xl"
          >
            ×
          </h1>
        </div>
        <div className="h-full w-full p-3 bg-red-100 overflow-y-auto custom-scrollbar">
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
                        className="h-6 px-2 text-xs bg-red-500 rounded text-white"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRecord}
                  className="h-6 w-12 px-2 text-xs bg-red-500 rounded text-white"
                >
                  +
                </button>
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-2 border rounded px-1"
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
                      className="w-full border rounded px-1"
                    />
                    {newWallets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteWallet(index)}
                        className="h-6 px-2 text-xs bg-red-500 rounded text-white"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddWallet}
                  className="h-6 w-12 px-2 text-xs bg-red-500 rounded text-white"
                >
                  +
                </button>
              </>
            )}
          </form>
        </div>
        <div className="h-10 w-full p-3 bg-red-100 flex rounded-b items-center">
          <button
            type="submit"
            form="modalForm"
            className="h-6 px-2 text-xs bg-red-500 rounded text-white"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
