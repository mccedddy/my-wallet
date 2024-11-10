import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { toastSuccess, toastError } from "../toastUtils";
import trashIcon from "../assets/icons/trash.svg";
import addIcon from "../assets/icons/add.svg";
import { useSelector, useDispatch } from "react-redux";
import { toggleReRender } from "../reducers/walletSlice";

const Modal = ({ toggleModal, type }) => {
  const user = useSelector((state) => state.user.value);
  const wallets = useSelector((state) => state.wallet.wallets);

  const dispatch = useDispatch();

  const [newRecords, setNewRecords] = useState([{ wallet: "", balance: "" }]);
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
      // hour12: true,
    }).format(localTime);

    setDate(defaultDate);
    setTime(defaultTime);
  }, []);

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...newRecords];
    updatedRecords[index][field] = value;
    setNewRecords(updatedRecords);
  };

  const handleWalletChange = (index, value) => {
    const updatedWallets = [...newWallets];
    updatedWallets[index].walletName = value;
    setNewWallets(updatedWallets);
  };

  const handleAddRecord = () => {
    setNewRecords([...newRecords, { wallet: "", balance: "" }]);
  };

  const handleAddWallet = () => {
    setNewWallets([...newWallets, { walletName: "" }]);
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = newRecords.filter((_, i) => i !== index);
    setNewRecords(updatedRecords);
  };

  const handleDeleteWallet = (index) => {
    const updatedWallets = newWallets.filter((_, i) => i !== index);
    setNewWallets(updatedWallets);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (type === "addRecord") {
      const uniqueRecords = newRecords.reduce((acc, curr) => {
        acc[curr.wallet] = curr;
        return acc;
      }, {});
      const filteredRecords = Object.values(uniqueRecords);

      setNewRecords([{ wallet: "", balance: "" }]);
      setDescription("");

      try {
        const recordsCollectionRef = collection(
          db,
          "users",
          user.email,
          "records"
        );
        const timestamp = `${date} ${time}`;

        // Query to get the latest document to set id and merge
        const q = query(recordsCollectionRef, orderBy("id", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        let mergedRecords = {};

        let id = 1;
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const data = latestDoc.data();
          mergedRecords = data;

          if (data.id) {
            id = data.id + 1;
          }
        }

        filteredRecords.forEach((record) => {
          mergedRecords[record.wallet] = record.balance;
        });

        // Create a new document with the records
        const newDocRef = doc(recordsCollectionRef, id.toString());
        await setDoc(newDocRef, {
          ...mergedRecords,
          id,
          description,
          timestamp,
        });

        toastSuccess("Record saved successfully");
        toggleModal();
        dispatch(toggleReRender());
      } catch (error) {
        console.log(error);
        toastError(`Error saving record: ${error}`);
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

          toastSuccess("Wallet created successfully");
          toggleModal();
          dispatch(toggleReRender());
        }
      } catch (error) {
        toastError(`Error saving wallet: ${error}`);
      }
    }
  };

  const renderAddRecord = () => {
    return (
      <>
        {newRecords.map((record, index) => (
          <div key={index} className="flex gap-1 items-center">
            <select
              className="h-8 rounded w-32 text-text bg-secondary"
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
              className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
            />
            {newRecords.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteRecord(index)}
                className="h-8 w-10 p-2 text-xs bg-background-lighter flex justify-center rounded text-text-dark"
              >
                <img src={trashIcon} alt="trash" className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRecord}
          className="h-8 w-full p-1 my-2 text-xs flex justify-center bg-background-lighter rounded text-text-dark"
        >
          <img src={addIcon} alt="trash" className="h-6 w-6" />
        </button>
        <div className="flex gap-1">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-8 px-2 rounded text-text outline-none bg-background-lighter"
          ></input>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-8 px-2 rounded text-text outline-none bg-background-lighter"
          ></input>
        </div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
        />
      </>
    );
  };

  const renderEditRecord = () => {
    return (
      <>
        {newRecords.map((record, index) => (
          <div key={index} className="flex gap-1 items-center">
            <select
              className="h-8 rounded w-32 text-text bg-secondary"
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
              className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
            />
            {newRecords.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteRecord(index)}
                className="h-8 w-10 p-2 text-xs bg-background-lighter flex justify-center rounded text-text-dark"
              >
                <img src={trashIcon} alt="trash" className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRecord}
          className="h-8 w-full p-1 my-2 text-xs flex justify-center bg-background-lighter rounded text-text-dark"
        >
          <img src={addIcon} alt="trash" className="h-6 w-6" />
        </button>
        <div className="flex gap-1">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-8 px-2 rounded text-text outline-none bg-background-lighter"
          ></input>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-8 px-2 rounded text-text outline-none bg-background-lighter"
          ></input>
        </div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
        />
      </>
    );
  };

  const renderAddWallet = () => {
    return (
      <>
        {newWallets.map((wallet, index) => (
          <div key={index} className="flex gap-1 items-center">
            <input
              type="text"
              placeholder="Wallet Name"
              value={wallet.walletName}
              onChange={(e) => handleWalletChange(index, e.target.value)}
              required
              className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
            />
            {newWallets.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteWallet(index)}
                className="h-8 w-10 p-2 text-xs bg-background-lighter flex justify-center rounded text-text-dark"
              >
                <img src={trashIcon} alt="trash" className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddWallet}
          className="h-8 w-full p-1 my-2 text-xs flex justify-center bg-background-lighter text-text-dark rounded"
        >
          <img src={addIcon} alt="add" className="h-6 w-6" />
        </button>
      </>
    );
  };

  const renderEditWallet = () => {
    <>
      {newWallets.map((wallet, index) => (
        <div key={index} className="flex gap-1 items-center">
          <input
            type="text"
            placeholder="Wallet Name"
            value={wallet.walletName}
            onChange={(e) => handleWalletChange(index, e.target.value)}
            required
            className="w-full h-8 rounded px-2 text-text outline-none bg-background-lighter"
          />
          {newWallets.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteWallet(index)}
              className="h-8 w-10 p-2 text-xs bg-background-lighter flex justify-center rounded text-text-dark"
            >
              <img src={trashIcon} alt="add" className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </>;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-30 shadow-lg"
      onClick={toggleModal}
    >
      <div
        className="h-3/6 md:h-3/6 lg:h-4/6 w-10/12 md:w-7/12 lg:w-4/12 flex flex-col items-center rounded bg-background-light"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 w-full p-3 bg-secondary flex rounded-t justify-between items-center">
          <h1 className="">
            {type === "addRecord" && "Add Record"}
            {type === "editRecord" && "Edit Record"}
            {type === "addWallet" && "Add Wallet"}
            {type === "editWallet" && "Edit Wallet"}
          </h1>
          <h1
            onClick={toggleModal}
            className="cursor-pointer text-text hover:text-text-dark font-bold text-xl"
          >
            ×
          </h1>
        </div>
        <div className="h-full w-full p-3 bg-background-light overflow-y-auto custom-scrollbar">
          <form
            id="modalForm"
            onSubmit={handleSave}
            className="flex flex-col gap-1"
          >
            {type === "addRecord" && renderAddRecord()}
            {type === "editRecord" && renderEditRecord()}
            {type === "addWallet" && renderAddWallet()}
            {type === "editWallet" && renderEditWallet()}
          </form>
        </div>
        <div className="h-10 w-full px-3 py-7 flex justify-between rounded-b items-center">
          <button
            type="submit"
            form="modalForm"
            className="h-8 bg-accent text-background px-4 rounded"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
